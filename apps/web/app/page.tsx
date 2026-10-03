import path from "node:path";
import { loadConceptCatalog } from "@foundation/knowledge/server";
import { KnowledgeExplorer } from "../components/knowledge-explorer";

const contentRoot = path.resolve(process.cwd(), "..", "..", "content", "concepts");

export default async function Home() {
  const concepts = await loadConceptCatalog(contentRoot);
  const domainCount = new Set(concepts.map((concept) => concept.domain)).size;
  const interactiveCount = concepts.filter(
    (concept) => concept.interaction.kind !== "none"
  ).length;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Foundation home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>Foundation</span>
        </a>
        <nav aria-label="Primary">
          <a href="#principles">Principles</a>
          <a href="#map">Explore</a>
          <a href="https://github.com/Civitasv/Foundation">GitHub</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">AGENT ENGINEERING / FROM FIRST PRINCIPLES</div>
        <h1>Open every abstraction.</h1>
        <p className="hero-copy">
          Follow the chain from vectors to attention, from language models to tool use,
          and from agent loops to reliable runtimes. Learn it as one connected system.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#map">Explore the map</a>
          <a className="secondary-action" href="#principles">How Foundation works</a>
        </div>
        <dl className="stats" aria-label="Seed curriculum statistics">
          <div><dt>{concepts.length}</dt><dd>seed concepts</dd></div>
          <div><dt>{domainCount}</dt><dd>domains</dd></div>
          <div><dt>{interactiveCount}</dt><dd>planned interactions</dd></div>
        </dl>
      </section>

      <section className="section" id="principles">
        <div className="section-heading">
          <span>01 / MODEL</span>
          <h2>A curriculum is a graph, not a table of contents.</h2>
        </div>
        <div className="principle-grid">
          <article>
            <span className="card-index">LEARN</span>
            <h3>Prerequisite-aware paths</h3>
            <p>Guided routes are derived from the same concept graph rather than hard-coded as another curriculum.</p>
          </article>
          <article>
            <span className="card-index">EXPLORE</span>
            <h3>Move in any direction</h3>
            <p>Start at Agent Runtime, open State, keep opening abstractions until the missing foundation becomes concrete.</p>
          </article>
          <article>
            <span className="card-index">BUILD</span>
            <h3>Manipulate the idea</h3>
            <p>Concepts graduate from prose into visualizers, simulators, and labs that expose the mechanism directly.</p>
          </article>
        </div>
      </section>

      <section className="section map-section" id="map">
        <div className="section-heading">
          <span>02 / EXPLORE</span>
          <h2>The first nodes.</h2>
          <p>Select a concept to inspect what it requires and what it unlocks.</p>
        </div>
        <KnowledgeExplorer concepts={concepts} />
      </section>

      <footer>
        <span>Foundation</span>
        <span>Open source · MIT · built as a knowledge graph first</span>
      </footer>
    </main>
  );
}
