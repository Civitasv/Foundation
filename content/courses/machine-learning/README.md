# 机器学习的理论脉络

一份连续的中文理论课件，用 [edtrace](https://github.com/percyliang/edtrace) 逐步展示定义、公式、推导与讨论。材料源于 [作者前七周笔记](https://github.com/Civitasv/machine-learning)，不沿用周次划分。主问题是：**如何用有限观测确定一个在未知数据上仍然有效的函数？**

课件不包含应用用例、合成数据、数值演示、训练实验或模型排名。Python 用来组织讲解顺序；后台数学审校不进入播放流程。内容保持 `ai-draft`，供作者审阅、改写与录制，不代表已经完成学习。原始笔记保持不变。

## 论证顺序

按下列顺序形成一份连续课件：

1. **机器学习定义**：任务、经验、评价标准；输入、标签与假设空间。
2. **线性回归（多变量）**：多个特征的预测函数、平方误差代价及偏导。
3. **梯度下降**：负梯度方向、学习率、同时更新和回归更新公式。
4. **矩阵运算**：内积、转置、矩阵乘法、逐元素乘法、求和与批量计算。
5. **分类问题**：逻辑回归、sigmoid、交叉熵 Cost Function 和梯度下降函数。
6. **神经网络**：前向传播、非线性激活和可学习表示。
7. **BP 算法**：链式法则、仿射层和激活层求导、逐层递推与梯度累计。
8. **学习曲线**：训练规模与误差、高偏差和高方差、正则化及独立评价。
9. **支持向量机、核函数**：间隔与 hinge loss、核技巧、半正定性和对偶。

先推导标量求和，再整理矩阵形式；在逻辑回归中复用相同的参数更新骨架，在神经网络中推广前向计算和求导。学习曲线承接训练之后的泛化判断，SVM 与核方法作为最后一条分类与表示路线。推导说明符号约定及成立条件，诊断曲线说明典型趋势的适用边界。

## 播放与改写

[课程入口](https://civitasv.github.io/Foundation/courses/machine-learning/) · [完整课件](https://civitasv.github.io/Foundation/courses/machine-learning/presentation/?trace=machine_learning)

- `→` / `←`：逐步前进与后退。
- `Shift + →`：跳过当前函数细节；`u`：跳出当前函数。
- `Shift + R`：切换底层源码；`Shift + A`：切换逐步展示动画。

[machine_learning.py](machine_learning.py) 的 `main()` 是讲解顺序，各函数组织连续论证，`text()` 提供中文正文和 LaTeX 公式。[course.json](course.json) 是双语目录的唯一来源。英文入口明确标注课件为中文。

播放器与内容静态托管，不需 Python 服务。官方播放器通过 CDN 加载 MathJax，公式渲染需要联网。教学组织参考 CS336 的 Python 讲稿形式，不声称覆盖范围或质量与官方课程等同。

## 运行与构建

在 Foundation 根目录执行本地预览脚本：

```bash
./scripts/preview-machine-learning.sh
```

脚本首次运行会创建本课程的 `.venv` 并安装 Python 依赖，然后运行数学检查、重新构建课件，并启动仅监听本机的 HTTP 服务。打开终端输出的地址即可查看，按 `Ctrl+C` 停止服务。默认端口为 5180；可用 `PREVIEW_PORT=5181 ./scripts/preview-machine-learning.sh` 换端口。

修改 Python 后，如果服务仍在运行，在另一个终端执行：

```bash
./scripts/preview-machine-learning.sh --build-only
```

构建成功后刷新浏览器。保存文件不会自动重建。脚本只做本地检查和预览，不提交、推送或部署 Pages。可通过 `EDTRACE_PYTHON` 指定已有的 Python 环境。

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

参考：[CS229 回归与分类](https://cs229.stanford.edu/summer2023/cs229-notes1.pdf)、[CS229 反向传播](https://cs229.stanford.edu/notes_archive/cs229-notes-all/cs229-notes-backprop.pdf)、[CS229 核方法与 SVM](https://cs229.stanford.edu/summer2022/cs229-notes3.pdf)。softmax、光滑目标的下降条件与平方损失的偏差—方差分解是为连贯解释增补的内容。
