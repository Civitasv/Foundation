"""机器学习的理论脉络：定义、推导、条件与联系。

Python 只组织 edtrace 的讲解顺序；课件不运行数据用例或训练实验。
来源为作者前七周笔记及 README 中的参考资料。AI 辅助讲解初稿。
"""
from edtrace import text


def main():
    text("# 机器学习的理论脉络")
    text("机器学习基础 · 反向传播 · 核方法")
    text("**核心问题：如何用有限的观测，确定一个在未知数据上仍然有效的函数？**")
    text("先定义学习的对象与目标，再推导优化与求导方法，随后讨论两条构造非线性表示的路线，最后回到泛化。全程沿数学问题展开，区分定义、结论及其成立条件。")
    learning_problem()
    models_and_risk()
    probability_and_loss()
    optimization()
    representations()
    backpropagation()
    kernel_methods()
    margins_and_svm()
    generalization()
    synthesis()


def learning_problem():
    text("## 学习问题：未知的是规律，已知的是有限样本")
    text(r"设输入为 $x\in\mathcal X$，目标为 $y\in\mathcal Y$，二者服从未知联合分布 $P(x,y)$。训练集记作 $D=\lbrace (x_i,y_i)\rbrace_{i=1}^m$；先采用样本独立同分布的假设。")
    text("监督学习从输入与目标的配对观测中学习预测关系。回归的输出通常是连续值，分类的输出是离散类别；二者共享模型、目标、优化与泛化这套结构。无监督学习不要求同样的目标标签，不在这里展开。")
    text(r"模型 $f_\theta:\mathcal X\to\mathcal Y$ 用参数 $\theta$ 指定一个函数。更一般地，模型也可以先输出分数或条件概率，再通过决策规则生成预测。")
    text(r"输入 $x$ 是模型接收的信息，标签 $y$ 是监督信号，参数 $\theta$ 是从训练数据中确定的量。假设空间 $\mathcal H=\lbrace f_\theta:\theta\in\Theta\rbrace$ 则规定了允许选择哪些函数。")
    text("学习之前就必须作出某些限制：允许的函数结构、平滑性、正则化或算法偏好。有限样本通常能被许多不同函数解释；这些限制构成归纳偏置，影响模型怎样延伸到未见数据。")
    text("因此，学习不是唯一地还原一个隐藏公式。它是在给定信息、模型限制和评价目标下，选择预测规则。若未来分布与训练分布不同，原来的泛化论证需要重新审视。")


def models_and_risk():
    text("## 从模型到风险：到底在最小化什么？")
    text(r"线性模型的分数为 $f_{w,b}(x)=w^\top x+b$，其中 $x,w\in\mathbb R^d$，$b\in\mathbb R$。含偏置时严格说是仿射函数；通常仍归入线性模型。")
    text(r"把样本按行放入 $X\in\mathbb R^{m\times d}$，整批分数为 $z=Xw+b\mathbf1\in\mathbb R^m$。矩阵乘法中的特征维被求和，样本维被保留。")
    text(r"损失 $\ell(f_\theta(x),y)$ 衡量单次预测的代价。真正关心的是总体风险：$$R(\theta)=\mathbb E_{(x,y)\sim P}[\ell(f_\theta(x),y)].$$它对未知分布取期望，通常无法直接计算。")
    text(r"用观测平均替代期望，得到经验风险：$$\widehat R_D(\theta)=\frac1m\sum_{i=1}^m\ell(f_\theta(x_i),y_i).$$经验风险最小化是求 $\hat\theta\in\arg\min_\theta\widehat R_D(\theta)$。")
    text("固定模型下，样本平均可在适当条件下逼近期望；但训练选出的模型依赖于同一批样本。不能把‘固定函数的平均会收敛’直接当成‘挑出来的任何模型都会泛化’。")
    text(r"常用训练目标再加入正则项：$$J(\theta)=\widehat R_D(\theta)+\lambda\Omega(\theta),\qquad\lambda\ge0.$$损失描述拟合要求，正则项表达对候选函数或参数的偏好。训练目标与纯预测风险要分清。")
    text("模型、目标、算法是三个独立选择：模型规定能表示什么；目标规定什么算好；算法规定如何寻找参数。算法收敛只说明优化取得了某种进展，不能单独证明模型合适或总体风险低。")


