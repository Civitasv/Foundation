import type { ComponentProps, ReactNode } from "react";
import { slugifyHeading } from "@foundation/knowledge";
import { DotProductPlayground } from "./dot-product-playground";
import { MatrixTransformPlayground } from "./matrix-transform-playground";
import { DistributionPlayground } from "./distribution-playground";
import { VectorPlayground } from "./vector-playground";

function headingText(children: ReactNode): string {
  return typeof children === "string" || typeof children === "number"
    ? String(children)
    : "section";
}

function Heading2(props: ComponentProps<"h2">) {
  const id = slugifyHeading(headingText(props.children));
  return <h2 {...props} id={id} />;
}

function Heading3(props: ComponentProps<"h3">) {
  const id = slugifyHeading(headingText(props.children));
  return <h3 {...props} id={id} />;
}

export function Aside({
  children,
  kind = "context",
  title
}: Readonly<{
  children: ReactNode;
  kind?: "definition" | "context" | "tip" | "source" | "derivation";
  title?: string;
}>) {
  return (
    <aside className="semantic-aside" data-kind={kind}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </aside>
  );
}

export function Equation({
  children,
  label
}: Readonly<{ children: ReactNode; label?: string }>) {
  return (
    <figure className="equation-block">
      {label ? <figcaption>{label}</figcaption> : null}
      <div aria-label={label} role="math">{children}</div>
    </figure>
  );
}

export function CodeStep({
  children,
  title
}: Readonly<{ children: ReactNode; title?: string }>) {
  return (
    <section className="code-step">
      {title ? <div className="code-step-title">{title}</div> : null}
      {children}
    </section>
  );
}

export function InteractiveBreakout({
  children,
  title
}: Readonly<{ children: ReactNode; title?: string }>) {
  return (
    <section className="interactive-breakout">
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

export function ReferenceList({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="reference-list">{children}</div>;
}

export const mdxComponents = {
  h2: Heading2,
  h3: Heading3,
  Aside,
  Equation,
  CodeStep,
  InteractiveBreakout,
  ReferenceList,
  DotProductPlayground,
  MatrixTransformPlayground,
  DistributionPlayground,
  VectorPlayground
};
