"""从数据到可泛化的程序：一份连续的中文机器学习讨论稿。

来源：吴恩达课程前七周旧笔记。用同一个带噪分类问题连接基本概念、
优化、表示学习、反向传播、核方法与泛化。AI 辅助初稿，供作者改写讲解。
"""
import numpy as np
from edtrace import text, plot
from experiments import sigmoid, binary_loss_from_logits
from classification import (
    make_dataset, fit_logistic, fit_network, fit_kernel,
    predict_logits, report, select_model, rbf_kernel,
)
from charts import line, scatter


def main():
    text("# 从数据到可泛化的程序")
    text("机器学习基础、反向传播与核方法\n\n**核心问题：我们怎样把有限的带噪样本，变成一个能预测新样本的程序？**")
    text("下面是一项逐步展开的实验。我们会先提出最简单的模型，让它失败，再根据失败的证据改进表示与算法。公式、代码和结果始终解释同一个问题。")
    data = make_dataset()  # @stepover
    problem_and_assumptions(data)
    models_and_representations(data)
    probability_and_objective()
    linear = optimization_and_evidence(data)
    learned_representations(data, linear)
    backpropagation(data)
    kernel_methods(data)
    result = generalization_and_experiment(data)
    discussion_and_next_steps(result)


def problem_and_assumptions(data):
    text("## 问题：给出两个测量值，预测一个类别")
    text("设每个样本有两个输入 x₁、x₂，标签 y∈{0,1}。它们是合成信号，没有医学、金融等现实含义。先观察点的分布，再猜测什么规则可能有效。")
    X = data["train_x"][:6]  # @inspect X X.shape
    y = data["train_y"][:6]  # @inspect y y.shape
    rows = sample_rows(data["train_x"], data["train_y"])  # @stepover
    plot(scatter(rows, "x₁", "x₂", "标签", "训练样本：颜色表示观察到的标签"))  # @clear X X.shape y y.shape
    text("为了能检查算法，我们知道人工数据的生成规则：x₁ 与 x₂ 异号时干净标签为 1，否则为 0；之后以 8% 的概率独立翻转标签。训练算法只得到输入与带噪标签，不读取这个规则。")
    text("这就是监督学习：已有输入—标签样本，想预测未见样本的标签。‘有标签’不等于‘已知真实规律’。这个实验还假设训练与未来数据来自同一分布；现实任务需要验证这个假设。")
    text("预测连续数值（例如温度）通常称为回归，预测离散类别称为分类。本课以分类为主线；两者都需要选择模型、损失、优化方法与评价方式。无监督学习没有同样的标签信号，暂不在这里展开。")
    counts = {"训练": len(data["train_y"]), "验证": len(data["val_y"]), "测试": len(data["test_y"])}  # @inspect counts
    text("从一开始就分好三组独立样本。训练集拟合参数；验证集比较方案；测试集留到方案确定之后。现在先不看测试成绩。")
    text("**先作预测：**一条直线能把四个象限里的两类点分开吗？若不能，增加训练轮数是否一定有用？")


