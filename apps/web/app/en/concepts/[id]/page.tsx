import type { Metadata } from "next";
import {
  ConceptChapter,
  conceptMetadata,
  conceptStaticParams
} from "../../../../components/reading/concept-chapter";

export const dynamicParams = false;

export async function generateStaticParams() {
  return conceptStaticParams();
}

export async function generateMetadata({
  params
}: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
  const { id } = await params;
  return conceptMetadata(id, "en");
}

export default async function ConceptPage({
  params
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return <ConceptChapter id={id} locale="en" />;
}
