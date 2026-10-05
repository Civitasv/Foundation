"""后台数学审校：将讲稿公式转写为数值运算，与独立求导核对。

这些测试不进入课件，也不构成公式的普遍性证明。
"""
import unittest
import numpy as np
import torch
from edtrace.execute_util import pop_renderings
import machine_learning


class TheoryChecks(unittest.TestCase):
    def test_full_backprop_recurrence_against_autograd(self):
        rng = np.random.default_rng(41)
        x = rng.normal(size=(7, 3))
        y = np.array([0., 1., 1., 0., 1., 0., 1.])
        weights = [rng.normal(0, .3, (5, 3)), rng.normal(0, .3, (4, 5)), rng.normal(0, .3, (1, 4))]
        biases = [rng.normal(0, .2, 5), rng.normal(0, .2, 4), rng.normal(0, .2, 1)]
        h = [x.T]
        for w, b in zip(weights[:-1], biases[:-1]):
            h.append(np.tanh(w @ h[-1] + b[:, None]))
        logits = weights[-1] @ h[-1] + biases[-1][:, None]
        delta = (1 / (1 + np.exp(-logits)) - y) / len(y)
        gradients = []
        for layer in reversed(range(len(weights))):
            gradients.append((layer, delta @ h[layer].T, delta.sum(axis=1)))
            if layer:
                delta = (weights[layer].T @ delta) * (1 - h[layer] ** 2)
        tw = [torch.tensor(w, requires_grad=True) for w in weights]
        tb = [torch.tensor(b, requires_grad=True) for b in biases]
        th = torch.tensor(x.T)
        for w, b in zip(tw[:-1], tb[:-1]):
            th = torch.tanh(w @ th + b[:, None])
        tz = (tw[-1] @ th + tb[-1][:, None]).flatten()
        torch.nn.functional.binary_cross_entropy_with_logits(tz, torch.tensor(y)).backward()
        for layer, dw, db in gradients:
            np.testing.assert_allclose(dw, tw[layer].grad.numpy(), atol=1e-12)
            np.testing.assert_allclose(db, tb[layer].grad.numpy(), atol=1e-12)

    def test_kernel_norm_and_regularized_gradient(self):
        rng = np.random.default_rng(13)
        phi = rng.normal(size=(8, 5))
        kernel = phi @ phi.T
        a = rng.normal(size=8)
        b, lam = .3, .2
        y = np.array([0., 1.] * 4)
        np.testing.assert_allclose(np.linalg.norm(phi.T @ a) ** 2, a @ kernel @ a)
        z = kernel @ a + b
        residual = (1 / (1 + np.exp(-z)) - y) / len(y)
        expected = kernel.T @ residual + lam * kernel @ a
        ta = torch.tensor(a, requires_grad=True)
        tk = torch.tensor(kernel)
        tb = torch.tensor(b, dtype=torch.float64, requires_grad=True)
        objective = torch.nn.functional.binary_cross_entropy_with_logits(tk @ ta + tb, torch.tensor(y)) + lam / 2 * (ta @ tk @ ta)
        objective.backward()
        np.testing.assert_allclose(expected, ta.grad.numpy(), atol=1e-12)
        np.testing.assert_allclose(residual.sum(), tb.grad.numpy(), atol=1e-12)

    def test_regression_and_softmax_gradients(self):
        rng = np.random.default_rng(17)
        x, w, y = rng.normal(size=(9, 4)), rng.normal(size=4), rng.normal(size=9)
        tw = torch.tensor(w, requires_grad=True)
        b = torch.tensor(.2, dtype=torch.float64, requires_grad=True)
        loss = ((torch.tensor(x) @ tw + b - torch.tensor(y)) ** 2).mean() / 2
        loss.backward()
        r = x @ w + .2 - y
        np.testing.assert_allclose(x.T @ r / len(y), tw.grad.numpy(), atol=1e-12)
        np.testing.assert_allclose(r.mean(), b.grad.numpy(), atol=1e-12)
        logits = torch.tensor(rng.normal(size=(6, 5)), requires_grad=True)
        targets = torch.tensor([0, 1, 2, 3, 4, 0])
        torch.nn.functional.cross_entropy(logits, targets).backward()
        expected = (logits.softmax(dim=1) - torch.nn.functional.one_hot(targets, 5)) / 6
        np.testing.assert_allclose(logits.grad.numpy(), expected.detach().numpy(), atol=1e-12)

    def test_svm_primal_dual_and_complementarity(self):
        # Closed-form fixture checks the signs, C constraint and 1/2 convention.
        x, y = np.array([[-1.], [1.]]), np.array([-1., 1.])
        for c in [.1, 1.]:
            beta = np.full(2, min(c, .5))
            w = (beta * y) @ x
            margins = y * (x @ w)
            slack = np.maximum(0, 1 - margins)
            primal = float(w @ w / 2 + c * slack.sum())
            dual = float(beta.sum() - (beta * y) @ (x @ x.T) @ (beta * y) / 2)
            self.assertAlmostEqual(primal, dual)
            self.assertAlmostEqual(beta @ y, 0)
            np.testing.assert_allclose(beta * (margins - 1 + slack), 0)
            np.testing.assert_allclose((c - beta) * slack, 0)

    def test_theory_presentation_executes_without_experiment_renderings(self):
        pop_renderings()
        machine_learning.main()
        renderings = pop_renderings()
        self.assertTrue(renderings)
        self.assertTrue(all(item.type == 'markdown' for item in renderings))
        prose = '\n'.join(item.data for item in renderings)
        self.assertGreater(sum('\u4e00' <= char <= '\u9fff' for char in prose), 3000)
        for fragment in ['反向传播', '半正定', '总体风险', '对偶']:
            self.assertIn(fragment, prose)


if __name__ == '__main__':
    unittest.main()