def models_and_representations(data):
    text("## 模型：先规定允许学习什么，再寻找参数")
    text(r"最简单的打分模型是 $z=w_1x_1+w_2x_2+b$。输入 $x$ 来自样本；参数 $w,b$ 由学习调整。先把分数与类别分开：$z$ 可以是任意实数。")
    x = np.array([1., 2.])  # @inspect x
    w = np.array([2., -1.])  # @inspect w
    b = 0.5
    score = w[0] * x[0] + w[1] * x[1] + b  # @inspect score
    text("改变 w 会改变各特征的贡献；改变 b 会整体平移分数。边界 z=0 在二维输入空间是一条直线。模型限制了可表达的规则，优化器不会自动突破这个限制。")
    text("### 从一个样本到一批样本")
    X = np.array([[1., 2.], [2., 0.], [3., 1.]])  # @inspect X X.shape
    scores = X @ w + b  # @inspect scores scores.shape
    by_loop = np.array([sum(X[i, j] * w[j] for j in range(2)) + b for i in range(3)])  # @inspect by_loop
    by_einsum = np.einsum("mn,n->m", X, w) + b  # @inspect by_einsum
    assert np.allclose(scores, by_loop) and np.allclose(scores, by_einsum)
    text("X 的每行是一个样本，每列是一个特征：(m,n) @ (n,) → (m,)。三个写法的数学相同；einsum 中 n 不在输出里，表示沿特征维求和。先写 shape，能避免很多实现错误。")
    text("### 参数不是特征，特征也不是标签")
    text("特征是提供给模型的描述；参数决定怎样使用描述；标签是训练时想解释的答案。把标签误放进输入，会产生看似惊人的成绩，却无法用于真实预测。")
    text("输入也有量纲。若一列是米、另一列是毫米，同一个学习率可能很难兼顾。标准化常改善优化条件，但均值与标准差只能用训练集估计。")
    train_mean = data["train_x"].mean(axis=0)  # @inspect train_mean
    train_std = data["train_x"].std(axis=0)  # @inspect train_std
    text("本实验的两个输入已经处于相近尺度，因此直接使用。不要把‘所有任务必须标准化’当作不需要思考的规则。")


def probability_and_objective():
    text("## 目标：怎样定义‘预测得更好’？")
    text("若只统计分类是否正确，分数从 0.01 变到 10 可能不改变类别，目标函数会出现大片平坦区。我们需要能反映置信程度、方便优化的损失。")
    logits = np.array([-2., 0., 2.])  # @inspect logits
    probabilities = sigmoid(logits)  # @inspect probabilities
    decisions = (probabilities >= 0.5).astype(int)  # @inspect decisions
    text(r"令 $p=\sigma(z)=1/(1+e^{-z})$。logit 是分数，$p$ 是模型给出的 $P(y=1\mid x)$，阈值才产生决策。阈值可随误判成本改变，0.5 只是本实验的选择。")
    text("### 从概率假设推导交叉熵")
    text(r"对二元标签，$P(y\mid x)=p^y(1-p)^{1-y}$。若训练样本独立，整组数据的似然是这些概率的乘积。最大化乘积等价于最大化对数和，也等价于最小化平均负对数似然。")
    text(r"于是单样本损失为 $\ell=-y\log p-(1-y)\log(1-p)$，训练目标为 $J=\frac1m\sum_i\ell_i$。这就是二元交叉熵，不是凭空指定的惩罚表。")
    p_for_true_one = np.array([0.49, 0.001])  # @inspect p_for_true_one
    losses = -np.log(p_for_true_one)  # @inspect losses
    text("真实标签为 1 时，这两个预测都会被判错，但自信地猜错受到更大惩罚。准确率衡量决策；交叉熵还关心分配给真实标签的概率，两者回答不同问题。")
    text("平方误差也可用于概率预测。这里选择交叉熵，是因为上述概率模型与良好的优化性质；不能把它解释成其他损失一概无效。")
    text("### 数学等价，不保证浮点计算同样可靠")
    extreme_logits = np.array([-1000., 0., 1000.])  # @inspect extreme_logits
    targets = np.array([1., 1., 0.])
    stable_losses = np.logaddexp(0., extreme_logits) - targets * extreme_logits  # @inspect stable_losses
    text("从 logit 直接计算 logaddexp(0,z)−yz，可避免先算 sigmoid 再 log 时出现 log(0)。实现损失时，数值稳定性也是正确性的一部分。")


