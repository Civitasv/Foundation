"""机器学习理论课件：按定义、回归、优化、矩阵、分类、网络、BP、学习曲线、SVM 与核展开。

Python 组织中文 edtrace 讲解顺序，不运行用例或训练实验。
来源为作者前七周笔记与 README 参考资料；保持 AI 辅助讲稿草案状态。
"""
from edtrace import text


def main():
    text("# 机器学习的理论脉络")
    text("从多变量线性回归到神经网络、学习曲线与核方法")
    text("**核心问题：如何用有限的观测，学习一个能预测未知数据的函数？**")
    text("按定义、线性回归、梯度下降、矩阵运算、分类、神经网络、BP、学习曲线、支持向量机与核函数的顺序展开。每一步说明模型、目标和方法怎样承接前面的理论。")
    learning_problem()
    multivariate_linear_regression()
    optimization()
    matrix_operations()
    logistic_regression()
    neural_networks()
    backpropagation()
    learning_curves()
    support_vector_machines_and_kernels()


def learning_problem():
    text("## 机器学习定义")
    text("机器学习研究怎样让程序从经验中改善完成任务的能力。描述一个学习问题，需要说明任务 T、经验 E 与评价标准 P；学习意味着经验增加后，按该标准衡量的表现得到改善。")
    text(r"设输入为 $x\in\mathcal X$，目标为 $y\in\mathcal Y$，二者服从未知联合分布 $P(x,y)$。训练集记作 $D=\lbrace (x_i,y_i)\rbrace_{i=1}^m$；先采用样本独立同分布的假设。")
    text("监督学习从输入与目标的配对观测中学习预测关系。回归的输出通常是连续值，分类的输出是离散类别；二者共享模型、目标、优化与泛化这套结构。无监督学习不要求同样的目标标签，不在这里展开。")
    text(r"模型 $f_\theta:\mathcal X\to\mathcal Y$ 用参数 $\theta$ 指定一个函数。更一般地，模型也可以先输出分数或条件概率，再通过决策规则生成预测。")
    text(r"输入 $x$ 是模型接收的信息，标签 $y$ 是监督信号，参数 $\theta$ 是从训练数据中确定的量。假设空间 $\mathcal H=\lbrace f_\theta:\theta\in\Theta\rbrace$ 则规定了允许选择哪些函数。")
    text("学习之前就必须作出某些限制：允许的函数结构、平滑性、正则化或算法偏好。有限样本通常能被许多不同函数解释；这些限制构成归纳偏置，影响模型怎样延伸到未见数据。")
    text("因此，学习不是唯一地还原一个隐藏公式。它是在给定信息、模型限制和评价目标下，选择预测规则。若未来分布与训练分布不同，原来的泛化论证需要重新审视。")
    text("训练代价衡量模型对已见数据的拟合；总体风险衡量对数据分布中未知样本的平均损失。机器学习最终关心的是后者。")
    text("接下来从连续值预测开始：先用多变量线性回归定义一个具体的模型和目标，再讨论怎样寻找它的参数。")


def multivariate_linear_regression():
    text("## 线性回归：多个输入变量，一项连续输出")
    text(r"设每个输入有 $d$ 个特征，模型为 $$f_{w,b}(x)=b+\sum_{j=1}^d w_jx_j.$$这里‘多变量’指多个输入特征；目标 $y$ 仍是一个连续数值。$w_j$ 是系数，$b$ 是偏置。")
    text("模型对参数是线性的。每个特征对预测的作用由对应系数决定，偏置允许整体平移。特征之间可以存在相关性；线性回归并不要求所有输入变量相互独立。")
    text(r"用 $x_{ij}$ 表示第 $i$ 个样本的第 $j$ 个特征。记预测为 $\hat y_i=f_{w,b}(x_i)$、残差为 $r_i=\hat y_i-y_i$。代价函数 Cost Function 定义整组数据上的平均平方代价：$$J(w,b)=\frac1{2m}\sum_{i=1}^m r_i^2.$$平方使正负残差不能相互抵消，$1/2$ 便于求导。")
    text("单样本的损失描述一次预测的代价；Cost Function 汇总所有训练样本的损失。除以样本数让目标具有平均意义。目标越小表示训练拟合越好，但还需要独立评价判断泛化。")
    text(r"固定其他参数，对 $w_j$ 求偏导。因为 $\partial r_i/\partial w_j=x_{ij}$，链式法则给出 $$\frac{\partial J}{\partial w_j}=\frac1m\sum_i r_ix_{ij},\qquad\frac{\partial J}{\partial b}=\frac1m\sum_i r_i.$$偏置的局部导数为 1，因此不乘特征。")
    text(r"为什么常用平方误差？若 $y\mid x\sim\mathcal N(f_{w,b}(x),\sigma^2)$ 且方差固定，负对数似然等于 $r^2/(2\sigma^2)$ 加与参数无关的常数。最大似然由此与最小化平方误差等价。这个解释依赖概率假设。")
    text("有了模型、代价函数和偏导，学习问题就变为寻找使 J 尽可能小的参数。下一步只需要理解一种通用的参数更新方法。")


