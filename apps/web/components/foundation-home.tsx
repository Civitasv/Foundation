"use client";

import { useEffect, useState } from "react";
import type { ConceptMetadata, FoundationLocale } from "@foundation/knowledge";
import { KnowledgeExplorer } from "./knowledge-explorer";

const copy = {
  "zh-CN": {
    navMethod: "学习方式",
    navMap: "知识地图",
    heroTitle: "从第一性原理，理解 Agent。",
    heroCopy:
      "从数学、Transformer 和 LLM，一直打开到工具、运行时、记忆、安全与评测。把 Agent Engineering 学成一套完整的系统。",
    explore: "浏览知识地图",
    github: "GitHub",
    premiseTitle: "不要只学会调用它。",
    premiseBody:
      "Foundation 不从框架开始，而是不断向下打开抽象。Agent 可以打开成状态、工具与控制循环；LLM 可以打开成 Transformer；Attention 还能继续打开成投影、点积、Softmax 和向量。",
    premiseBody2:
      "目标是建立足够精确的心智模型，让你能够解释、实现、调试，最后改变架构本身。",
    methodTitle: "三种方式，使用同一张知识图。",
    learn: "学习",
    learnCopy: "按照前置依赖逐步学习，不需要自己猜顺序。",
    inspect: "探索",
    inspectCopy: "从当前困惑的概念出发，继续打开它真正依赖的知识。",
    build: "动手",
    buildCopy: "通过可视化、模拟器和实验，把抽象机制变成可以操作的对象。",
    mapTitle: "知识地图",
    mapCopy: "选择一个概念，查看它的前置知识和后续路径。",
    footer: "开源 · MIT · 中文优先，英文同步"
  },
  en: {
    navMethod: "Method",
    navMap: "Map",
    heroTitle: "Understand agents from first principles.",
    heroCopy:
      "Open the stack from mathematics, Transformers, and LLMs all the way to tools, runtimes, memory, security, and evaluation.",
    explore: "Explore the map",
    github: "GitHub",
    premiseTitle: "Do not stop at learning how to call it.",
    premiseBody:
      "Foundation does not begin with a framework. It keeps opening abstractions. An agent opens into state, tools, and control loops. An LLM opens into a Transformer. Attention opens again into projections, dot products, softmax, and vectors.",
    premiseBody2:
      "The goal is a mental model precise enough to explain, implement, debug, and eventually change the architecture itself.",
    methodTitle: "Three ways to use the same knowledge graph.",
    learn: "Learn",
    learnCopy: "Follow prerequisite-aware paths instead of guessing the right order.",
    inspect: "Explore",
    inspectCopy: "Start from the concept blocking you and open what it really depends on.",
    build: "Build",
    buildCopy: "Use visualizers, simulators, and labs when prose is no longer enough.",
    mapTitle: "Knowledge map",
    mapCopy: "Select a concept to inspect its prerequisites and what it unlocks.",
    footer: "Open source · MIT · Chinese first, English alongside"
  }
} satisfies Record<FoundationLocale, Record<string, string>>;

export function FoundationHome({
  concepts
}: Readonly<{ concepts: ConceptMetadata[] }>) {
  const [locale, setLocale] = useState<FoundationLocale>("zh-CN");
  const text = copy[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem("foundation-locale");
    if (saved === "en" || saved === "zh-CN") setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("foundation-locale", locale);
  }, [locale]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top">Foundation</a>

        <nav aria-label={locale === "zh-CN" ? "主导航" : "Primary"}>
          <a href="#method">{text.navMethod}</a>
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

      <section className="hero" id="top">
        <h1>{text.heroTitle}</h1>
        <p>{text.heroCopy}</p>
        <div className="hero-links">
          <a href="#map">{text.explore}<span aria-hidden="true"> ›</span></a>
          <a href="https://github.com/Civitasv/Foundation">{text.github}<span aria-hidden="true"> ↗</span></a>
        </div>
      </section>

      <section className="content-section premise">
        <h2>{text.premiseTitle}</h2>
        <div className="body-copy">
          <p>{text.premiseBody}</p>
          <p>{text.premiseBody2}</p>
        </div>
      </section>

      <section className="content-section" id="method">
        <h2>{text.methodTitle}</h2>
        <div className="method-grid">
          <article>
            <h3>{text.learn}</h3>
            <p>{text.learnCopy}</p>
          </article>
          <article>
            <h3>{text.inspect}</h3>
            <p>{text.inspectCopy}</p>
          </article>
          <article>
            <h3>{text.build}</h3>
            <p>{text.buildCopy}</p>
          </article>
        </div>
      </section>

      <section className="map-section" id="map">
        <div className="map-intro">
          <h2>{text.mapTitle}</h2>
          <p>{text.mapCopy}</p>
        </div>
        <KnowledgeExplorer concepts={concepts} locale={locale} />
      </section>

      <footer>
        <span>Foundation</span>
        <span>{text.footer}</span>
      </footer>
    </main>
  );
}