def optimization_and_evidence(data):
    text("## 优化：损失怎样改变参数？")
    text("先暂时只看一个参数，设 J(θ)=(θ−3)²/2。导数表示 θ 增加一点时，损失局部变化有多快。")
    theta, alpha = 0., 0.2
    derivative = theta - 3  # @inspect derivative
    theta_new = theta - alpha * derivative  # @inspect theta_new
    text(r"一阶近似是 $J(\theta+\Delta)\approx J(\theta)+\nabla J^\top\Delta$。取 $\Delta=-\alpha\nabla J$，变化近似为 $-\alpha\|\nabla J\|^2$。非零梯度处，足够小的正步长会让损失下降。")
    rows = learning_rate_rows()  # @stepover
    plot(line(rows, "轮次", "损失", "学习率", "方向由梯度决定，步子大小仍然重要", log_y=True))  # @clear derivative theta_new
    text("这是 J(θ)=θ²/2 的对照实验。α=1.2 跨过谷底但仍收敛；α=2.2 则发散。减号不保证任意学习率都有效，也不保证复杂模型达到全局最优。")
    text("### 回到分类：完整推导一次更新")
    text(r"链式法则给出 $\frac{\partial\ell}{\partial p}=-y/p+(1-y)/(1-p)$，而 $\frac{\partial p}{\partial z}=p(1-p)$。相乘并化简，得到 $\frac{\partial\ell}{\partial z}=p-y$。")
    X, y = data["train_x"][:6], data["train_y"][:6]
    w, b = np.zeros(2), 0.
    logits = X @ w + b  # @inspect logits
    probabilities = sigmoid(logits)  # @inspect probabilities
    dlogits = (probabilities - y) / len(y)  # @inspect dlogits
    dw = X.T @ dlogits  # @inspect dw dw.shape
    db = dlogits.sum()  # @inspect db
    text("平均损失中的 1/m 只除一次。X.T 的作用是让每个特征汇总来自所有样本的贡献；偏置对每个分数的局部导数都是 1，所以直接求和。")
    before = binary_loss_from_logits(logits, y)  # @inspect before
    w, b = w - 0.2 * dw, b - 0.2 * db  # @inspect w b
    after = binary_loss_from_logits(X @ w + b, y)  # @inspect after
    text("两个梯度都在同一组旧参数上计算，然后一起更新。这里展示一个小批次；本课实验为方便观察使用全批量更新。大数据训练常对随机小批次重复同样的计算。")
    text("### 当损失下降，问题是否已经解决？")
    linear = fit_logistic(data["train_x"], data["train_y"])  # @stepover
    training = report(linear, data["train_x"], data["train_y"])  # @inspect training
    validation = report(linear, data["val_x"], data["val_y"])  # @inspect validation
    plot(history_plot(linear, "线性分类器的训练目标"))  # @stepover @clear logits probabilities dlogits dw dw.shape db before w b after training validation
    plot(boundary_plot(linear, data, "线性边界：优化收敛，不代表表示足够"))  # @stepover
    text("模型能把自己的目标优化得更好，却仍受直线边界的限制。继续减小学习率、增加轮数，不能让一条直线突然表达 XOR。诊断时要区分优化问题与表示能力问题。")
    return linear


def learned_representations(data, linear):
    text("## 表示：改变模型看到的空间")
    text("先看无噪声的四个原型：(−1,−1) 与 (1,1) 属于 0，另外两个属于 1。两个正例的平均位置与两个负例的平均位置都在原点，因此不存在能严格分开两类的线性分数。")
    X = np.array([[-1., -1.], [-1., 1.], [1., -1.], [1., 1.]])  # @inspect X
    product = X[:, 0] * X[:, 1]  # @inspect product
    engineered_scores = -product  # @inspect engineered_scores
    text("乘积特征把同号与异号直接区分出来。在原始空间中，规则是非线性的；在包含 x₁x₂ 的特征空间里，一个线性模型就能使用它。")
    interaction = fit_logistic(data["train_x"], data["train_y"], interaction=True)  # @stepover
    comparison = {"线性": report(linear, data["val_x"], data["val_y"]), "加入乘积特征": report(interaction, data["val_x"], data["val_y"])}  # @inspect comparison
    plot(boundary_plot(interaction, data, "相同损失与优化方法，更换输入表示"))  # @stepover @clear X product engineered_scores comparison
    text("我们只改变了表示，仍然使用交叉熵与梯度下降。但现实问题里，谁来告诉我们该造什么特征？这引出了可学习的表示。")
    text("### 神经网络把特征变换也设为参数")
    text(r"定义 $A=XW_1+b_1$，$H=\tanh(A)$，$z=HW_2+b_2$。隐藏层 $H$ 不直接给出标签，它给输出层提供一组由数据学习的新特征。")
    text(r"非线性不可省略：若去掉 tanh，$(XW_1+b_1)W_2+b_2=X(W_1W_2)+(b_1W_2+b_2)$，整体仍然只是一个仿射变换。")
    text("现在要学习的参数更多了，但目标没有换：让真实标签得到更高概率。剩下的问题是，怎样为每一层都算出正确梯度？")