def optimization():
    text("## 梯度下降")
    text("梯度下降重复执行三步：用当前参数预测，计算代价的偏导，再沿下降方向更新参数。更新停止可依据梯度大小、目标变化或预先规定的计算预算。")
    text(r"把所有待学习参数统一记作 $\theta$，梯度 $\nabla J(\theta)$ 把所有偏导数组合为向量。对小位移 $\Delta$，可微性给出 $$J(\theta+\Delta)=J(\theta)+\nabla J(\theta)^\top\Delta+o(\Vert\Delta\Vert).$$梯度描述局部一阶变化。")
    text(r"在欧氏长度固定为 $\varepsilon$ 的方向中，由柯西—施瓦茨不等式，$\nabla J^\top\Delta\ge-\varepsilon\Vert\nabla J\Vert$。非零梯度时，沿负梯度取等号，因此它是一阶近似下下降最快的方向。")
    text(r"于是梯度下降采用 $$\theta_{t+1}=\theta_t-\eta_t\nabla J(\theta_t),\qquad\eta_t>0.$$减号来自下降方向，学习率控制距离。全部分量的梯度必须基于同一个旧参数向量计算。")
    text(r"在线性回归中，上面的通用公式成为 $$w_j\leftarrow w_j-\eta\frac1m\sum_i(\hat y_i-y_i)x_{ij},\qquad b\leftarrow b-\eta\frac1m\sum_i(\hat y_i-y_i).$$先计算全部旧参数对应的偏导，再同时更新。")
    text("学习率太小通常进展缓慢；太大可能越过低点甚至发散。输入特征尺度差异很大时，各参数方向的曲率可能不同，标准化可改善优化条件；统计量应只在训练集估计。")
    text(r"梯度的 $L$-Lipschitz 条件是 $\Vert\nabla J(u)-\nabla J(v)\Vert\le L\Vert u-v\Vert$，其中 $L>0$。它限制局部斜率变化的速度，使一阶近似的误差可以被二次项控制。")
    text(r"若梯度是 $L$-Lipschitz 连续的，下降引理进一步给出 $$J(\theta-\eta\nabla J)\le J(\theta)-\eta(1-L\eta/2)\Vert\nabla J\Vert^2.$$所以 $0<\eta<2/L$ 时，非零梯度带来严格下降。这个结论需要光滑性与步长条件。")
    text("凸目标的局部最小值也是全局最小值；非凸目标通常没有这样的保证。梯度为零只表示驻点，也可能是鞍点。损失逐步下降、算法收敛和找到全局最优，是不同命题。")
    text("### 从全批量梯度到随机梯度")
    text(r"经验风险是样本损失的平均。若再加正则项 $\lambda\Omega(\theta)$，其中 $\lambda\ge0$ 控制对参数或函数的偏好，均匀抽取小批量 $B$ 时，可以用 $$g_B=\frac1{|B|}\sum_{i\in B}\nabla_\theta\ell_i+\lambda\nabla\Omega(\theta)$$代替全批量梯度。在抽样与当前参数满足相应条件时，它是目标梯度的无偏估计。")
    text("小批量降低单次更新成本，也引入梯度噪声，所以每一步不必让全数据目标下降。学习率调度、动量和自适应方法改变更新策略；它们仍需要先获得梯度。")
    text("这些更新公式包含许多求和。把它们写成矩阵形式，可以清楚地表达批量计算，并减少实现中的维度错误。")