def probability_and_loss():
    text("## 损失的来源：从概率模型到负对数似然")
    text(r"若模型指定条件分布 $p_\theta(y\mid x)$，条件似然为 $L(\theta)=\prod_i p_\theta(y_i\mid x_i)$。条件独立假设把联合概率写成乘积；取对数后成为和。")
    text(r"最大似然等价于最小化平均负对数似然：$$J_{\mathrm{ML}}(\theta)=-\frac1m\sum_i\log p_\theta(y_i\mid x_i).$$损失由概率假设导出；概率假设本身仍需要判断。")
    text("### 回归：高斯假设与平方误差")
    text(r"若 $y\mid x\sim\mathcal N(f_\theta(x),\sigma^2)$ 且 $\sigma^2$ 为固定常数，负对数似然等于 $\frac{(f_\theta(x)-y)^2}{2\sigma^2}$ 加与参数无关的常数。因此优化等价于最小化平方误差。")
    text(r"对线性回归，取 $J=\frac1{2m}\VertXw+b\mathbf1-y\Vert_2^2$，记残差 $r=Xw+b\mathbf1-y$。则 $$\nabla_wJ=\frac1mX^\top r,\qquad\partial_bJ=\frac1m\mathbf1^\top r.$$这里的残差是预测减真实值。")
    text(r"将偏置并入增广矩阵 $\widetilde X$，驻点满足 $\widetilde X^\top\widetilde X\theta=\widetilde X^\top y$。只有满列秩时才能使用对应的逆矩阵表达唯一解；秩不足不等于最小二乘无解。数值计算通常直接求解最小二乘问题。")
    text("### 分类：伯努利假设与交叉熵")
    text(r"对 $y\in\lbrace 0,1\rbrace$，令 $z=w^\top x+b$，$p=\sigma(z)=1/(1+e^{-z})$，并设 $p_\theta(y\mid x)=p^y(1-p)^{1-y}$。分数 $z$、概率 $p$ 与最终类别是三个不同对象。")
    text(r"取负对数得到二元交叉熵：$$\ell(z,y)=-y\log p-(1-y)\log(1-p).$$分类阈值属于决策规则，可以由误判代价决定；它不是交叉熵定义的一部分。")
    text(r"先对概率求导：$\partial\ell/\partial p=(p-y)/(p(1-p))$。再利用 $\mathrm dp/\mathrm dz=p(1-p)$，链式法则给出 $$\frac{\partial\ell}{\partial z}=p-y.$$抵消来自 sigmoid 与交叉熵的组合，不适用于任意输出层和损失。")
    text(r"对整批样本，$$\nabla_wJ=\frac1mX^\top(p-y),\qquad\partial_bJ=\frac1m\mathbf1^\top(p-y).$$它与平方误差的线性回归具有相似形式，但预测函数、损失和统计假设不同。")
    text(r"交叉熵也可写成 $\ell(z,y)=\log(1+e^z)-yz$。数学等价不保证浮点实现同样稳定；计算时应使用稳定的 softplus / log-sum-exp，而非直接求巨大指数。")
    text("最小二乘和逻辑回归已经给出共同结构：先规定函数与概率假设，再推导标量目标，最后求目标对参数的梯度。接下来讨论如何使用这个梯度。")


