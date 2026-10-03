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
          <a href="#premise">Premise</a>
          <a href="#map">Explore</a>
          <a href="https://github.com/Civitasv/Foundation">GitHub</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-number" aria-hidden="true">00</div>
        <div className="eyebrow">AGENT ENGINEERING / FROM FIRST PRINCIPLES</div>
        <h1>Understand agents all the way down.</h1>
        <p className="hero-copy">
          Foundation is an interactive map of the ideas beneath modern agents:
          mathematics, models, inference, tools, runtimes, memory, security,
          and evaluation.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#map">Explore the map</a>
          <a className="secondary-action" href="#premise">Read the premise</a>
        </div>
        <dl className="stats" aria-label="Seed curriculum statistics">
          <div><dt>{concepts.length}</dt><dd>seed concepts</dd></div>
          <div><dt>{domainCount}</dt><dd>domains</dd></div>
          <div><dt>{interactiveCount}</dt><dd>interactive targets</dd></div>
        </dl>
      </section>

      <section className="reading-section" id="premise">
        <div className="reading-rail">
          <span>01</span>
          <span>Premise</span>
        </div>

        <article className="prose">
          <h2>Every abstraction should be openable.</h2>
          <p>
            Most agent tutorials begin at the framework layer. They show a model,
            a tool definition, a loop, and enough glue to make something happen.
            That is useful for shipping, but it leaves too many mechanisms opaque.
          </p>
          <p>
            Foundation starts from the opposite direction. If an agent depends on
            a language model, the model can be opened into Transformer blocks. An
            attention block can be opened into projections, dot products, softmax,
            and vectors. A runtime can be opened into state transitions, processes,
            permissions, retries, and persistence.
          </p>
          <p>
            The goal is not to memorize a stack. It is to build a connected mental
            model precise enough that you can implement, debug, and eventually
            change the architecture yourself.
          </p>

          <h3>Learn, explore, then build</h3>
          <p>
            Guided paths help when order matters. The graph helps when you already
            know where the gap is. Interactive labs exist for the point where prose
            stops being enough and the mechanism needs to become tangible.
          </p>
        </article>

        <aside className="margin-note">
          <span className="note-label">Design rule</span>
          <p>
            Reading surfaces stay narrow. Graphs, simulators, and code are allowed
            to break out wider when the information demands it.
          </p>
        </aside>
      </section>

      <section className="section principles-section">
        <div className="section-heading">
          <span>02 / METHOD</span>
          <h2>One knowledge model, three ways to use it.</h2>
        </div>
        <div className="principle-grid">
          <article>
            <span className="card-index">LEARN</span>
            <h3>Prerequisite-aware paths</h3>
            <p>
              Guided routes are derived from the concept graph instead of being
              maintained as a second curriculum.
            </p>
          </article>
          <article>
            <span className="card-index">EXPLORE</span>
            <h3>Move in any direction</h3>
            <p>
              Start from the abstraction you care about and keep opening it until
              the missing foundation becomes concrete.
            </p>
          </article>
          <article>
            <span className="card-index">BUILD</span>
            <h3>Manipulate the mechanism</h3>
            <p>
              Visualizers, simulators, and labs turn definitions into systems you
              can inspect, alter, and eventually implement.
            </p>
          </article>
        </div>
      </section>

      <section className="section map-section" id="map">
        <div className="section-heading">
          <span>03 / EXPLORE</span>
          <h2>The first nodes.</h2>
          <p>Select a concept to inspect what it requires and what it unlocks.</p>
        </div>
        <KnowledgeExplorer concepts={concepts} />
      </section>

      <footer>
        <span>Foundation</span>
        <span>Open source · MIT · knowledge graph first</span>
      </footer>
    </main>
  );
}