def backpropagation(data):
    text("## 反向传播：复用链式法则，而不是逐个参数重新试")
    text("先前向算出每个中间量，再反向计算损失对中间量的导数。一个量通向损失的路径若有多条，就把各条路径的贡献相加。这是求导规则，不是训练的另一种目标。")
    text("### 先用一个标量把‘上游梯度 × 局部导数’算明白")
    x, y, w = 2., 3., 1.
    z = w * x  # @inspect z
    loss = (z - y) ** 2 / 2  # @inspect loss
    upstream = z - y  # @inspect upstream
    dw = upstream * x  # @inspect dw
    text("dJ/dz=−1，dz/dw=2，因此 dJ/dw=−2。若 w 被多条分支重复使用，各分支算出的梯度要相加。自动微分系统记录计算关系，自动完成这种反向累计。")
    text("### 同一条规则，推广到一个两层网络")
    X, y = data["train_x"][:4], data["train_y"][:4]
    rng = np.random.default_rng(11)
    w1 = rng.uniform(-1., 1., size=(2, 4))
    b1 = np.zeros(4)
    w2 = rng.uniform(-1., 1., size=4)
    b2 = 0.
    loss, gradients = network_loss_and_gradients(X, y, w1, b1, w2, b2)
    text("前向保存 H，反向就能直接使用它的导数 1−H²。每个参数得到的是损失的局部敏感度，不是‘它犯了多少错’或唯一的因果责任。")
    before = loss  # @inspect before
    w1, b1 = w1 - 0.1 * gradients["w1"], b1 - 0.1 * gradients["b1"]
    w2, b2 = w2 - 0.1 * gradients["w2"], b2 - 0.1 * gradients["b2"]
    after = binary_loss_from_logits(np.tanh(X @ w1 + b1) @ w2 + b2, y)  # @inspect after
    text("上面求梯度的过程是 BP；减去学习率乘梯度的几行才是梯度下降。PyTorch 的 backward() 与 optimizer.step() 也对应这两个不同职责。")
    gradient_check()
    text("### 从能求导，到能训练")
    text("相同隐藏单元若从相同参数开始，通常会收到相同梯度，难以分工。随机初始化打破对称性；尺度则影响激活和梯度传播。过大的 tanh 输入会饱和，使局部导数接近零。")
    activations = np.tanh(np.array([0., 1., 5.]))  # @inspect activations
    local_derivatives = 1 - activations ** 2  # @inspect local_derivatives
    text(r"例如 Glorot 均匀初始化从 $[-\sqrt{6/(n_{in}+n_{out})},\sqrt{6/(n_{in}+n_{out})}]$ 采样。分母在根号内；初始化方案要适配激活函数与网络结构。")
    network = fit_network(data["train_x"], data["train_y"])  # @stepover
    validation = report(network, data["val_x"], data["val_y"])  # @inspect validation
    plot(boundary_plot(network, data, "不手工提供乘积特征，让隐藏层学习表示"))  # @stepover @clear z loss upstream dw before after activations local_derivatives validation
    text("回到最初的问题：同样的标签、同样的交叉熵，现在模型能学习弯曲的边界。它仍然不是完美的：样本有限、有噪声，优化和超参数也影响结果。")


