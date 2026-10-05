import Link from "next/link";
import { assertPresentationCourse, type FoundationLocale } from "@foundation/knowledge";
import course from "../../../content/courses/machine-learning/course.json";
import { presentationUrl } from "./presentation-url";

assertPresentationCourse(course);

const copy = {
  "zh-CN": {
    chapters: "章节",
    language: "EN",
    navigation: "机器学习",
    lessons: "内容脉络",
    sequence: "从机器学习定义出发，依次学习多变量线性回归、梯度下降、矩阵运算、逻辑回归、神经网络、BP、学习曲线，最后讨论支持向量机与核函数。",
    draft: "这份课件由 AI 辅助整理，目前是讲稿草案，供学习、验证与个人复述使用。数学检查与课件发布不代表作者已完成学习或录制。",
    open: "打开完整课件",
    use: "怎样使用",
    guidance: "用方向键逐步展开定义与推导，先明确符号和假设，再解释结论为何成立。讲解时沿问题、目标、优化、求导、表示与泛化的关系展开；每段都说明它承接了什么问题。课件以中文呈现。",
    bridge: "与后续课程的连接",
    connection: "矩阵运算、概率损失、表示学习、反向传播和泛化是后续学习 CS224N 与 CS336 的基础。softmax、数值稳定性与自动微分核对是对旧笔记的补充，并非原七周内容的逐字翻译。",
    cs336: "继续查看 CS336 学习记录"
  },
  en: {
    chapters: "Chapters",
    language: "中文",
    navigation: "Machine Learning",
    lessons: "The thread of the discussion",
    sequence: "Follow the definition of machine learning, multivariate linear regression, gradient descent, matrix operations, logistic regression, neural networks, backpropagation, learning curves, and finally SVMs and kernels.",
    draft: "This AI-assisted presentation is a draft for study, verification and personal explanation. Mathematical checks and publication do not mean the author has completed the learning or recorded a lecture.",
    open: "Open the full presentation in Chinese",
    use: "How to use the presentation",
    guidance: "Use the arrow keys to unfold definitions and derivations. Establish notation and assumptions before explaining each conclusion, connecting the learning problem, objectives, optimization, differentiation, representations and generalization. The presentation is in Chinese.",
    bridge: "Connections to further study",
    connection: "Matrix operations, probabilistic losses, representation learning, backpropagation and generalization provide foundations for CS224N and CS336. Softmax, numerical stability and automatic differentiation checks supplement the original notes rather than translating them word for word.",
    cs336: "Continue to the CS336 learning journal"
  }
};

export function CoursePresentations({ locale }: Readonly<{ locale: FoundationLocale }>) {
  const text = copy[locale];
  const home = `/?lang=${locale}#map`;
  const alternate = locale === "en" ? "/courses/machine-learning/" : "/en/courses/machine-learning/";
  const basePath = process.env.PAGES_BASE_PATH ?? "";

  return (
    <div lang={locale}>
      <header className="chapter-global-nav">
        <Link className="brand" href={home}>Foundation</Link>
        <nav aria-label={locale === "en" ? "Primary" : "主导航"}>
          <Link href={home}>{text.chapters}</Link>
          <a href="#top" aria-current="page">{text.navigation}</a>
          <Link href={alternate} hrefLang={locale === "en" ? "zh-CN" : "en"}>{text.language}</Link>
        </nav>
      </header>
      <main className="course-journal" id="top">
        <header>
          <p className="concept-meta">{course.subtitle[locale]}</p>
          <h1>{course.title[locale]}</h1>
          <p className="course-lead">{course.description[locale]}</p>
          {course.status === "ai-draft" && <p>{text.draft}</p>}
          <a href={presentationUrl(course.id, course.presentationTrace, basePath)} hrefLang={course.presentationLocale}>{text.open} ›</a>
        </header>
        <section aria-labelledby="lessons">
          <h2 id="lessons">{text.lessons}</h2>
          <p>{text.sequence}</p>
          <ul className="course-topics">
            {course.sections.map((section) => (
              <li key={section.id} id={section.id}>
                <h3>{section.title[locale]}</h3>
                <p>{section.summary[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="use">
          <h2 id="use">{text.use}</h2>
          <p>{text.guidance}</p>
        </section>
        <section aria-labelledby="connection">
          <h2 id="connection">{text.bridge}</h2>
          <p>{text.connection}</p>
          <Link href={locale === "en" ? "/en/courses/cs336-2026/" : "/courses/cs336-2026/"}>{text.cs336} ›</Link>
        </section>
      </main>
      <footer>Foundation</footer>
    </div>
  );
}