def optimization():
    text("## 优化：为什么沿负梯度更新？")
    text(r"梯度 $\nabla J(\theta)$ 把所有偏导数组合为向量。对小位移 $\Delta$，可微性给出 $$J(\theta+\Delta)=J(\theta)+\nabla J(\theta)^\top\Delta+o(\Vert\Delta\Vert).$$梯度描述局部一阶变化。")
    text(r"在欧氏长度固定为 $\varepsilon$ 的方向中，由柯西—施瓦茨不等式，$\nabla J^\top\Delta\ge-\varepsilon\Vert\nabla J\Vert$。非零梯度时，沿负梯度取等号，因此它是一阶近似下下降最快的方向。")
    text(r"于是梯度下降采用 $$\theta_{t+1}=\theta_t-\eta_t\nabla J(\theta_t),\qquad\eta_t>0.$$减号来自下降方向，学习率控制距离。全部分量的梯度必须基于同一个旧参数向量计算。")
    text(r"梯度的 $L$-Lipschitz 条件是 $\Vert\nabla J(u)-\nabla J(v)\Vert\le L\Vert u-v\Vert$，其中 $L>0$。它限制局部斜率变化的速度，使一阶近似的误差可以被二次项控制。")
    text(r"若梯度是 $L$-Lipschitz 连续的，下降引理进一步给出 $$J(\theta-\eta\nabla J)\le J(\theta)-\eta(1-L\eta/2)\Vert\nabla J\Vert^2.$$所以 $0<\eta<2/L$ 时，非零梯度带来严格下降。这个结论需要光滑性与步长条件。")
    text("凸目标的局部最小值也是全局最小值；非凸目标通常没有这样的保证。梯度为零只表示驻点，也可能是鞍点。损失逐步下降、算法收敛和找到全局最优，是不同命题。")
    text("### 从全批量梯度到随机梯度")
    text(r"经验风险是样本损失的平均。均匀抽取小批量 $B$ 时，可以用 $$g_B=\frac1{|B|}\sum_{i\in B}\nabla_\theta\ell_i+\lambda\nabla\Omega(\theta)$$代替全批量梯度。在抽样与当前参数满足相应条件时，它是目标梯度的无偏估计。")
    text("小批量降低单次更新成本，也引入梯度噪声，所以每一步不必让全数据目标下降。学习率调度、动量和自适应方法改变更新策略；它们仍需要先获得梯度。")
    text("表示能力不足无法只靠更多优化步骤补齐。要扩大允许的函数集合，需要改变表示；而复杂表示又提出了高效求导的问题。")


def representations():
    text("## 表示：非线性来自哪里？")
    text(r"把输入先变换为特征 $\phi(x)$，再作线性组合：$$f(x)=w^\top\phi(x)+b.$$它对特征是线性的，对原始输入未必线性。‘线性’必须说明相对于哪个空间。")
    text(r"神经网络把特征变换也参数化。采用列向量约定，令 $h^{(0)}=x$，逐层计算 $$a^{(l)}=W^{(l)}h^{(l-1)}+b^{(l)},\qquad h^{(l)}=\sigma_l(a^{(l)}).$$其中 $W^{(l)}\in\mathbb R^{d_l\times d_{l-1}}$。")
    text("前面的批量公式按行存样本；这里为便于推导，把单样本激活写成列向量。改变记号时必须一起改变矩阵方向，不能只凭熟悉的转置位置记公式。")
    text(r"如果每层都不使用非线性，多个仿射变换可合并为一个：$W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)$。单纯叠加线性层不会扩大到非线性函数。")
    text("非线性激活使复合函数能表达更丰富的关系；隐藏层成为可学习的表示。参数数目和表示能力增加后，优化难度与泛化要求也可能改变，不能由表达能力直接推出可训练性。")
    text("每层都影响最终损失，但不需要为每个参数独立重算一遍整个推导。计算图中的中间结果可以共享，这正是反向传播的出发点。")


def backpropagation():
    text("## 反向传播：链式法则在计算图上的组织方式")
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
    text("至此，神经网络的学习机制已经闭合：复合函数定义表示，损失定义目标，BP 计算梯度，优化器改变参数。另一条路线则保留固定特征空间，改变特征计算方式。")


