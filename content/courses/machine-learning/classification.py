"""整份课件共用的人工 XOR 分类实验；只依赖 NumPy，不读取外部数据。

输入是 [-1, 1]² 内的均匀随机点，两个坐标异号时干净标签为 1，
再独立地以 8% 的概率翻转标签。这是可控的教学数据，不代表现实任务。
所有模型使用全批量梯度下降；报告的交叉熵不含正则项。
"""

from __future__ import annotations

import numpy as np

from experiments import binary_loss_from_logits, sigmoid


def make_dataset(seed=7):
    """以三个独立随机流生成训练 96、验证 256、测试 256 个观测。

    每组 x 形状为 (n, 2)，y 为 (n,)。seed 固定时可重复；8% 是每次
    标签翻转的概率，并不强制每个有限样本集恰有 8% 的错误标签。
    """
    streams = np.random.SeedSequence(seed).spawn(3)
    data = {}
    for split, count, stream in zip(
        ("train", "val", "test"), (96, 256, 256), streams
    ):
        rng = np.random.default_rng(stream)
        x = rng.uniform(-1.0, 1.0, size=(count, 2))
        clean_y = x[:, 0] * x[:, 1] < 0.0
        flips = rng.random(count) < 0.08
        data[f"{split}_x"] = x
        data[f"{split}_y"] = np.logical_xor(clean_y, flips).astype(float)
    return data


def _features(x, interaction=False):
    x = np.asarray(x, dtype=float)
    if x.ndim != 2 or x.shape[1] != 2 or len(x) == 0:
        raise ValueError("x 必须是形状为 (n, 2) 的非空数组")
    if interaction:
        return np.column_stack((x, x[:, 0] * x[:, 1]))
    return x


def _targets(y, count):
    y = np.asarray(y, dtype=float)
    if y.shape != (count,) or not np.all((y == 0.0) | (y == 1.0)):
        raise ValueError("y 必须是与 x 等长、仅含 0 或 1 的一维数组")
    return y


def _training_options(steps, alpha, l2):
    if not isinstance(steps, (int, np.integer)) or steps < 0:
        raise ValueError("steps 必须是非负整数")
    if not np.isfinite(alpha) or alpha <= 0.0:
        raise ValueError("alpha 必须是有限正数")
    if not np.isfinite(l2) or l2 < 0.0:
        raise ValueError("l2 必须是有限非负数")


def fit_logistic(x, y, interaction=False, steps=2000, alpha=0.2, l2=0.0):
    """拟合线性 logit，或加入乘积特征后的 logit。

    目标为平均 BCE + l2*sum(w²)/2，不惩罚截距 b。w 形状分别为
    (2,) 或 (3,)。history.loss 是含正则项的训练目标，记录初始值、
    每 50 步与最后一步；report 返回不含正则项的可比较指标。
    """
    design = _features(x, interaction)
    y = _targets(y, len(design))
    _training_options(steps, alpha, l2)
    w = np.zeros(design.shape[1])
    b = 0.0
    logits = design @ w + b
    history = [{"step": 0, "loss": binary_loss_from_logits(logits, y)}]
    for step in range(1, steps + 1):
        dz = (sigmoid(logits) - y) / len(design)
        dw = design.T @ dz + l2 * w
        db = float(dz.sum())
        w -= alpha * dw
        b -= alpha * db
        logits = design @ w + b
        if step % 50 == 0 or step == steps:
            loss = binary_loss_from_logits(logits, y) + l2 * float(w @ w) / 2
            history.append({"step": step, "loss": loss})
    return {
        "kind": "interaction" if interaction else "linear",
        "w": w,
        "b": b,
        "history": history,
    }


def fit_network(x, y, width=8, steps=4000, alpha=0.1, l2=0.001, seed=7):
    """拟合单隐藏层 tanh 网络；从同一组旧参数计算全部梯度后再更新。

    h=tanh(x@w1+b1)，z=h@w2+b2，目标为平均 BCE 加上
    l2*(sum(w1²)+sum(w2²))/2；不惩罚两个 bias。
    w1/b1/w2 的形状为 (2,width)/(width,)/(width,)，b2 是标量。
    history.loss 含正则项，记录初始值、每 50 步与最后一步。
    """
    x = _features(x)
    y = _targets(y, len(x))
    _training_options(steps, alpha, l2)
    if not isinstance(width, (int, np.integer)) or width < 1:
        raise ValueError("width 必须是正整数")
    rng = np.random.default_rng(seed)
    w1 = rng.normal(0.0, 1.0 / np.sqrt(2), size=(2, width))
    b1 = np.zeros(width)
    w2 = rng.normal(0.0, 1.0 / np.sqrt(width), size=width)
    b2 = 0.0

    def objective(logits):
        penalty = l2 * float(np.sum(w1**2) + w2 @ w2) / 2
        return binary_loss_from_logits(logits, y) + penalty

    hidden = np.tanh(x @ w1 + b1)
    logits = hidden @ w2 + b2
    history = [{"step": 0, "loss": objective(logits)}]
    for step in range(1, steps + 1):
        dz = (sigmoid(logits) - y) / len(x)
        dw2 = hidden.T @ dz + l2 * w2
        db2 = float(dz.sum())
        da1 = np.outer(dz, w2) * (1.0 - hidden**2)
        dw1 = x.T @ da1 + l2 * w1
        db1 = da1.sum(axis=0)
        w1 -= alpha * dw1
        b1 -= alpha * db1
        w2 -= alpha * dw2
        b2 -= alpha * db2
        hidden = np.tanh(x @ w1 + b1)
        logits = hidden @ w2 + b2
        if step % 50 == 0 or step == steps:
            history.append({"step": step, "loss": objective(logits)})
    return {
        "kind": "network",
        "w1": w1,
        "b1": b1,
        "w2": w2,
        "b2": b2,
        "history": history,
    }


