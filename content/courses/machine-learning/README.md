# 机器学习的理论脉络

一份连续的中文理论课件，用 [edtrace](https://github.com/percyliang/edtrace) 逐步展示定义、公式、推导与讨论。材料源于 [作者前七周笔记](https://github.com/Civitasv/machine-learning)，不沿用周次划分。主问题是：**如何用有限观测确定一个在未知数据上仍然有效的函数？**

课件不包含应用用例、合成数据、数值演示、训练实验或模型排名。Python 用来组织讲解顺序；后台数学审校不进入播放流程。内容保持 `ai-draft`，供作者审阅、改写与录制，不代表已经完成学习。原始笔记保持不变。

## 论证顺序

从输入、目标、分布与假设空间定义学习问题，区分总体风险、经验风险和正则化目标。接着从条件似然导出平方误差与交叉熵，再由一阶近似和下降引理说明梯度下降为何采用减法、何时能下降。

表示部分说明固定特征与可学习特征的区别。BP 从计算图的链式法则出发，通过微分推导仿射层的转置与外积，再给出激活层、完整逐层递推、批量平均与参数共享的梯度累计。明确区分求导和优化。

核方法从特征内积及半正定性出发，用正交分解解释为什么可以采用训练样本展开，推导核空间范数与核逻辑回归梯度。随后由几何间隔走到 SVM 的软间隔、hinge loss、对偶和支持向量，说明核方法与 SVM 的关系。

最后回到泛化，区分逼近、估计与优化的影响，用条件性一致偏差界说明它们如何相连。结尾通过 softmax 与概率链式分解连接语言模型。推导始终说明符号约定与成立条件，不把经验观察当作定理。

## 播放与改写

[课程入口](https://civitasv.github.io/Foundation/courses/machine-learning/) · [完整课件](https://civitasv.github.io/Foundation/courses/machine-learning/presentation/?trace=machine_learning)

- `→` / `←`：逐步前进与后退。
- `Shift + →`：跳过当前函数细节；`u`：跳出当前函数。
- `Shift + R`：切换底层源码；`Shift + A`：切换逐步展示动画。

[machine_learning.py](machine_learning.py) 的 `main()` 是讲解顺序，各函数组织连续论证，`text()` 提供中文正文和 LaTeX 公式。[course.json](course.json) 是双语目录的唯一来源。英文入口明确标注课件为中文。

播放器与内容静态托管，不需 Python 服务。官方播放器通过 CDN 加载 MathJax，公式渲染需要联网。教学组织参考 CS336 的 Python 讲稿形式，不声称覆盖范围或质量与官方课程等同。

## 运行与构建

在本目录准备 Python 3.11+ 环境；edtrace 自身依赖 PyTorch，首次安装需要下载依赖，不需要 GPU：

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m unittest -v
python -m edtrace.execute -m machine_learning
```

在 Foundation 根目录运行完整验证与静态构建：

```bash
EDTRACE_PYTHON="$PWD/content/courses/machine-learning/.venv/bin/python" \
PAGES_BASE_PATH=/Foundation pnpm check
```

输出位于 `apps/web/out`。单独生成 trace 不会部署网站；Pages 工作流执行相同检查并发布。Python edtrace 固定为 0.1.17，前端固定提交 `d14a5f525de0aca2bd249ca6c36f1af252cddab2`。生成文件不作为内容源提交。

## 数学审校与参考

[test_theory.py](test_theory.py) 在后台把讲稿中的关键公式转写为数值运算，与 PyTorch 自动微分核对回归、softmax、完整多层 BP 和核正则梯度，并核对 SVM 原始/对偶目标及互补松弛。这些检查能发现符号、形状和归一化错误，但有限数值检查不是普遍性证明。测试也执行完整讲稿，确保无实验图表进入播放器。

参考：[CS229 回归与分类](https://cs229.stanford.edu/summer2023/cs229-notes1.pdf)、[CS229 反向传播](https://cs229.stanford.edu/notes_archive/cs229-notes-all/cs229-notes-backprop.pdf)、[CS229 核方法与 SVM](https://cs229.stanford.edu/summer2022/cs229-notes3.pdf)。softmax、光滑目标的下降条件与条件性泛化界是为连贯解释增补的内容。