def kernel_methods():
    text("## 核方法：用内积表示一个特征空间")
    text(r"设 $\phi:\mathcal X\to\mathcal F$ 把输入映射到内积空间，模型为 $f(x)=\langle w,\phi(x)\rangle+b$。若算法仅通过内积使用特征，可以直接计算 $$k(x,z)=\langle\phi(x),\phi(z)\rangle.$$这就是核技巧。")
    text("核技巧不会自动改变学习目标。它改变的是表示与计算方式：无需显式列出特征坐标，就可以得到算法所需的内积。隐式特征空间可以是高维乃至无限维。")
    text("### 合法性：对称与半正定")
    text(r"对任意有限输入集合，Gram 矩阵定义为 $K_{ij}=k(x_i,x_j)$。若核来自实内积，则 $K=K^\top$，并且对任意系数 $c$，$$c^\top Kc=\left\Vert\sum_i c_i\phi(x_i)\right\Vert^2\ge0.$$因此它必须半正定。")
    text("反过来，一个对称函数若对任意有限输入集合都产生半正定 Gram 矩阵，就能作为某个 Hilbert 特征空间的内积。只检查一个矩阵，不能证明对所有输入都成立；任意相似度也不自动是合法核。")
    text(r"多项式核 $k(x,z)=(x^\top z+c)^q$（$c\ge0$，$q$ 为正整数）把多项式特征的内积压缩成一个表达式。展开后，各单项式系数可吸收到特征坐标的缩放中。")
    text(r"RBF 核为 $k(x,z)=\exp(-\Vertx-z\Vert^2/(2\sigma^2))$，其中 $\sigma>0$。它通过距离确定内积，宽度控制相似度随距离衰减的尺度。")
    text(r"将 RBF 写成 $e^{-\Vertx\Vert^2/(2\sigma^2)}e^{-\Vertz\Vert^2/(2\sigma^2)}\sum_{q=0}^{\infty}(x^\top z)^q/(q!\sigma^{2q})$：每个多项式内积项具有非负权重，再乘两端相同的缩放。这也说明其正定核结构与无限维特征解释。")
    text("### 表示定理的关键：为什么只需训练样本的线性组合？")
    text(r"考虑目标 $\frac1m\sum_i\ell(\langle w,\phi(x_i)\rangle+b,y_i)+\frac\lambda2\Vertw\Vert^2$，取 $\lambda>0$。把 $w$ 分解为训练特征张成空间内的 $w_{\parallel}$ 与正交分量 $w_{\perp}$。")
    text(r"对所有训练点，$\langle w_\perp,\phi(x_i)\rangle=0$，所以删除正交部分不改变经验损失；而 $\Vertw\Vert^2=\Vertw_\parallel\Vert^2+\Vertw_\perp\Vert^2$，删除它不会增大正则项。若最优解存在，可在样本张成空间中寻找。")
    text(r"于是可写成 $w=\sum_{i=1}^m\alpha_i\phi(x_i)$，预测变为 $$f(x)=\sum_i\alpha_i k(x_i,x)+b.$$参数从显式特征坐标转为样本展开系数。系数不一定唯一，也不一定稀疏。")
    text(r"同样，$$\Vertw\Vert^2=\sum_{i,j}\alpha_i\alpha_j k(x_i,x_j)=\alpha^\top K\alpha.$$因此特征空间的平方范数正则一般不是 $\Vert\alpha\Vert^2$。")
    text("### 与前面的损失和优化重新连接")
    text(r"使用二元交叉熵时，令 $z=K\alpha+b\mathbf1$、$p=\sigma(z)$，则 $$J=\frac1m\sum_i\ell(z_i,y_i)+\frac\lambda2\alpha^\top K\alpha.$$这给出核逻辑回归，核并不专属于 SVM。")
    text(r"由同一套链式法则，$$\nabla_\alpha J=\frac1mK^\top(p-y)+\lambda K\alpha,\qquad\partial_bJ=\frac1m\mathbf1^\top(p-y).$$正则梯度使用 $K=K^\top$；奇异核矩阵仍可用于这个目标，但系数可能不唯一。")
    text("固定核预先规定特征空间，训练学习其中的组合；神经网络则通过参数更新改变特征映射。这是两类表示方式的区别，不是‘能处理非线性’与‘不能处理非线性’的区别。")
    text(r"显式存储 Gram 矩阵需要 $O(m^2)$ 空间；预测通常涉及训练样本的核值。隐式高维特征节省的坐标计算，可能换来随样本量增长的成本。")


