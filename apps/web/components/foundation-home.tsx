"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConceptMetadata, FoundationLocale } from "@foundation/knowledge";
import { KnowledgeExplorer } from "./knowledge-explorer";

const copy = {
  "zh-CN": {
    navPremise: "为什么",
    navMethod: "怎么学",
    navMap: "知识地图",
    heroEyebrow: "AGENT ENGINEERING · FROM FIRST PRINCIPLES",
    heroTitle: "从第一性原理，真正理解 Agent。",
    heroCopy:
      "Foundation 是一张可交互的知识地图。它把数学、Transformer、LLM、工具调用、运行时、记忆、安全与评测连接成一个完整系统。",
    primaryAction: "探索知识地图",
    secondaryAction: "为什么做 Foundation",
    concepts: "知识节点",
    domains: "知识领域",
    interactions: "交互目标",
    premiseKicker: "01 · PREMISE",
    premiseTitle: "不要停在“会用”。继续向下打开。",
    premiseBody:
      "大多数 Agent 教程从框架开始：接一个模型，声明几个工具，再写一个循环。这样可以很快做出东西，但很多关键机制仍然是黑盒。",
    premiseBody2:
      "Foundation 反过来做。Agent 可以打开成状态、工具和控制循环；LLM 可以打开成 Transformer；Attention 还能继续打开成投影、点积、Softmax 和向量。你可以一直追到真正理解为止。",
    premiseQuote:
      "目标不是记住一套技术栈，而是建立足够精确的心智模型，让你能够实现、调试，最后改变架构本身。",
    methodKicker: "02 · METHOD",
    methodTitle: "同一张知识图，三种学习方式。",
    learn: "学习",
    learnCopy: "按前置依赖生成路径。第一次接触一个领域时，不需要自己猜顺序。",
    explore: "探索",
    exploreCopy: "从你正在困惑的概念出发，一层层打开它真正依赖的东西。",
    build: "动手",
    buildCopy: "当文字不够时，用可视化、模拟器和实验把机制变成可以操作的对象。",
    mapKicker: "03 · EXPLORE",
    mapTitle: "先从这些节点开始。",
    mapCopy: "选择一个概念，看看它依赖什么，又会解锁什么。",
    footer: "开源 · MIT · 中文优先，英文同步"
  },
  en: {
    navPremise: "Why",
    navMethod: "Method",
    navMap: "Map",
    heroEyebrow: "AGENT ENGINEERING · FROM FIRST PRINCIPLES",
    heroTitle: "Understand agents from first principles.",
    heroCopy:
      "Foundation is an interactive knowledge map connecting mathematics, Transformers, LLMs, tool use, runtimes, memory, security, and evaluation into one system.",
    primaryAction: "Explore the map",
    secondaryAction: "Why Foundation",
    concepts: "concepts",
    domains: "domains",
    interactions: "interactive targets",
    premiseKicker: "01 · PREMISE",
    premiseTitle: "Do not stop at knowing how to use it. Keep opening the abstraction.",
    premiseBody:
      "Most agent tutorials begin at the framework layer: connect a model, declare a few tools, then add a loop. You can ship quickly, but too many important mechanisms remain opaque.",
    premiseBody2:
      "Foundation works in the opposite direction. An agent opens into state, tools, and control loops. An LLM opens into a Transformer. Attention opens again into projections, dot products, softmax, and vectors.",
    premiseQuote:
      "The goal is not to memorize a stack. It is to build a mental model precise enough to implement, debug, and eventually change the architecture itself.",
    methodKicker: "02 · METHOD",
    methodTitle: "One knowledge graph. Three ways to learn.",
    learn: "Learn",
    learnCopy: "Generate paths from prerequisites so beginners never need to guess the right order.",
    explore: "Explore",
    exploreCopy: "Start from the concept that is blocking you and keep opening what it depends on.",
    build: "Build",
    buildCopy: "When prose stops being enough, use visualizers, simulators, and labs to manipulate the mechanism.",
    mapKicker: "03 · EXPLORE",
    mapTitle: "Start with these nodes.",
    mapCopy: "Select a concept to inspect what it requires and what it unlocks.",
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
    if (saved === "en" || saved === "zh-CN") {
      setLocale(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("foundation-locale", locale);
  }, [locale]);

  const domainCount = useMemo(
    () => new Set(concepts.map((concept) => concept.domain)).size,
    [concepts]
  );

  const interactiveCount = useMemo(
    () => concepts.filter((concept) => concept.interaction.kind !== "none").length,
    [concepts]
  );

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Foundation home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>Foundation</span>
        </a>

        <nav aria-label={locale === "zh-CN" ? "主导航" : "Primary"}>
          <a href="#premise">{text.navPremise}</a>
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
            中
          </button>
          <span aria-hidden="true">/</span>
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
        <div className="eyebrow">{text.heroEyebrow}</div>
        <h1>{text.heroTitle}</h1>
        <p className="hero-copy">{text.heroCopy}</p>

        <div className="hero-actions">
          <a className="primary-action" href="#map">{text.primaryAction}</a>
          <a className="secondary-action" href="#premise">{text.secondaryAction}</a>
        </div>

        <dl className="stats" aria-label="Curriculum statistics">
          <div><dt>{concepts.length}</dt><dd>{text.concepts}</dd></div>
          <div><dt>{domainCount}</dt><dd>{text.domains}</dd></div>
          <div><dt>{interactiveCount}</dt><dd>{text.interactions}</dd></div>
        </dl>
      </section>

      <section className="narrow-section" id="premise">
        <div className="section-kicker">{text.premiseKicker}</div>
        <h2>{text.premiseTitle}</h2>
        <div className="prose">
          <p>{text.premiseBody}</p>
          <p>{text.premiseBody2}</p>
          <blockquote>{text.premiseQuote}</blockquote>
        </div>
      </section>

      <section className="narrow-section" id="method">
        <div className="section-kicker">{text.methodKicker}</div>
        <h2>{text.methodTitle}</h2>

        <div className="method-list">
          <article>
            <span>01</span>
            <div>
              <h3>{text.learn}</h3>
              <p>{text.learnCopy}</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>{text.explore}</h3>
              <p>{text.exploreCopy}</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>{text.build}</h3>
              <p>{text.buildCopy}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="wide-section" id="map">
        <div className="map-heading">
          <div className="section-kicker">{text.mapKicker}</div>
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