def rbf_kernel(x, z, sigma=0.7):
    """返回 K[i,j]=exp(-||x[i]-z[j]||²/(2*sigma²))，形状为 (n,m)。"""
    x, z = _features(x), _features(z)
    if not np.isfinite(sigma) or sigma <= 0.0:
        raise ValueError("sigma 必须是有限正数")
    differences = x[:, None, :] - z[None, :, :]
    squared_distances = np.sum(differences**2, axis=2)
    return np.exp(-squared_distances / (2.0 * sigma**2))


def fit_kernel(x, y, sigma=0.7, l2=0.001, steps=2000, alpha=0.05):
    """用 RBF 核拟合逻辑回归；核指定相似度，系数学会如何组合它们。

    K=rbf_kernel(x,x)，z=K@a+b，目标为平均 BCE + l2*a.T@K@a/2。
    惩罚的是核特征空间中的权重范数，并非系数的普通平方和；b 不罚。
    系数梯度为 K@(p-y)/n + l2*K@a（此处 K 对称）。模型保存训练
    输入作为核中心；新输入只与这些中心比较，不读取新输入的标签。
    history.loss 含正则项，记录初始值、每 50 步与最后一步。
    """
    x = _features(x).copy()
    y = _targets(y, len(x))
    _training_options(steps, alpha, l2)
    kernel = rbf_kernel(x, x, sigma)
    coefficients = np.zeros(len(x))
    b = 0.0
    weighted_kernel = kernel @ coefficients
    logits = weighted_kernel + b
    history = [{"step": 0, "loss": binary_loss_from_logits(logits, y)}]
    for step in range(1, steps + 1):
        dz = (sigmoid(logits) - y) / len(x)
        da = kernel @ dz + l2 * weighted_kernel
        db = float(dz.sum())
        coefficients -= alpha * da
        b -= alpha * db
        weighted_kernel = kernel @ coefficients
        logits = weighted_kernel + b
        if step % 50 == 0 or step == steps:
            penalty = l2 * float(coefficients @ weighted_kernel) / 2
            history.append(
                {"step": step, "loss": binary_loss_from_logits(logits, y) + penalty}
            )
    return {
        "kind": "kernel",
        "train_x": x,
        "coefficients": coefficients,
        "b": b,
        "sigma": sigma,
        "history": history,
    }


def predict_logits(model, x):
    """返回每个观测的 logit，形状为 (n,)；>=0 时决策为标签 1。"""
    if model["kind"] == "network":
        hidden = np.tanh(_features(x) @ model["w1"] + model["b1"])
        return hidden @ model["w2"] + model["b2"]
    if model["kind"] in ("linear", "interaction"):
        design = _features(x, model["kind"] == "interaction")
        return design @ model["w"] + model["b"]
    if model["kind"] == "kernel":
        kernel = rbf_kernel(x, model["train_x"], model["sigma"])
        return kernel @ model["coefficients"] + model["b"]
    raise ValueError(f"未知模型类型：{model['kind']}")


def report(model, x, y):
    """统一报告平均 BCE（不含正则项）与使用零 logit 阈值的准确率。"""
    logits = predict_logits(model, x)
    y = _targets(y, len(logits))
    return {
        "loss": binary_loss_from_logits(logits, y),
        "accuracy": float(np.mean((logits >= 0.0) == y)),
    }


def select_model(data):
    """只用验证 BCE 选定八个候选中的一个，选定后才读取测试集。

    候选为线性、乘积特征逻辑回归，以及宽度 4/16 × l2 为 0/0.01
    的四个网络，以及 sigma 为 0.3/0.8、l2 为 0.001 的两个核模型。
    全部使用各拟合函数的默认步数、学习率和初始化种子。
    models 将候选名映射到模型，selected 含获选行指标及 model。
    rows 中的 train/val_loss 均不含正则；只报告获选模型的测试指标。
    """
    train_x, train_y = data["train_x"], data["train_y"]
    models = {
        "linear": fit_logistic(train_x, train_y),
        "interaction": fit_logistic(train_x, train_y, interaction=True),
    }
    for width in (4, 16):
        for l2 in (0.0, 0.01):
            name = f"nn{width}_l2_{l2:g}"
            models[name] = fit_network(train_x, train_y, width=width, l2=l2)
    for sigma in (0.3, 0.8):
        name = f"rbf_sigma_{sigma:g}"
        models[name] = fit_kernel(train_x, train_y, sigma=sigma)

    rows = []
    for name, model in models.items():
        train = report(model, train_x, train_y)
        validation = report(model, data["val_x"], data["val_y"])
        rows.append(
            {
                "name": name,
                "train_loss": train["loss"],
                "val_loss": validation["loss"],
                "train_accuracy": train["accuracy"],
                "val_accuracy": validation["accuracy"],
            }
        )
    selected = min(rows, key=lambda row: row["val_loss"]).copy()
    selected["model"] = models[selected["name"]]
    test = report(selected["model"], data["test_x"], data["test_y"])
    return {"rows": rows, "selected": selected, "test": test, "models": models}
