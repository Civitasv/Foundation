# 从数据到可泛化的程序

一份连续的中文 Python 课件，用 [edtrace](https://github.com/percyliang/edtrace) 展示代码、公式、中间变量与实验结果。材料源于 [Civitasv/machine-learning 的前七周笔记](https://github.com/Civitasv/machine-learning)，但不沿用周次划分，而围绕一个问题逐步发展：**怎样从有限的带噪样本，得到一个能预测新样本的程序？**

这是一份 `ai-draft` 讲解初稿，供作者验证、改写和录制；工程测试与发布不代表已经学会。原始笔记保持不变。

## 讨论如何展开

| 追问 | 建立的概念与证据 |
| --- | --- |
| 机器看到了什么，要预测什么？ | 输入、标签、监督学习、数据划分、分布假设与噪声。 |
| 用什么程序表达预测？ | 参数、偏置、矩阵运算、shape、表示能力与尺度。 |
| 怎样衡量预测质量？ | logit、概率、决策；从似然推导交叉熵；稳定数值计算。 |
| 一个目标怎样改变参数？ | 导数、局部近似、梯度下降、学习率、矩阵梯度与优化诊断。 |
| 直线为什么失败，怎样改进表示？ | XOR、交互特征、非线性、可学习隐藏层。 |
| 怎样给每层参数计算梯度？ | 链式法则、路径求和、完整两层网络 BP、梯度检查与初始化。 |
| 可否不展开特征，也完成非线性计算？ | 多项式特征映射、核技巧、RBF、Gram 矩阵、核空间正则、核逻辑回归；SVM 作为另一种目标。 |
| 怎样选择方案并检验泛化？ | 比较八个候选、正则化、验证选模、独立测试、噪声上限与实验局限。 |
| 怎样迁移到后续深度学习？ | softmax、下一个 token 的负对数概率，以及不变的训练骨架。 |

贯穿数据是在二维区域均匀采样的带噪 XOR：两个坐标异号时干净标签为 1，再以 8% 概率独立翻转。它是用于拆解机制的合成任务，不冒充真实应用。模型依次从线性逻辑回归发展为交互特征、神经网络和核模型，始终使用同一数据与可比较的评价指标。

softmax、稳定计算、tanh 与核逻辑回归实验、自动求导对照是补充。旧笔记中的 Octave 操作、fminunc API、按特征数量硬选算法的阈值不作为重点。教学节奏参考 CS336 的代码驱动方式，但这是独立入门讨论稿，不是官方课程或同等覆盖范围的替代品。

## 播放与改写

从 [Foundation 课程入口](https://civitasv.github.io/Foundation/courses/machine-learning/)打开完整课件。按 **→** 前进、**←** 后退、**Shift + →** 跳过函数细节；**E** 切换变量面板。代码、说明、图表和 trace 均静态托管，播放不需要 Python 服务。官方播放器通过 CDN 加载 MathJax，公式渲染需要联网。

[machine_learning.py](machine_learning.py) 的 main() 是讨论的阅读顺序，所有逐行展示的教学函数都在同一文件里。text() 写中文叙述与公式，@inspect 展示变量，plot() 插入图表。长训练循环在 [classification.py](classification.py)；[experiments.py](experiments.py) 提供稳定 sigmoid/BCE；[charts.py](charts.py) 只处理图表样式。

目录以 [course.json](course.json) 为准，不在网页组件或构建脚本另建一套课件清单。英文入口说明内容为中文，不声称已有英文讲稿或视频。

## 运行与构建

实验使用 CPU、固定种子与本地生成的数据，不需要 GPU 或数据下载。edtrace 自身依赖 PyTorch，首次安装需要下载依赖。在本目录准备 Python 3.11+ 环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m unittest -v
python -m edtrace.execute -m machine_learning
```

在 Foundation 根目录执行完整检查与构建：

```bash
EDTRACE_PYTHON="$PWD/content/courses/machine-learning/.venv/bin/python" \
PAGES_BASE_PATH=/Foundation pnpm check
```

Windows 可用 `.venv\Scripts\python.exe`，环境变量按终端语法设置。站点生成到 apps/web/out，播放器位于其 courses/machine-learning/presentation/ 子目录。单独执行 Python 命令只更新 trace，不部署网站。Pages 工作流执行相同检查，再发布静态产物。

Python edtrace 固定为 0.1.17，前端固定提交 d14a5f525de0aca2bd249ca6c36f1af252cddab2。生成文件与依赖缓存不作为内容源提交。

## 讲解时怎样检验理解

每次揭示结果前，先说出输出的符号、shape 或趋势。遇到反直觉结果，先解释再改代码。合上讲稿，重建三条解释链：线性模型为什么失败、BP 怎样把梯度传回隐藏层、核怎样替代显式特征的内积。

换一组噪声、特征或超参数，先写预测再运行；记录原先预测、实际结果、错误原因和现在的解释。次日与一周后从空文件重写关键步骤，再核对。录制时保留自己的推理，不需要照读整篇文字。

## 校正与参考

新稿校正了旧笔记中梯度残差/转置、argmax 与 max、L2 平方项、BP 与参数更新的区别、初始化根号、验证集联合调参、hinge 输入与 C 含义等问题。最小二乘矩阵不可逆也不意味着无解；优先使用数值求解器而非显式求逆。

参考：[CS229 回归与分类](https://cs229.stanford.edu/summer2023/cs229-notes1.pdf)、[CS229 反向传播](https://cs229.stanford.edu/notes_archive/cs229-notes-all/cs229-notes-backprop.pdf)、[CS229 核方法与 SVM](https://cs229.stanford.edu/summer2022/cs229-notes3.pdf)、[Glorot–Bengio 初始化](https://proceedings.mlr.press/v9/glorot10a.html)、[NumPy 最小二乘](https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html)。

配套测试以中心差分与 PyTorch 核对完整网络梯度，检查核正则梯度、极值稳定性和验证/测试隔离，并实际执行课件和图表序列化。固定种子的教学实验不能建立算法在现实任务上的普遍排名。
