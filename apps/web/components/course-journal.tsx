import Link from "next/link";
import type { FoundationLocale } from "@foundation/knowledge";
import course from "../../../content/courses/cs336-2026/course.json";

const copy = {
  "zh-CN": {
    chapters: "章节",
    language: "EN",
    label: "学习记录 · Stanford CS336 · Spring 2026",
    records: "逐节记录",
    empty: "第一篇学习记录尚未发布。",
    next: "从第一节开始，每学完一节，用视频讲解自己的理解，再留下文字笔记、实验与待解的问题。记录会随学习逐步补充。",
    approach: "学一节，讲清一节",
    steps: ["学习课程，记下核心问题与不理解的地方。", "合上资料，用自己的话解释，再用推导或代码验证。", "发布讲解视频与文字记录，保留感悟、疑问和后续勘误。"],
    connection: "学习记录按课程顺序展开；逐渐成熟的解释会沉淀到 Foundation 的概念章节，并在记录中关联。",
    resources: "课程资料",
    official: "Stanford CS336 · 2026 官方课程",
    note: "这里记录个人的学习与讲解。原始课程、课件和作业请访问官方课程网站。"
  },
  en: {
    chapters: "Chapters",
    language: "中文",
    label: "Learning journal · Stanford CS336 · Spring 2026",
    records: "Lecture journal",
    empty: "The first learning entry has not been published yet.",
    next: "Starting with the first lecture, each entry will explain my understanding through video, accompanied by written notes, experiments, and open questions. Entries will be added as I learn.",
    approach: "Learn a lecture, explain it clearly",
    steps: ["Study the lecture and note its core questions and unclear ideas.", "Close the materials, explain in my own words, and verify through derivations or code.", "Publish a video and written record, preserving reflections, questions, and later corrections."],
    connection: "Entries follow the course sequence. As explanations mature, they will inform Foundation’s concept chapters and link to them from the journal.",
    resources: "Course materials",
    official: "Stanford CS336 · 2026 official course",
    note: "This is a personal learning and explanation journal. Visit the official course website for the original lectures, materials, and assignments."
  }
};

export function CourseJournal({ locale }: Readonly<{ locale: FoundationLocale }>) {
  const text = copy[locale];
  const home = locale === "en" ? "/?lang=en#map" : "/?lang=zh-CN#map";
  const alternate = locale === "en" ? "/courses/cs336-2026/" : "/en/courses/cs336-2026/";

  return (
    <div lang={locale}>
      <header className="chapter-global-nav">
        <Link className="brand" href={home}>Foundation</Link>
        <nav aria-label={locale === "en" ? "Primary" : "主导航"}>
          <Link href={home}>{text.chapters}</Link>
          <a href="#top" aria-current="page">CS336 · 2026</a>
          <Link href={alternate} hrefLang={locale === "en" ? "zh-CN" : "en"}>{text.language}</Link>
        </nav>
      </header>
      <main className="course-journal" id="top">
        <header>
          <p className="concept-meta">{text.label}</p>
          <h1>{course.title[locale]}</h1>
          <p className="course-lead">{course.description[locale]}</p>
        </header>
        <section aria-labelledby="records">
          <h2 id="records">{text.records}</h2>
          <p>{text.empty}</p>
          <p>{text.next}</p>
        </section>
        <section aria-labelledby="approach">
          <h2 id="approach">{text.approach}</h2>
          <ol>{text.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p>{text.connection}</p>
          <Link href={home}>{text.chapters} ›</Link>
        </section>
        <section aria-labelledby="resources">
          <h2 id="resources">{text.resources}</h2>
          <a href={course.officialUrl}>{text.official} ↗</a>
          <p>{text.note}</p>
        </section>
      </main>
      <footer>Foundation</footer>
    </div>
  );
}