def network_loss_and_gradients(X, y, w1, b1, w2, b2):
    """无正则的平均 BCE；这一函数既用于逐行讲解，也接受独立梯度检查。"""
    preactivation = X @ w1 + b1  # @inspect preactivation preactivation.shape
    hidden = np.tanh(preactivation)  # @inspect hidden hidden.shape
    logits = hidden @ w2 + b2  # @inspect logits logits.shape
    probabilities = sigmoid(logits)  # @inspect probabilities
    loss = binary_loss_from_logits(logits, y)  # @inspect loss
    text("开始反传。先从输出的平均交叉熵出发，再穿过输出层、tanh 与输入层。")  # @clear preactivation logits probabilities
    dlogits = (probabilities - y) / len(y)  # @inspect dlogits
    dw2 = hidden.T @ dlogits  # @inspect dw2
    db2 = dlogits.sum()  # @inspect db2
    dhidden = dlogits[:, None] * w2[None, :]  # @inspect dhidden dhidden.shape
    dpreactivation = dhidden * (1 - hidden ** 2)  # @inspect dpreactivation
    dw1 = X.T @ dpreactivation  # @inspect dw1 dw1.shape
    db1 = dpreactivation.sum(axis=0)  # @inspect db1
    text("逐个核对 shape：dW₁ 与 W₁ 一样是 (2,4)，db₁ 是 (4,)，dW₂ 是 (4,)。权重被一批样本共享，所以对 batch 求和；一份上游梯度经过多条输出路径时，也对路径求和。")  # @clear hidden dhidden dpreactivation dlogits
    return loss, {"w1": dw1, "b1": db1, "w2": dw2, "b2": db2}


def gradient_check():
    text("### 正确性证据：用另一种方法核对梯度")
    text(r"中心差分：$g_j\approx[J(\theta+\epsilon e_j)-J(\theta-\epsilon e_j)]/(2\epsilon)$。它不使用手写反向公式，适合检查小网络；每个参数要多次前向，通常不用于大网络训练。")
    epsilon, theta = 1e-5, 0.4
    loss_plus = np.logaddexp(0., theta + epsilon) - (theta + epsilon)
    loss_minus = np.logaddexp(0., theta - epsilon) - (theta - epsilon)
    numerical = (loss_plus - loss_minus) / (2 * epsilon)  # @inspect numerical
    analytical = sigmoid(theta) - 1  # @inspect analytical
    assert np.isclose(numerical, analytical)
    text("完整配套测试会对上面的两层网络逐参数做有限差分，并与 PyTorch autograd 对照。ε 太大或太小都可能影响数值检查，不能只看最后一个小数位。")


