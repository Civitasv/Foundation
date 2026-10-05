"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ConceptMetadata, FoundationLocale } from "@foundation/knowledge";
import { KnowledgeExplorer } from "./knowledge-explorer";
import { CatalogStressHarness } from "./dev/catalog-stress-harness";

const copy = {
  "zh-CN": {
    navOverview: "总览",
    overviewRead: "先读总览：从图灵机到大模型",
    navMap: "章节",
    mapTitle: "章节",
    mapCopy: "选择一个章节，查看前置知识与后续学习路径。"
  },
  en: {
    navOverview: "Overview",
    overviewRead: "Start with the overview: from Turing machines to LLMs",
    navMap: "Chapters",
    mapTitle: "Chapters",
    mapCopy: "Choose a chapter to explore its prerequisites and where to go next."
  }
} satisfies Record<FoundationLocale, Record<string, string>>;

export function FoundationHome({
  concepts
}: Readonly<{ concepts: ConceptMetadata[] }>) {
  const [locale, setLocale] = useState<FoundationLocale>("zh-CN");
  const [localeReady, setLocaleReady] = useState(false);
  const text = copy[locale];
  const overviewHref = locale === "en"
    ? "/en/concepts/agent-engineering/"
    : "/concepts/agent-engineering/";

  useEffect(() => {
    let saved = new URLSearchParams(window.location.search).get("lang");
    try {
      saved ??= window.localStorage.getItem("foundation-locale");
    } catch { /* Reading remains available when storage is disabled. */ }
    if (saved === "en" || saved === "zh-CN") setLocale(saved);
    setLocaleReady(true);
  }, []);

  useEffect(() => {
    if (!localeReady) return;
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem("foundation-locale", locale);
    } catch { /* Saving the language preference is optional. */ }
  }, [locale, localeReady]);

  function selectLocale(next: FoundationLocale) {
    setLocale(next);
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url);
    }
  }

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top">Foundation</a>

        <nav aria-label={locale === "zh-CN" ? "主导航" : "Primary"}>
          <a href={overviewHref}>{text.navOverview}</a>
          <a href="#map">{text.navMap}</a>
          <Link href={locale === "en" ? "/en/courses/machine-learning/" : "/courses/machine-learning/"}>{locale === "en" ? "Machine Learning" : "机器学习"}</Link>
          <Link href={locale === "en" ? "/en/courses/cs336-2026/" : "/courses/cs336-2026/"}>CS336 · 2026</Link>
          <a href="https://github.com/Civitasv/Foundation">GitHub</a>
        </nav>

        <div className="language-switch" aria-label="Language">
          <button
            aria-pressed={locale === "zh-CN"}
            onClick={() => selectLocale("zh-CN")}
            type="button"
          >
            中文
          </button>
          <button
            aria-pressed={locale === "en"}
            onClick={() => selectLocale("en")}
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
        {process.env.NODE_ENV === "development"
          ? <CatalogStressHarness concepts={concepts} locale={locale} />
          : <KnowledgeExplorer concepts={concepts} locale={locale} />}
      </section>

      <footer>
        <span>Foundation</span>
      </footer>
    </main>
  );
}