def matrix_operations():
    text("## 矩阵运算：把求和关系写成批量计算")
    text(r"列向量 $x,w\in\mathbb R^d$ 的内积为 $w^\top x=\sum_jw_jx_j$。转置把行和列互换：若 $A\in\mathbb R^{a\times b}$，则 $A^\top\in\mathbb R^{b\times a}$，且 $(A^\top)\_{ji}=A\_{ij}$。")
    text(r"若 $A\in\mathbb R^{a\times b}$、$B\in\mathbb R^{b\times c}$，矩阵乘积 $C=AB\in\mathbb R^{a\times c}$ 满足 $$C_{ij}=\sum_{k=1}^bA_{ik}B_{kj}.$$中间维必须匹配；乘法顺序一般不能交换。")
    text(r"矩阵乘法与逐元素乘法不同。$A\odot B$ 将对应位置相乘，通常要求相同形状或兼容广播；$AB$ 则沿中间维相乘求和。Python 的数组或张量通常用 `@` 表示矩阵乘法、`*` 表示逐元素乘法。")
    text(r"令 $X\in\mathbb R^{m\times d}$ 的第 $i$ 行为 $x_i^\top$，$w\in\mathbb R^d$，$y\in\mathbb R^m$。整批预测与残差为 $$\hat y=Xw+b\mathbf1,\qquad r=\hat y-y.$$样本维是 $m$，特征维是 $d$。")
    text(r"平方范数 $\Vert r\Vert_2^2=r^\top r=\sum_i r_i^2$，于是 $$J=\frac1{2m}r^\top r,\qquad\nabla_wJ=\frac1mX^\top r,\qquad\partial_bJ=\frac1m\mathbf1^\top r.$$ $(d\times m)(m\times1)$ 得到与 $w$ 同形的梯度。")
    text(r"沿某个维度求和会消去该维度。这里 $X^\top r$ 对样本维累计每个特征的梯度；$\mathbf1^\top r$ 则累计偏置梯度。外积 $uv^\top$ 保留两个向量的维度，之后会用于网络权重求导。")
    text(r"`einsum` 是表达指标求和的一种记号。矩阵乘法可写为 `ik,kj->ij`，转置为 `ij->ji`，沿列求和为 `ij->i`。未保留在输出中的指标被求和；它们表达的数学与传统矩阵运算相同。")
    text(r"把偏置并入参数：$\widetilde X=[\mathbf1\ X]$、$\theta=[b;w]$，则 $\hat y=\widetilde X\theta$。线性回归驻点满足 $$\widetilde X^\top\widetilde X\theta=\widetilde X^\top y.$$满列秩时解唯一；秩不足仍可能有多个最小二乘解。")
    text("逆矩阵与转置承担不同职责。只有可逆的方阵才有通常意义的逆；转置可用于任何矩阵。最小二乘求解通常直接采用数值分解，不必显式构造逆矩阵。")
    text("矩阵形式只是把已经推导的标量求和整理在一起。接下来改变预测任务和损失，保留这套批量计算结构。")


