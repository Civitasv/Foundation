import path from "node:path";
import { loadConceptCatalog } from "@foundation/knowledge/server";
import { FoundationHome } from "../components/foundation-home";

const contentRoot = path.resolve(process.cwd(), "..", "..", "content", "concepts");

export default async function Home() {
  const concepts = await loadConceptCatalog(contentRoot);

  return <FoundationHome concepts={concepts} />;
}