def kernel_methods(data):
    text("## 核方法：另一条获得非线性表示的路线")
    text("手工特征与神经网络都在改变表示。核方法问的是：如果算法只需要特征之间的内积，能否直接计算这个内积，而不把全部特征展开？")
    text("### 从一个能手算的特征映射开始")
    x = np.array([1., 2.])
    z = np.array([3., 4.])
    phi_x = np.array([x[0] ** 2, np.sqrt(2) * x[0] * x[1], x[1] ** 2])  # @inspect phi_x
    phi_z = np.array([z[0] ** 2, np.sqrt(2) * z[0] * z[1], z[1] ** 2])  # @inspect phi_z
    explicit_inner_product = phi_x @ phi_z  # @inspect explicit_inner_product
    kernel_value = (x @ z) ** 2  # @inspect kernel_value
    assert np.isclose(explicit_inner_product, kernel_value)
    text(r"这里 $\phi(x)=[x_1^2,\sqrt2x_1x_2,x_2^2]$，恰有 $\phi(x)^\top\phi(z)=(x^\top z)^2$。右边就是多项式核。特征空间中的线性计算，对原始输入可以是非线性的。")
    text("### 为什么一个内积就能参与预测？")
    text(r"设特征空间中的权重可写成 $w=\sum_i\alpha_i\phi(x_i)$，则新样本的分数为 $f(x)=\sum_i\alpha_iK(x_i,x)+b$，其中 $K(x,z)=\phi(x)^\top\phi(z)$。训练得到的是系数 α；预测通过新样本与训练样本的核值完成。")
    text("为什么可以这样写 w？对于依赖训练预测的损失与平方范数正则，把 w 分成训练特征张成空间内的分量与正交分量：正交部分不改变任何训练分数，却增加范数。因此可以在训练特征张成的空间中寻找一个最优解。")
    text(r"进一步，$\|w\|^2=\sum_{i,j}\alpha_i\alpha_j\phi(x_i)^\top\phi(x_j)=\alpha^\top K\alpha$。核矩阵同时决定预测与特征空间中的范数。")
    text("不能把任意‘看起来像相似度’的函数直接当作合法内积核：对任意有限样本集合形成的核矩阵，都应对称、半正定。")
    text(r"本实验使用 RBF 核：$K(x,z)=\exp(-\|x-z\|^2/(2\sigma^2))$。σ 控制距离多大还算相近。它对应隐式特征空间，无须在代码中列出所有特征。")
    X = data["train_x"][:4]  # @inspect X
    K = rbf_kernel(X, X, sigma=0.7)  # @inspect K
    eigenvalues = np.linalg.eigvalsh(K)  # @inspect eigenvalues
    text("对角线是 1，近点通常更相似。这四个非负特征值是一个实例检查，不是对 RBF 合法性的完整证明。计算整个训练核矩阵需要约 m² 个存储位置，核方法也有规模成本。")
    text("### 保留交叉熵，只替换分数的构造方式")
    text(r"用 $z=K\alpha+b$ 做核逻辑回归，最小化平均交叉熵加 $\frac\lambda2\alpha^\top K\alpha$。注意核空间的范数正则不是简单的 $\|\alpha\|^2$。")
    coefficients = np.zeros(len(X))
    targets = data["train_y"][:4]
    probabilities = sigmoid(K @ coefficients)
    residual = (probabilities - targets) / len(targets)
    dcoefficients = K.T @ residual + 0.001 * K @ coefficients  # @inspect dcoefficients
    coefficients = coefficients - 0.05 * dcoefficients  # @inspect coefficients
    text("这是一小批核中心上的一次系数更新，完整实验还会更新截距。它仍是熟悉的链式法则与梯度下降，只是线性组合的对象从输入特征换成了核值。")
    kernel = fit_kernel(data["train_x"], data["train_y"])  # @stepover
    validation = report(kernel, data["val_x"], data["val_y"])  # @inspect validation
    plot(boundary_plot(kernel, data, "同一个分类问题：RBF 核诱导出的非线性边界"))  # @stepover @clear phi_x phi_z explicit_inner_product kernel_value X K eigenvalues dcoefficients coefficients validation
    text("本例中，神经网络通过训练改变特征映射；给定 σ 的 RBF 核已经确定了特征空间，训练主要学习如何组合训练样本的影响。σ 本身作为超参数选择。核是一种表示与计算工具，不专属于 SVM。")
    svm_as_another_objective()


def svm_as_another_objective():
    text("### 补充讨论：SVM 改变了哪一部分？")
    text("把标签改成 −1/+1。SVM 常用 hinge loss：分类正确还不够，希望有符号分数 y·f(x) 至少达到 1。这里的 f(x) 是原始分数，不是概率或阈值化的类别。")
    margins = np.array([-0.5, 0.2, 1.5])  # @inspect margins
    hinge = np.maximum(0., 1 - margins)  # @inspect hinge
    text(r"软间隔目标可写为 $\frac12\|w\|^2+C\sum_i\max(0,1-y_if(x_i))$。权重范数与违反间隔的惩罚在竞争；C 大意味着更重视惩罚，不保证零错误，也不保证几何间隔更大。")
    text(r"对线性分数，点到边界的有符号距离是 $f(x)/\|w\|$。将 w 与 b 同乘一个正数不改变边界和这个距离，却会改变原始分数。规范化后两条间隔面的距离是 $2/\|w\|$。")
    text("SVM 可以使用线性核，也可以使用 RBF 等核。‘核方法’与‘SVM’不等同：前者提供特征内积的计算方式，后者规定一种学习目标和约束。")