def logistic_regression():
    text("## 分类问题：逻辑回归模型")
    text(r"二分类标签为 $y\in\lbrace0,1\rbrace$。用线性模型生成分数 $z=w^\top x+b$，再通过 sigmoid 得到概率：$$p=\sigma(z)=\frac1{1+e^{-z}}=P_\theta(y=1\mid x).$$逻辑回归虽然名称中有回归，通常用于分类。")
    text(r"$z$ 是 logit，$p$ 是概率，预测类别则由阈值决定。使用阈值 $\tau\in(0,1)$ 时，$p\ge\tau$ 等价于 $z\ge\log(\tau/(1-\tau))$；当 $\tau=1/2$，边界是 $w^\top x+b=0$。")
    text("sigmoid 改变分数的范围，但不会自动把线性分数的决策边界变成任意曲线。分类阈值可由错误代价决定；它与训练损失是不同选择。")
    text("### Cost Function：二元交叉熵")
    text(r"伯努利条件概率为 $P_\theta(y\mid x)=p^y(1-p)^{1-y}$。在样本条件独立的假设下，最大化条件似然等价于最小化平均负对数似然，得到 $$J(w,b)=-\frac1m\sum_i\big[y_i\log p_i+(1-y_i)\log(1-p_i)\big].$$")
    text(r"当 $y=1$，单样本损失为 $-\log p$；当 $y=0$，损失为 $-\log(1-p)$。给真实类别的概率越低，惩罚越大。分类准确率只关心最终决策，交叉熵还关心概率的置信程度。")
    text("对线性 logit，交叉熵在参数上是凸的。换用 sigmoid 输出上的平方误差则一般失去这种凸性；这也是两种损失优化性质的区别。线性可分且无正则时，交叉熵最优值可能只在参数范数趋于无穷时逼近。")
    text("### 从 Cost Function 推导梯度下降函数")
    text(r"先求 $\partial\ell/\partial p=(p-y)/(p(1-p))$，再用 $\mathrm dp/\mathrm dz=p(1-p)$，链式法则给出 $$\frac{\partial\ell}{\partial z}=p-y.$$因此 $$\frac{\partial J}{\partial w_j}=\frac1m\sum_i(p_i-y_i)x_{ij},\qquad\frac{\partial J}{\partial b}=\frac1m\sum_i(p_i-y_i).$$")
    text(r"相应更新为 $$w_j\leftarrow w_j-\eta\frac1m\sum_i(p_i-y_i)x_{ij},\qquad b\leftarrow b-\eta\frac1m\sum_i(p_i-y_i).$$这里所有概率由更新前的参数计算。")
    text(r"矩阵形式为 $z=Xw+b\mathbf1$、$p=\sigma(z)$，以及 $$w\leftarrow w-\frac\eta mX^\top(p-y),\qquad b\leftarrow b-\frac\eta m\mathbf1^\top(p-y).$$形式与线性回归相似，但预测函数及代价不同。")
    text(r"若加入 $\lambda\Vert w\Vert^2/2$，权重梯度再加 $\lambda w$。这里正则系数按平均损失的约定定义，不惩罚偏置；不同归一化约定的参数值不能直接照搬。")
    text(r"单样本损失也可写为 $\log(1+e^z)-yz$，实现中使用稳定的 softplus。多分类则用 softmax 和交叉熵：$p_j=e^{z_j}/\sum_k e^{z_k}$，其 logit 梯度为 $p_j-y_j$，其中 $y$ 是 one-hot 目标。")
    text("逻辑回归已经连接模型、损失和梯度下降。下一步让模型内部的特征变换也参与学习，就得到神经网络。")


def neural_networks():
    text("## 神经网络")
    text(r"把输入先变换为特征 $\phi(x)$，再作线性组合：$$f(x)=w^\top\phi(x)+b.$$它对特征是线性的，对原始输入未必线性。‘线性’必须说明相对于哪个空间。")
    text(r"神经网络把特征变换也参数化。采用列向量约定，令 $h^{(0)}=x$，逐层计算 $$a^{(l)}=W^{(l)}h^{(l-1)}+b^{(l)},\qquad h^{(l)}=\sigma_l(a^{(l)}).$$其中 $W^{(l)}\in\mathbb R^{d_l\times d_{l-1}}$。")
    text("前面的批量公式按行存样本；这里为便于推导，把单样本激活写成列向量。改变记号时必须一起改变矩阵方向，不能只凭熟悉的转置位置记公式。")
    text(r"如果每层都不使用非线性，多个仿射变换可合并为一个：$W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)$。单纯叠加线性层不会扩大到非线性函数。")
    text("非线性激活使复合函数能表达更丰富的关系；隐藏层成为可学习的表示。参数数目和表示能力增加后，优化难度与泛化要求也可能改变，不能由表达能力直接推出可训练性。")
    text("每层都影响最终损失，但不需要为每个参数独立重算一遍整个推导。计算图中的中间结果可以共享，这正是反向传播的出发点。")