def margins_and_svm():
    text("## SVM：在表示之外，加入间隔目标")
    text(r"采用标签 $y_i\in\lbrace -1,+1\rbrace$ 与分数 $f(x)=w^\top x+b$。$y_if(x_i)>0$ 表示分类正确，$y_if(x_i)$ 称为函数间隔；它会随 $w,b$ 的共同正比例缩放而改变。")
    text(r"当 $w\ne0$，几何间隔为 $y_if(x_i)/\Vertw\Vert$，不受这种缩放影响。对可分数据，把最小函数间隔规范化为 1，最大化几何间隔等价于 $$\min_{w,b}\frac12\Vertw\Vert^2\quad\text{s.t. }y_i(w^\top x_i+b)\ge1.$$这就是硬间隔形式。")
    text(r"允许违反间隔约束，得到软间隔形式：$$\min_{w,b,\xi}\frac12\Vertw\Vert^2+C\sum_i\xi_i,$$约束为 $y_if(x_i)\ge1-\xi_i$、$\xi_i\ge0$，且 $C>0$。")
    text(r"固定 $w,b$ 后，最小可行松弛变量是 $\xi_i=\max(0,1-y_if(x_i))$。消去它便得到 hinge loss：$$\min_{w,b}\frac12\Vertw\Vert^2+C\sum_i\max(0,1-y_if(x_i)).$$")
    text("交叉熵惩罚分给真实标签的低概率；hinge 惩罚未达到规定函数间隔的分数。SVM 的原始分数不是概率。C 控制违反间隔的代价，增大 C 不保证零错误或更大几何间隔。")
    text("### 对偶形式怎样引入核？")
    text(r"将输入换为特征 $\phi(x_i)$，对两组不等式分别引入 $\beta_i,\mu_i\ge0$。拉格朗日函数是 $$\mathcal L=\frac12\Vert w\Vert^2+C\sum_i\xi_i+\sum_i\beta_i(1-\xi_i-y_i(\langle w,\phi(x_i)\rangle+b))-\sum_i\mu_i\xi_i.$$乘子把约束并入目标。")
    text(r"对偶函数先对原始变量取下确界，再对非负乘子最大化。对偶目标给原始最小值提供下界；这里软间隔问题是凸的且可取严格可行松弛变量，满足强对偶的条件。")
    text(r"为间隔约束引入乘子 $\beta_i\ge0$。对 $w,b,\xi$ 的驻点条件给出 $w=\sum_i\beta_i y_i\phi(x_i)$、$\sum_i\beta_i y_i=0$ 与 $C-\beta_i-\mu_i=0$。由两个乘子非负得到 $0\le\beta_i\le C$。这里 $\beta$ 是 SVM 对偶变量，与前面的通用展开系数区分。")
    text(r"代回拉格朗日函数，得到 $$\max_\beta\ \sum_i\beta_i-\frac12\sum_{i,j}\beta_i\beta_jy_iy_jk(x_i,x_j),$$约束为 $0\le\beta_i\le C$ 与 $\sum_i\beta_i y_i=0$。特征只以内积形式出现，故可替换为核。")
    text(r"预测为 $f(x)=\sum_i\beta_i y_i k(x_i,x)+b$。由互补松弛，严格位于间隔外、约束不活跃的点有 $\beta_i=0$；非零系数对应支持向量。软间隔中支持向量也可能在间隔内或被错分。")
    text("核方法提供内积计算，SVM 提供间隔目标及相应优化问题。理解它们的联系，不应把两者当成同一个概念。")