def generalization_and_experiment(data):
    text("## 实验：比较方案，而不是挑一个好看的结果")
    text("现在固定数据划分、训练算法和候选范围，再比较线性、交互特征、不同容量/正则强度的网络，以及不同核宽度的模型。所有候选使用相同的验证集与平均交叉熵。")
    text("参数在训练集上学习；隐藏层宽度、λ、σ 等超参数由验证表现选择。可以联合选择多个超参数，但反复尝试过多方案仍可能过拟合验证集。")
    text(r"神经网络的本例目标为 $J=\mathrm{mean}(\ell)+\frac\lambda2(\|W_1\|_F^2+\|W_2\|^2)$，不惩罚 bias。λ 的数值依赖归一化约定；不要跨实现直接照搬。")
    result = select_model(data)  # @stepover
    table = comparison_table(result["rows"])  # @inspect table @stepover
    text("列依次是：训练交叉熵、验证交叉熵、训练准确率、验证准确率。模型名标在对应行。评价损失不包含正则项，因此不同 λ 的成绩可以比较。")
    plot(comparison_plot(result["rows"]))  # @stepover @clear table
    selected_name = result["selected"]["name"]  # @inspect selected_name
    highest_accuracy = max(result["rows"], key=lambda row: row["val_accuracy"])["name"]  # @inspect highest_accuracy
    text("对比这两个名字：默认实验里，验证准确率最高的方案并没有最小交叉熵。选模必须事先明确目标指标；不能看到结果后换一个对自己有利的指标。")
    text("选择规则在看测试集之前就确定：验证交叉熵最小。这一次哪个模型获胜，是当前数据、候选范围与优化预算的实验结果，不是算法的永久排名。")
    text("### 解释结果时，把不同误差来源分开")
    text("训练与验证都差：检查模型表示能力、优化是否完成、实现与数据。训练明显好而验证差：检查容量、正则化、数据量、泄漏与分布变化。只靠两个数字，不能唯一确定原因。")
    text("本例存在 8% 独立标签翻转，即使知道干净规则，对新噪声标签的最优总体准确率也只能达到 92%。有限测试集的实际准确率会波动；不能把某一次超过 92% 当作理论被推翻。")
    text("### 最后揭开独立测试集")
    test_result = result["test"]  # @inspect test_result
    text("这一步估计已经选定的方案在同分布新样本上的表现。若根据这个结果继续改超参数，它就不再是未参与选择的测试证据，需要新的独立评价。")
    return result


def discussion_and_next_steps(result):
    text("## 讨论：把这些方法放回同一个框架")
    text("一套学习系统至少包含：数据与划分、表示/模型、训练目标、梯度与优化、评价协议。改变其中一项，应尽量固定其余项，才能解释结果为何变化。")
    text("线性模型限制了边界；手工特征改变输入表示；神经网络学习表示；核方法计算隐式表示的内积。交叉熵与 hinge 定义不同目标；BP 计算可微图的梯度；优化器使用梯度更新参数。它们分别回答不同问题。")
    text("本实验没有证明哪种方法在现实中普遍最好。样本少、任务人工、随机种子固定，候选和计算预算也有限。它的用途是把学习机制拆开，建立能迁移到更大模型的理解。")
    text("### 通向语言模型：保留训练骨架，扩大模型与输出空间")
    text("补充一个多分类例子。语言模型会为词表中的候选 token 产生分数，用 softmax 构成概率分布，再对真实下一个 token 计算负对数概率。")
    logits = np.array([2., 1., -1.])  # @inspect logits
    shifted = logits - logits.max()
    probabilities = np.exp(shifted) / np.exp(shifted).sum()  # @inspect probabilities
    true_class = 1
    loss = -np.log(probabilities[true_class])  # @inspect loss
    predicted_class = int(probabilities.argmax())  # @inspect predicted_class
    text("argmax 返回类别位置，max 返回最高分。减去最大 logit 不改变 softmax 概率，却改善数值稳定性。这个多分类扩展是为后续 CS224N/CS336 增补的内容。")
    text("从这个小实验到 Transformer，变化最大的是数据、表示、参数规模与计算组织。‘前向预测 → 损失 → 反向求梯度 → 参数更新 → 独立评价’仍然是同一条基本链路。")
    text("### 用自己的话重建，而不是记住这一份输出")
    text("合上讲稿后，解释三件事：为什么线性模型训练收敛仍会失败；一个隐藏层权重的梯度怎样从损失传回来；为什么核值可以替代显式特征的内积。然后改变数据噪声或特征表示，先写下预测，再运行验证。")
    text("下一次复习时，从空文件重写一个小分类器及一次 BP。记录‘原先的预测、实际结果、错误原因、现在的解释’，再录成自己的讲解。")


