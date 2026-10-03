"use client";

import { useEffect, useState } from "react";
import type { ConceptMetadata, FoundationLocale } from "@foundation/knowledge";
import { KnowledgeExplorer } from "./knowledge-explorer";

const copy = {
  "zh-CN": {
    navOverview: "总览",
    overviewRead: "先读 Agent 工程总览",
    navMap: "章节",
    mapTitle: "章节",
    mapCopy: "选择一个章节，查看前置知识与后续学习路径。"
  },
  en: {
    navOverview: "Overview",
    overviewRead: "Start with the Agent Engineering Overview",
    navMap: "Chapters",
    mapTitle: "Chapters",
    mapCopy: "Choose a chapter to explore its prerequisites and where to go next."
  }
} satisfies Record<FoundationLocale, Record<string, string>>;

export function FoundationHome({
  concepts
}: Readonly<{ concepts: ConceptMetadata[] }>) {
  const [locale, setLocale] = useState<FoundationLocale>("zh-CN");
  const text = copy[locale];
  const overviewHref = locale === "en"
    ? "/en/concepts/agent-engineering/"
    : "/concepts/agent-engineering/";

  useEffect(() => {
    const saved = window.localStorage.getItem("foundation-locale");
    if (saved === "en" || saved === "zh-CN") setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("foundation-locale", locale);
  }, [locale]);

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top">Foundation</a>

        <nav aria-label={locale === "zh-CN" ? "主导航" : "Primary"}>
          <a href={overviewHref}>{text.navOverview}</a>
          <a href="#map">{text.navMap}</a>
          <a href="https://github.com/Civitasv/Foundation">GitHub</a>
        </nav>

        <div className="language-switch" aria-label="Language">
          <button
            aria-pressed={locale === "zh-CN"}
            onClick={() => setLocale("zh-CN")}
            type="button"
          >
            中文
          </button>
          <button
            aria-pressed={locale === "en"}
            onClick={() => setLocale("en")}
            type="button"
          >
            EN
          </button>
        </div>
      </header>

      <section className="map-section" id="map">
        <div className="map-intro">
          <h1>{text.mapTitle}</h1>
          <p>{text.mapCopy}</p>
          <a className="overview-read-link" href={overviewHref}>{text.overviewRead} ›</a>
        </div>
        <KnowledgeExplorer concepts={concepts} locale={locale} />
      </section>

      <footer>
        <span>Foundation</span>
      </footer>
    </main>
  );
}