def backpropagation():
    text("## BP 算法：反向传播")
    text(r"对标量复合函数 $J(v(u))$，链式法则为 $\mathrm dJ/\mathrm du=(\mathrm dJ/\mathrm dv)(\mathrm dv/\mathrm du)$。记 $\bar u=\partial J/\partial u$，称其为损失对中间量的梯度。")
    text(r"若 $u$ 通过多个后继节点影响损失，贡献要相加：$$\bar u=\sum_{v\in\mathrm{children}(u)}\left(\frac{\partial v}{\partial u}\right)^\top\bar v.$$每条路径使用链式法则，多条路径使用加法。")
    text("前向按依赖顺序计算节点值；反向从标量损失的梯度 1 出发，按逆拓扑顺序累计梯度。局部运算只需知道自己的输入、输出与上游梯度，无须重新理解整个网络。")
    text("### 仿射层：用微分推导转置与外积")
    text(r"考虑 $a=Wh+b$。其微分为 $\mathrm da=(\mathrm dW)h+W\mathrm dh+\mathrm db$，而 $\mathrm dJ=\bar a^\top\mathrm da$。分别收集各个变量的微分系数。")
    text(r"由 $\bar a^\top W\mathrm dh=(W^\top\bar a)^\top\mathrm dh$，得到 $$\bar h=W^\top\bar a.$$转置把输出空间中的梯度映回输入空间，不是把前向运算‘求逆’。")
    text(r"逐元素看权重项，$\mathrm dJ=\sum_{j,k}\bar a_jh_k\quad \mathrm dW_{jk}+\cdots$，所以 $$\nabla_WJ=\bar a h^\top,\qquad\nabla_bJ=\bar a.$$权重梯度是上游梯度与输入的外积。")
    text(r"若 $h\in\mathbb R^{d_{in}}$，$a\in\mathbb R^{d_{out}}$，则 $W\in\mathbb R^{d_{out}\times d_{in}}$，$\bar a h^\top$ 与 $W$ 同形。梯度的形状必须与被求导的参数一致。")
    text("### 激活层：逐元素相乘")
    text(r"若 $h=\sigma(a)$ 且激活逐元素作用，其 Jacobian 为对角矩阵，因此 $$\bar a=\bar h\odot\sigma'(a).$$符号 $\odot$ 表示逐元素乘法，不是矩阵乘法。")
    text(r"对 sigmoid，$\sigma'(a)=\sigma(a)(1-\sigma(a))$；对 tanh，$\sigma'(a)=1-\tanh^2(a)$；对 ReLU，正半轴导数为 1、负半轴为 0，在零点需约定所用的次梯度。")
    text("### 递推：把局部规则组成完整 BP")
    text(r"令 $\delta^{(l)}=\partial\ell/\partial a^{(l)}$。输出采用 sigmoid 与二元交叉熵时，单样本输出层有 $\delta^{(L)}=p-y$。这一步由损失与输出激活的联合求导决定。")
    text(r"隐藏层依次递推：$$\delta^{(l)}=\big((W^{(l+1)})^\top\delta^{(l+1)}\big)\odot\sigma_l'(a^{(l)}).$$先跨过下一层的线性变换，再跨过本层激活。")
    text(r"得到每层误差信号后，$$\nabla_{W^{(l)}}\ell=\delta^{(l)}(h^{(l-1)})^\top,\qquad\nabla_{b^{(l)}}\ell=\delta^{(l)}.$$这里的‘误差信号’是局部导数，不是每层各自的分类错误率。")
    text(r"对平均损失，参数被所有样本共享，故 $$\nabla_{W^{(l)}}J=\frac1m\sum_i\delta_i^{(l)}(h_i^{(l-1)})^\top+\lambda\nabla_{W^{(l)}}\Omega.$$可以在输出梯度处除以 $m$，也可以最终平均，但不能重复除。")
    text("同一参数在多个位置复用时，也必须累计所有使用位置的贡献。BP 负责计算梯度，优化器负责用梯度更新参数；反向过程中提前修改参数会破坏对同一次前向计算的求导。")
    text("### 高效不代表没有代价")
    text("反向模式自动微分通过向量—Jacobian 乘积计算标量损失对大量参数的梯度，不必显式构造完整 Jacobian。在常见运算图中，反向计算量与前向同阶；保存中间激活则带来内存成本。")
    text(r"梯度沿深度反复乘权重与激活导数；这些因子可能导致梯度消失或爆炸。初始化影响传播尺度，对称初始化也可能使隐藏单元一直学到相同表示。BP 本身不消除这些优化问题。")
    text(r"中心差分 $\partial_jJ\approx[J(\theta+\varepsilon e_j)-J(\theta-\varepsilon e_j)]/(2\varepsilon)$ 可独立检查求导，但每个参数都需额外前向。它是验证工具，不是高维训练中 BP 的等价效率替代。")
    text("至此，神经网络的学习机制已经闭合：复合函数定义表示，损失定义目标，BP 计算梯度，优化器改变参数。参数优化完成后，仍需判断训练所得模型能否泛化；学习曲线提供一种观察途径。")


