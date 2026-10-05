"""课件与分类实验共用的稳定数值运算；只依赖 NumPy。"""

from __future__ import annotations

import numpy as np


def sigmoid(logits):
    """稳定计算 sigmoid；内部只对非正数取指数，避免溢出。"""
    logits = np.asarray(logits, dtype=float)
    exp_negative_abs = np.exp(-np.abs(logits))
    return np.where(
        logits >= 0,
        1.0 / (1.0 + exp_negative_abs),
        exp_negative_abs / (1.0 + exp_negative_abs),
    )


def binary_loss_from_logits(logits, targets):
    """返回平均二元交叉熵 mean(logaddexp(0, z) - y*z)，不含 1/2。"""
    logits = np.asarray(logits, dtype=float)
    targets = np.asarray(targets, dtype=float)
    return float(np.mean(np.logaddexp(0.0, logits) - targets * logits))