def sample_rows(X, y):
    return [{"x₁": float(x[0]), "x₂": float(x[1]), "标签": str(int(label))} for x, label in zip(X, y)]


def learning_rate_rows():
    rows = []
    for alpha in [0.2, 1.2, 2.2]:
        theta = 3.
        for step in range(12):
            rows.append({"轮次": step, "损失": theta ** 2 / 2, "学习率": str(alpha)})
            theta -= alpha * theta
    return rows


def history_plot(model, title):
    rows = [{"轮次": row["step"], "训练目标": row["loss"]} for row in model["history"]]
    return line(rows, "轮次", "训练目标", title=title)


def boundary_plot(model, data, title):
    edges = np.linspace(-1., 1., 32)
    axis = (edges[:-1] + edges[1:]) / 2
    grid = np.array([(x, y) for x in axis for y in axis])
    probabilities = sigmoid(predict_logits(model, grid))
    background = [{"左": float(edges[i]), "右": float(edges[i + 1]),
                   "下": float(edges[j]), "上": float(edges[j + 1]),
                   "p": float(probabilities[i * len(axis) + j])}
                  for i in range(len(axis)) for j in range(len(axis))]
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v6.json", "title": title,
        "width": 430, "height": 310,
        "layer": [
            {"data": {"values": background}, "mark": {"type": "rect", "opacity": 0.5},
             "encoding": {"x": {"field": "左", "type": "quantitative", "title": "x₁"}, "x2": {"field": "右"},
                          "y": {"field": "下", "type": "quantitative", "title": "x₂"}, "y2": {"field": "上"},
                          "color": {"field": "p", "type": "quantitative", "scale": {"domain": [0, 1], "scheme": "blueorange"}, "title": "预测 P(y=1)"}}},
            {"data": {"values": sample_rows(data["train_x"], data["train_y"])},
             "mark": {"type": "point", "size": 55, "stroke": "#222", "filled": False},
             "encoding": {"x": {"field": "x₁", "type": "quantitative"}, "y": {"field": "x₂", "type": "quantitative"},
                          "shape": {"field": "标签", "type": "nominal", "scale": {"range": ["circle", "cross"]}},
                          "tooltip": [{"field": "x₁"}, {"field": "x₂"}, {"field": "标签"}]}}
        ],
    }


def comparison_table(rows):
    return {r["name"]: [round(r[k], 4) for k in ("train_loss", "val_loss", "train_accuracy", "val_accuracy")] for r in rows}


def comparison_plot(rows):
    values = [{"模型": r["name"], "数据": group, "交叉熵": r[key]}
              for r in rows for group, key in [("训练", "train_loss"), ("验证", "val_loss")]]
    return {"$schema": "https://vega.github.io/schema/vega-lite/v6.json", "title": "相同数据与评价协议下的候选模型",
            "width": 430, "height": 280, "data": {"values": values}, "mark": {"type": "point", "filled": True, "size": 100},
            "encoding": {"x": {"field": "交叉熵", "type": "quantitative"},
                         "y": {"field": "模型", "type": "nominal", "sort": None},
                         "color": {"field": "数据", "type": "nominal"},
                         "shape": {"field": "数据", "type": "nominal"},
                         "tooltip": [{"field": "模型"}, {"field": "数据"}, {"field": "交叉熵"}]}}


if __name__ == "__main__":
    main()