def learning_curves():
    text("## 学习曲线：观察拟合与泛化")
    text("学习曲线通常以训练样本数为横轴，以训练误差和验证误差为纵轴。它与以训练轮次或更新次数为横轴的优化曲线不同：前者观察数据量的影响，后者观察优化进度。")
    text(r"对每个训练规模 $n$，只用对应训练子集拟合得到 $\hat\theta_n$。再计算 $$J_{train}(n)=\frac1n\sum_{i\in D_n}\ell(f_{\hat\theta_n}(x_i),y_i),$$以及独立验证集上的平均损失 $$J_{val}(n)=\frac1{|V|}\sum_{i\in V}\ell(f_{\hat\theta_n}(x_i),y_i).$$评价时两条曲线使用相同损失，不混入不同的正则惩罚。")
    text("比较数据量时，应保持模型结构、预处理原则和可比的优化完成程度。训练子集变化会引入随机波动；曲线可以用重复划分的平均与不确定范围表达，不能要求每个点都严格单调。")
    text("### 偏差较高：两条曲线都停在较高误差")
    text("若训练和验证误差都较高，且增加样本后仍接近较高平台，可能存在欠拟合。应先确认优化已充分进行、实现无误，再检查表示能力是否不足或正则过强。只增加同分布数据，通常难以消除模型类的系统性限制。")
    text("### 方差较高：训练误差低，验证误差明显更高")
    text("较大差距可能表示模型对有限训练数据过于敏感。更多同分布数据、适当正则化或降低有效复杂度可能缩小差距。但数据泄漏、分布变化等也会影响曲线；一个差距不能唯一定位原因。")
    text("常见趋势是：样本很少时更容易拟合训练集，随样本增加，训练误差可能上升，而验证误差可能下降。它们是诊断性趋势，不是对任何训练算法和样本序列都成立的定理。")
    text(r"用平方损失时，经典偏差—方差分解需要明确假设。若 $y=f^{\star}(x)+\epsilon$，$\mathbb E[\epsilon\mid x]=0$，测试噪声与训练集独立，并对训练集随机性取期望，则固定 $x$ 处有 $$\mathbb E_{D,\epsilon}[(\hat f_D(x)-y)^2]=(\mathbb E_D[\hat f_D(x)]-f^{\star}(x))^2+\operatorname{Var}_D(\hat f_D(x))+\operatorname{Var}(\epsilon\mid x).$$这个加法分解不能原样用于交叉熵。")
    text("正则化在拟合与复杂度之间施加偏好，可能降低方差，也可能提高偏差。训练集拟合参数，验证集选择结构和超参数，测试集评价已经确定的方案；反复依据评价数据修改方案会削弱独立性。")
    text("学习曲线把模型能力、数据量和优化状态联系起来。最后讨论另一种分类目标——最大间隔，并说明如何用核函数扩展其表示。")