def generalization():
    text("## 泛化：为何训练目标小还不够？")
    text(r"回到总体风险 $R(f)$。记 $f^{\star}$ 为所有允许的预测规则中的总体风险最优者，$f_\mathcal H^{\star}$ 为假设空间内最优者，$\hat f$ 为训练所得模型。若这些最优者存在，则 $$R(\hat f)-R(f^{\star})=[R(\hat f)-R(f_\mathcal H^{\star})]+[R(f_\mathcal H^{\star})-R(f^{\star})].$$")
    text("第二项是模型类限制带来的逼近误差；第一项还受有限样本估计与实际优化影响。扩大模型类可能减小逼近误差，却同时改变估计难度与优化难度。没有单靠参数更多就保证总体风险更小的推论。")
    text(r"更具体地，若所有 $f\in\mathcal H$ 都满足 $|R(f)-\widehat R_D(f)|\le\varepsilon$，且训练得到的经验风险距离类内最小值不超过 $\delta$，则 $$R(\hat f)\le R(f_\mathcal H^{\star})+2\varepsilon+\delta.$$两次经验风险与总体风险的替换产生 $2\varepsilon$，优化不足产生 $\delta$。")
    text(r"证明只需依次应用三个条件：$$R(\hat f)\le\widehat R_D(\hat f)+\varepsilon\le\widehat R_D(f_\mathcal H^{\star})+\delta+\varepsilon\le R(f_\mathcal H^{\star})+\delta+2\varepsilon.$$中间一步用的是经验目标的优化保证，不是总体风险的最优保证。")
    text("这个条件性推导把统计估计与优化分开了，但还没有证明一致偏差界一定很小。它是否成立、需要多少样本，取决于损失的性质、模型类复杂度与抽样假设。")
    text("正则化通过约束参数或函数来改变选择偏好；它可能改善泛化，也可能引入更多逼近偏差。过拟合描述模型对有限训练数据的特殊性适应过强，不能只用‘参数多’来定义。")
    text("训练集用于拟合参数，验证集用于选择模型结构与超参数，测试集用于评价已确定的方案。频繁根据验证或测试反馈改方案，会使评价数据也参与选择，削弱独立评价的含义。")
    text("学习曲线、训练与验证差距可以提供诊断线索，但不能唯一确定问题原因。表示限制、优化未完成、标签噪声、样本不足与分布变化都可能影响预测质量。")
    text("有些不确定性来自输入无法完全决定目标。即便找到了总体风险最优预测规则，风险也未必为零。学习的理论目标是接近该任务与损失下的最优风险，而不是保证记忆所有观测。")


def synthesis():
    text("## 讨论：把理论放回同一套结构")
    text("学习问题规定输入、输出与分布；假设空间规定候选函数；损失与正则化定义优化目标；BP 提供复合函数梯度；优化算法寻找参数；泛化理论研究所得函数如何超出训练样本。")
    text("神经网络与核方法回应的是表示问题。链式法则与 BP 回应的是求导问题。梯度下降回应的是优化问题。交叉熵与间隔目标回应的是评价与偏好问题。把这些层次分开，才能理解它们如何组合。")
    text("### 通向语言模型：输出空间改变，基本结构延续")
    text(r"对多类别分数 $z\in\mathbb R^V$，softmax 定义 $p_j=e^{z_j}/\sum_k e^{z_k}$。若目标分布 $y$ 为 one-hot，交叉熵 $\ell=-\sum_j y_j\log p_j$，其 logit 梯度仍为 $\partial\ell/\partial z_j=p_j-y_j$。")
    text(r"自回归语言模型使用分解 $p_\theta(x_{1:T})=\prod_{t=1}^T p_\theta(x_t\mid x_{<t})$，训练目标是各位置负对数条件概率的和或平均。这来自概率链式法则，不是假设序列中的 token 彼此独立。")
    text("更复杂的表示与更大的参数规模，没有替代模型、目标、求导、优化、泛化之间的关系。后续学习 Transformer 时，可以先识别它改变了其中哪一部分，再进入具体结构与计算细节。")
    text("这份讨论建立的是理解学习系统的理论框架：每个公式回答一个明确问题，每个结论附带条件，各方法通过共同的风险最小化目标联系起来。")


if __name__ == "__main__":
    main()
