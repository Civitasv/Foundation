import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  extractLessonHeadings,
  getConceptNeighbors,
  localize,
  stripLeadingTitle,
  type FoundationLocale
} from "@foundation/knowledge";
import {
  loadConceptCatalog,
  loadConceptLesson
} from "@foundation/knowledge/server";
import { mdxComponents } from "./mdx-components";

const contentRoot = path.resolve(process.cwd(), "..", "..", "content", "concepts");

const domainLabels = {
  "zh-CN": {
    foundations: "基础",
    models: "模型",
    agents: "Agent",
    systems: "系统",
    production: "生产"
  },
  en: {
    foundations: "Foundations",
    models: "Models",
    agents: "Agents",
    systems: "Systems",
    production: "Production"
  }
} as const;

const ui = {
  "zh-CN": {
    overview: "总览",
    backToChapters: "浏览全部章节",
    map: "章节",
    toc: "本章",
    previous: "上一章",
    next: "下一章",
    noPrevious: "这是当前路径的起点",
    language: "EN"
  },
  en: {
    overview: "Overview",
    backToChapters: "Browse all chapters",
    map: "Chapters",
    toc: "On this page",
    previous: "Previous",
    next: "Next",
    noPrevious: "Start of this path",
    language: "中文"
  }
} as const;

function conceptHref(id: string, locale: FoundationLocale): string {
  return locale === "en" ? `/en/concepts/${id}/` : `/concepts/${id}/`;
}

export async function ConceptChapter({
  id,
  locale
}: Readonly<{ id: string; locale: FoundationLocale }>) {
  const [concepts, source] = await Promise.all([
    loadConceptCatalog(contentRoot),
    loadConceptLesson(contentRoot, id, locale)
  ]);

  const concept = concepts.find((item) => item.id === id);
  if (!concept) notFound();

  const headings = extractLessonHeadings(source);
  const body = stripLeadingTitle(source);
  const neighbors = getConceptNeighbors(concepts, id);
  const text = ui[locale];
  const alternateHref = locale === "en" ? `/concepts/${id}/` : `/en/concepts/${id}/`;

  return (
    <>
      <header className="chapter-global-nav" lang={locale}>
        <Link className="brand" href="/">Foundation</Link>
        <nav aria-label={locale === "zh-CN" ? "主导航" : "Primary"}>
          <Link href={conceptHref("agent-engineering", locale)} aria-current={id === "agent-engineering" ? "page" : undefined}>{text.overview}</Link>
          <Link href="/#map">{text.map}</Link>
          <a href="https://github.com/Civitasv/Foundation">GitHub</a>
          <Link href={alternateHref} hrefLang={locale === "en" ? "zh-CN" : "en"}>{text.language}</Link>
        </nav>
      </header>

      <main className="chapter-page" lang={locale}>
        <header className="chapter-opening">
          <div className="chapter-domain">{domainLabels[locale][concept.domain]}</div>
          <h1>{localize(concept.title, locale)}</h1>
          <div className="chapter-alternate-title">
            {localize(concept.title, locale === "en" ? "zh-CN" : "en")}
          </div>
          <p>{localize(concept.summary, locale)}</p>
        </header>

        <div className="chapter-layout">
          <aside className="chapter-toc">
            <div>{text.toc}</div>
            <nav aria-label={text.toc}>
              {headings.map((heading) => (
                <a data-depth={heading.depth} href={`#${heading.id}`} key={heading.id}>
                  {heading.title}
                </a>
              ))}
            </nav>
          </aside>

          <details className="chapter-toc-mobile">
            <summary>{text.toc}</summary>
            <nav aria-label={text.toc}>
              {headings.map((heading) => (
                <a data-depth={heading.depth} href={`#${heading.id}`} key={heading.id}>
                  {heading.title}
                </a>
              ))}
            </nav>
          </details>

          <article className="chapter-flow">
            <MDXRemote components={mdxComponents} source={body} />

            <nav className="chapter-prev-next" aria-label={locale === "zh-CN" ? "章节导航" : "Chapter navigation"}>
              {id === "agent-engineering" ? (
                <Link href="/#map">{text.backToChapters} ›</Link>
              ) : (
                <>
                  <div>
                    <span>{text.previous}</span>
                    {neighbors.previous ? (
                      <Link href={conceptHref(neighbors.previous.id, locale)}>
                        {localize(neighbors.previous.title, locale)}
                      </Link>
                    ) : (
                      <p>{text.noPrevious}</p>
                    )}
                  </div>

                  <div>
                    <span>{text.next}</span>
                    {neighbors.next ? (
                      <Link href={conceptHref(neighbors.next.id, locale)}>
                        {localize(neighbors.next.title, locale)} ›
                      </Link>
                    ) : null}
                  </div>
                </>
              )}
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}

export async function conceptStaticParams() {
  const concepts = await loadConceptCatalog(contentRoot);
  return concepts.map((concept) => ({ id: concept.id }));
}

export async function conceptMetadata(id: string, locale: FoundationLocale) {
  const concepts = await loadConceptCatalog(contentRoot);
  const concept = concepts.find((item) => item.id === id);

  if (!concept) return {};

  return {
    title: `${localize(concept.title, locale)} — Foundation`,
    description: localize(concept.summary, locale)
  };
}