def support_vector_machines_and_kernels():
    text("## 支持向量机与核函数")
    text(r"采用标签 $y_i\in\lbrace -1,+1\rbrace$ 与分数 $f(x)=w^\top x+b$。$y_if(x_i)>0$ 表示分类正确，$y_if(x_i)$ 称为函数间隔；它会随 $w,b$ 的共同正比例缩放而改变。")
    text(r"当 $w\ne0$，几何间隔为 $y_if(x_i)/\Vert w\Vert$，不受这种缩放影响。对可分数据，把最小函数间隔规范化为 1，最大化几何间隔等价于 $$\min_{w,b}\frac12\Vert w\Vert^2\quad\text{s.t. }y_i(w^\top x_i+b)\ge1.$$这就是硬间隔形式。")
    text(r"允许违反间隔约束，得到软间隔形式：$$\min_{w,b,\xi}\frac12\Vert w\Vert^2+C\sum_i\xi_i,$$约束为 $y_if(x_i)\ge1-\xi_i$、$\xi_i\ge0$，且 $C>0$。")
    text(r"固定 $w,b$ 后，最小可行松弛变量是 $\xi_i=\max(0,1-y_if(x_i))$。消去它便得到 hinge loss：$$\min_{w,b}\frac12\Vert w\Vert^2+C\sum_i\max(0,1-y_if(x_i)).$$")
    text("交叉熵惩罚分给真实标签的低概率；hinge 惩罚未达到规定函数间隔的分数。SVM 的原始分数不是概率。C 控制违反间隔的代价，增大 C 不保证零错误或更大几何间隔。")

    text("上述线性 SVM 的边界仍由线性分数决定。要扩展到非线性边界，先把输入映射到特征空间，再寻找能够避免显式展开特征的计算方式。")
    kernel_methods()
    svm_dual()
    text("由此形成共同的学习结构：选择模型，定义 Cost Function，用优化方法寻找参数，再以独立数据检查泛化。线性回归、逻辑回归、神经网络和核 SVM 分别改变了其中不同的部分。")


def kernel_methods():
    text("### 核函数：用内积表示特征空间")
    text(r"设 $\phi:\mathcal X\to\mathcal F$ 把输入映射到内积空间，模型为 $f(x)=\langle w,\phi(x)\rangle+b$。若算法仅通过内积使用特征，可以直接计算 $$k(x,z)=\langle\phi(x),\phi(z)\rangle.$$这就是核技巧。")
    text("核技巧不会自动改变学习目标。它改变的是表示与计算方式：无需显式列出特征坐标，就可以得到算法所需的内积。隐式特征空间可以是高维乃至无限维。")
    text("#### 合法性：对称与半正定")
    text(r"对任意有限输入集合，Gram 矩阵定义为 $K_{ij}=k(x_i,x_j)$。若核来自实内积，则 $K=K^\top$，并且对任意系数 $c$，$$c^\top Kc=\left\Vert\sum_i c_i\phi(x_i)\right\Vert^2\ge0.$$因此它必须半正定。")
    text("反过来，一个对称函数若对任意有限输入集合都产生半正定 Gram 矩阵，就能作为某个 Hilbert 特征空间的内积。只检查一个矩阵，不能证明对所有输入都成立；任意相似度也不自动是合法核。")
    text(r"多项式核 $k(x,z)=(x^\top z+c)^q$（$c\ge0$，$q$ 为正整数）把多项式特征的内积压缩成一个表达式。展开后，各单项式系数可吸收到特征坐标的缩放中。")
    text(r"RBF 核为 $k(x,z)=\exp(-\Vert x-z\Vert^2/(2\sigma^2))$，其中 $\sigma>0$。它通过距离确定内积，宽度控制相似度随距离衰减的尺度。")
    text(r"将 RBF 写成 $e^{-\Vert x\Vert^2/(2\sigma^2)}e^{-\Vert z\Vert^2/(2\sigma^2)}\sum_{q=0}^{\infty}(x^\top z)^q/(q!\sigma^{2q})$：每个多项式内积项具有非负权重，再乘两端相同的缩放。这也说明其正定核结构与无限维特征解释。")
    text("#### 表示定理的关键：为什么只需训练样本的线性组合？")
    text(r"考虑目标 $\frac1m\sum_i\ell(\langle w,\phi(x_i)\rangle+b,y_i)+\frac\lambda2\Vert w\Vert^2$，取 $\lambda>0$。把 $w$ 分解为训练特征张成空间内的 $w_{\parallel}$ 与正交分量 $w_{\perp}$。")
    text(r"对所有训练点，$\langle w_\perp,\phi(x_i)\rangle=0$，所以删除正交部分不改变经验损失；而 $\Vert w\Vert^2=\Vert w_\parallel\Vert^2+\Vert w_\perp\Vert^2$，删除它不会增大正则项。若最优解存在，可在样本张成空间中寻找。")
    text(r"于是可写成 $w=\sum_{i=1}^m\alpha_i\phi(x_i)$，预测变为 $$f(x)=\sum_i\alpha_i k(x_i,x)+b.$$参数从显式特征坐标转为样本展开系数。系数不一定唯一，也不一定稀疏。")
    text(r"同样，$$\Vert w\Vert^2=\sum_{i,j}\alpha_i\alpha_j k(x_i,x_j)=\alpha^\top K\alpha.$$因此特征空间的平方范数正则一般不是 $\Vert\alpha\Vert^2$。")
    text("#### 与前面的损失和优化重新连接")
    text(r"使用二元交叉熵时，令 $z=K\alpha+b\mathbf1$、$p=\sigma(z)$，则 $$J=\frac1m\sum_i\ell(z_i,y_i)+\frac\lambda2\alpha^\top K\alpha.$$这给出核逻辑回归，核并不专属于 SVM。")
    text(r"由同一套链式法则，$$\nabla_\alpha J=\frac1mK^\top(p-y)+\lambda K\alpha,\qquad\partial_bJ=\frac1m\mathbf1^\top(p-y).$$正则梯度使用 $K=K^\top$；奇异核矩阵仍可用于这个目标，但系数可能不唯一。")
    text("固定核预先规定特征空间，训练学习其中的组合；神经网络则通过参数更新改变特征映射。这是两类表示方式的区别，不是‘能处理非线性’与‘不能处理非线性’的区别。")
    text(r"显式存储 Gram 矩阵需要 $O(m^2)$ 空间；预测通常涉及训练样本的核值。隐式高维特征节省的坐标计算，可能换来随样本量增长的成本。")


