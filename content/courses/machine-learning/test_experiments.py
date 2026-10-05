"""连续课件的行为检查：完整求导链、统一实验协议与可发布图表。"""

from __future__ import annotations

import json
import unittest

import numpy as np
import torch
from edtrace.execute_util import pop_renderings

import classification
import experiments
import machine_learning


def finite_difference(function, value, epsilon=1e-6):
    """逐参数中心差分，只使用标量目标的前向值。"""
    value = np.asarray(value, dtype=np.float64)
    gradient = np.empty_like(value)
    for index in np.ndindex(value.shape):
        plus, minus = value.copy(), value.copy()
        plus[index] += epsilon
        minus[index] -= epsilon
        gradient[index] = (function(plus) - function(minus)) / (2 * epsilon)
    return gradient


class DatasetAccessLog(dict):
    """记录真实选模过程读取数据集的顺序，不替换训练或评价。"""

    def __init__(self, values):
        super().__init__(values)
        self.accesses = []

    def __getitem__(self, key):
        self.accesses.append(key)
        return super().__getitem__(key)


class ExperimentTests(unittest.TestCase):
    """预期来自独立数学计算与数据干预，不依赖讲稿的具体措辞。"""

    @classmethod
    def setUpClass(cls):
        cls.data = classification.make_dataset()
        cls.result = classification.select_model(cls.data)

    def tearDown(self):
        pop_renderings()

    def test_stable_sigmoid_bce_and_report_at_extreme_logits(self):
        """捕获先取 sigmoid 再 log 导致的溢出、无穷损失或错误归一化。"""
        logits = np.array([-10000.0, 0.0, 10000.0])
        with np.errstate(over="raise", invalid="raise", divide="raise"):
            probabilities = experiments.sigmoid(logits)
            correct = experiments.binary_loss_from_logits(logits[[0, 2]], [0, 1])
            incorrect = experiments.binary_loss_from_logits(logits[[0, 2]], [1, 0])
            zero = experiments.binary_loss_from_logits([0, 0], [0, 1])
            report = classification.report(
                {"kind": "linear", "w": np.array([10000.0, 0.0]), "b": 0.0},
                np.array([[-1.0, 0.0], [1.0, 0.0]]),
                np.array([1.0, 0.0]),
            )
        np.testing.assert_array_equal(probabilities, [0.0, 0.5, 1.0])
        self.assertEqual(correct, 0.0)
        self.assertEqual(incorrect, 10000.0)
        self.assertAlmostEqual(zero, np.log(2.0))
        self.assertEqual(report, {"loss": 10000.0, "accuracy": 0.0})

    def test_dataset_is_reproducible_with_distinct_noisy_splits(self):
        """捕获随机种子失效、划分复用或标签不再对应带噪 XOR 的变化。"""
        repeated = classification.make_dataset()
        for split, count in (("train", 96), ("val", 256), ("test", 256)):
            x, y = self.data[f"{split}_x"], self.data[f"{split}_y"]
            self.assertEqual(x.shape, (count, 2))
            self.assertEqual(y.shape, (count,))
            self.assertTrue(np.all((-1.0 <= x) & (x <= 1.0)))
            self.assertTrue(np.all((y == 0.0) | (y == 1.0)))
            np.testing.assert_array_equal(x, repeated[f"{split}_x"])
            np.testing.assert_array_equal(y, repeated[f"{split}_y"])
            clean = x[:, 0] * x[:, 1] < 0.0
            noise_fraction = np.mean(y != clean)
            self.assertGreater(noise_fraction, 0.0)
            self.assertLess(noise_fraction, 0.2)
        self.assertFalse(np.array_equal(self.data["val_x"], self.data["test_x"]))
        self.assertFalse(np.array_equal(self.data["train_x"], self.data["val_x"][:96]))
        changed_seed = classification.make_dataset(seed=11)
        self.assertFalse(np.array_equal(self.data["train_x"], changed_seed["train_x"]))

    def test_complete_network_gradient_matches_numerical_and_autograd(self):
        """捕获 tanh 链式法则、batch 归一化、任一权重或偏置梯度的错误。"""
        rng = np.random.default_rng(41)
        x = rng.normal(size=(7, 2)).astype(np.float64)
        y = np.array([0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0])
        parameters = {
            "w1": rng.normal(0.0, 0.4, (2, 5)),
            "b1": rng.normal(0.0, 0.2, 5),
            "w2": rng.normal(0.0, 0.4, 5),
            "b2": np.array(0.3, dtype=np.float64),
        }
        actual_loss, gradients = machine_learning.network_loss_and_gradients(
            x, y, **parameters
        )

        def objective(values):
            logits = np.tanh(x @ values["w1"] + values["b1"]) @ values["w2"] + values["b2"]
            return float(np.mean(np.logaddexp(0.0, logits) - y * logits))

        torch_parameters = {
            key: torch.tensor(value, dtype=torch.float64, requires_grad=True)
            for key, value in parameters.items()
        }
        torch_x, torch_y = torch.tensor(x), torch.tensor(y)
        torch_hidden = torch.tanh(torch_x @ torch_parameters["w1"] + torch_parameters["b1"])
        torch_logits = torch_hidden @ torch_parameters["w2"] + torch_parameters["b2"]
        torch_loss = torch.nn.functional.binary_cross_entropy_with_logits(torch_logits, torch_y)
        torch_loss.backward()
        self.assertAlmostEqual(actual_loss, float(torch_loss.detach()), places=13)
        for key, value in parameters.items():
            with self.subTest(parameter=key):
                numerical = finite_difference(
                    lambda changed: objective(dict(parameters, **{key: changed})), value
                )
                self.assertEqual(np.shape(gradients[key]), np.shape(value))
                np.testing.assert_allclose(gradients[key], numerical, rtol=1e-6, atol=1e-8)
                np.testing.assert_allclose(
                    gradients[key], torch_parameters[key].grad.numpy(), rtol=1e-12, atol=1e-12
                )

    def test_kernel_actual_update_matches_rkhs_objective_gradient(self):
        """在非零系数上捕获把 aᵀKa 正则写成 aᵀa 或漏算 bias 的错误。"""
        rng = np.random.default_rng(19)
        x = rng.uniform(-1.0, 1.0, (9, 2))
        y = (x[:, 0] * x[:, 1] < 0).astype(float)
        alpha, l2, sigma = 0.05, 0.03, 0.7
        before = classification.fit_kernel(x, y, steps=1, alpha=alpha, l2=l2, sigma=sigma)
        after = classification.fit_kernel(x, y, steps=2, alpha=alpha, l2=l2, sigma=sigma)
        distances = ((x[:, None, :] - x[None, :, :]) ** 2).sum(axis=2)
        kernel = np.exp(-distances / (2 * sigma**2))
        np.testing.assert_allclose(classification.rbf_kernel(x, x, sigma), kernel)
        np.testing.assert_array_equal(np.diag(kernel), np.ones(len(x)))
        self.assertGreaterEqual(float(np.linalg.eigvalsh(kernel).min()), -1e-12)

        def objective(coefficients, b):
            logits = kernel @ coefficients + b
            data_loss = np.mean(np.logaddexp(0.0, logits) - y * logits)
            return float(data_loss + l2 * (coefficients @ kernel @ coefficients) / 2)

        numerical_a = finite_difference(
            lambda value: objective(value, before["b"]), before["coefficients"]
        )
        numerical_b = finite_difference(
            lambda value: objective(before["coefficients"], value), before["b"]
        )
        actual_a = (before["coefficients"] - after["coefficients"]) / alpha
        actual_b = (before["b"] - after["b"]) / alpha
        np.testing.assert_allclose(actual_a, numerical_a, rtol=1e-6, atol=1e-8)
        np.testing.assert_allclose(actual_b, numerical_b, rtol=1e-6, atol=1e-8)
        self.assertAlmostEqual(
            after["history"][-1]["loss"], objective(after["coefficients"], after["b"]), places=13
        )
        evaluation = classification.report(after, x, y)
        self.assertLess(evaluation["loss"], after["history"][-1]["loss"])

    def test_representation_improves_validation_and_selection_uses_bce(self):
        """捕获特征未生效、候选漏训、误用训练损失或准确率选模的变化。"""
        rows = self.result["rows"]
        self.assertEqual(len(rows), 8)
        by_name = {row["name"]: row for row in rows}
        self.assertLess(by_name["interaction"]["val_loss"], by_name["linear"]["val_loss"] - 0.15)
        self.assertGreater(
            by_name["interaction"]["val_accuracy"], by_name["linear"]["val_accuracy"] + 0.2
        )
        winner = min(rows, key=lambda row: row["val_loss"])
        self.assertEqual(self.result["selected"]["name"], winner["name"])
        for model in self.result["models"].values():
            losses = np.array([row["loss"] for row in model["history"]])
            self.assertTrue(np.isfinite(losses).all())
            self.assertLess(losses[-1], losses[0])

    def test_test_labels_cannot_change_selection_and_are_read_last(self):
        """真实重训后仅翻转测试标签，选模不变；测试样本只在最后读取。"""
        logged = DatasetAccessLog(dict(self.data, test_y=1.0 - self.data["test_y"]))
        changed = classification.select_model(logged)
        self.assertEqual(changed["rows"], self.result["rows"])
        self.assertEqual(changed["selected"]["name"], self.result["selected"]["name"])
        self.assertNotEqual(changed["test"], self.result["test"])
        np.testing.assert_array_equal(
            classification.predict_logits(changed["selected"]["model"], self.data["test_x"]),
            classification.predict_logits(self.result["selected"]["model"], self.data["test_x"]),
        )
        self.assertEqual(logged.accesses[-2:], ["test_x", "test_y"])
        self.assertEqual(logged.accesses.count("test_x"), 1)
        self.assertEqual(logged.accesses.count("test_y"), 1)

    def test_validation_labels_change_selection_without_changing_training(self):
        """验证数据只负责比较方案，不能进入参数拟合，也不能被选模忽略。"""
        changed_data = dict(self.data, val_y=1.0 - self.data["val_y"])
        changed = classification.select_model(changed_data)
        self.assertNotEqual(changed["selected"]["name"], self.result["selected"]["name"])
        independent_losses = {}
        for name, model in changed["models"].items():
            logits = classification.predict_logits(model, changed_data["val_x"])
            np.testing.assert_array_equal(
                logits,
                classification.predict_logits(self.result["models"][name], self.data["val_x"]),
            )
            independent_losses[name] = float(
                torch.nn.functional.binary_cross_entropy_with_logits(
                    torch.tensor(logits), torch.tensor(changed_data["val_y"])
                )
            )
        self.assertEqual(
            changed["selected"]["name"], min(independent_losses, key=independent_losses.get)
        )

    def test_continuous_main_emits_chinese_explanation_and_valid_plot_data(self):
        """真实执行完整课件，捕获入口失效、空课件及 NaN/NumPy 等图表数据。"""
        pop_renderings()
        machine_learning.main()
        renderings = pop_renderings()
        plots = [item.data for item in renderings if item.type == "plot"]
        self.assertGreater(len(plots), 4)
        prose = "\n".join(item.data for item in renderings if item.type == "markdown")
        self.assertGreater(sum("\u4e00" <= character <= "\u9fff" for character in prose), 1000)

        def dataset_lengths(value):
            if isinstance(value, dict):
                for key, child in value.items():
                    if key == "data" and isinstance(child, dict) and "values" in child:
                        yield len(child["values"])
                    yield from dataset_lengths(child)
            elif isinstance(value, list):
                for child in value:
                    yield from dataset_lengths(child)

        for spec in plots:
            with self.subTest(plot=spec.get("title")):
                json.loads(json.dumps(spec, allow_nan=False))
                counts = list(dataset_lengths(spec))
                self.assertTrue(counts)
                self.assertTrue(all(count > 0 for count in counts))


if __name__ == "__main__":
    unittest.main()