def svm_dual():
    text("### 对偶形式怎样引入核？")
    text(r"将输入换为特征 $\phi(x_i)$，对两组不等式分别引入 $\beta_i,\mu_i\ge0$。拉格朗日函数是 $$\mathcal L=\frac12\Vert w\Vert^2+C\sum_i\xi_i+\sum_i\beta_i(1-\xi_i-y_i(\langle w,\phi(x_i)\rangle+b))-\sum_i\mu_i\xi_i.$$乘子把约束并入目标。")
    text(r"对偶函数先对原始变量取下确界，再对非负乘子最大化。对偶目标给原始最小值提供下界；这里软间隔问题是凸的且可取严格可行松弛变量，满足强对偶的条件。")
    text(r"为间隔约束引入乘子 $\beta_i\ge0$。对 $w,b,\xi$ 的驻点条件给出 $w=\sum_i\beta_i y_i\phi(x_i)$、$\sum_i\beta_i y_i=0$ 与 $C-\beta_i-\mu_i=0$。由两个乘子非负得到 $0\le\beta_i\le C$。这里 $\beta$ 是 SVM 对偶变量，与前面的通用展开系数区分。")
    text(r"代回拉格朗日函数，得到 $$\max_\beta\ \sum_i\beta_i-\frac12\sum_{i,j}\beta_i\beta_jy_iy_jk(x_i,x_j),$$约束为 $0\le\beta_i\le C$ 与 $\sum_i\beta_i y_i=0$。特征只以内积形式出现，故可替换为核。")
    text(r"预测为 $f(x)=\sum_i\beta_i y_i k(x_i,x)+b$。由互补松弛，严格位于间隔外、约束不活跃的点有 $\beta_i=0$；非零系数对应支持向量。软间隔中支持向量也可能在间隔内或被错分。")
    text("核方法提供内积计算，SVM 提供间隔目标及相应优化问题。理解它们的联系，不应把两者当成同一个概念。")


if __name__ == "__main__":
    main()
