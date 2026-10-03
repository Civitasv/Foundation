"use client";

import { useMemo, useRef, useState } from "react";
import type { FoundationLocale } from "@foundation/knowledge";

const labels = {
  "zh-CN": {
    instruction: "拖动两个端点，观察夹角、投影和点积如何一起变化。",
    vectorA: "向量 a",
    vectorB: "向量 b",
    dot: "点积 a·b",
    cosine: "余弦相似度",
    angle: "夹角",
    projection: "a 在 b 上的投影长度",
    reset: "重置",
    same: "同向",
    opposite: "反向",
    perpendicular: "接近垂直",
    mixed: "一般夹角"
  },
  en: {
    instruction: "Drag both endpoints and watch angle, projection, and dot product change together.",
    vectorA: "Vector a",
    vectorB: "Vector b",
    dot: "Dot product a·b",
    cosine: "Cosine similarity",
    angle: "Angle",
    projection: "Projection length of a onto b",
    reset: "Reset",
    same: "Same direction",
    opposite: "Opposite direction",
    perpendicular: "Nearly perpendicular",
    mixed: "General angle"
  }
} as const;

const WIDTH = 640;
const HEIGHT = 360;
const SCALE = 30;
const ORIGIN_X = WIDTH / 2;
const ORIGIN_Y = HEIGHT / 2;

type Vector = {
  x: number;
  y: number;
};

function clamp(value: number): number {
  return Math.max(-5, Math.min(5, value));
}

function dot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

function magnitude(v: Vector): number {
  return Math.hypot(v.x, v.y);
}

function cosineSimilarity(a: Vector, b: Vector): number {
  const denominator = magnitude(a) * magnitude(b);
  return denominator === 0 ? 0 : dot(a, b) / denominator;
}

function angleDegrees(a: Vector, b: Vector): number {
  const cosine = Math.max(-1, Math.min(1, cosineSimilarity(a, b)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

function projectionLength(a: Vector, b: Vector): number {
  const bMagnitude = magnitude(b);
  return bMagnitude === 0 ? 0 : dot(a, b) / bMagnitude;
}

function endpoint(vector: Vector) {
  return {
    x: ORIGIN_X + vector.x * SCALE,
    y: ORIGIN_Y - vector.y * SCALE
  };
}

export function DotProductPlayground({
  locale
}: Readonly<{ locale: FoundationLocale }>) {
  const [a, setA] = useState<Vector>({ x: 4, y: 1 });
  const [b, setB] = useState<Vector>({ x: 2, y: 3 });
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const text = labels[locale];

  const aEnd = endpoint(a);
  const bEnd = endpoint(b);
  const dotValue = useMemo(() => dot(a, b), [a, b]);
  const cosine = useMemo(() => cosineSimilarity(a, b), [a, b]);
  const angle = useMemo(() => angleDegrees(a, b), [a, b]);
  const projection = useMemo(() => projectionLength(a, b), [a, b]);

  const relationship =
    cosine > 0.9
      ? text.same
      : cosine < -0.9
        ? text.opposite
        : Math.abs(cosine) < 0.1
          ? text.perpendicular
          : text.mixed;

  function updateFromPointer(
    target: "a" | "b",
    clientX: number,
    clientY: number
  ) {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const localX = ((clientX - rect.left) / rect.width) * WIDTH;
    const localY = ((clientY - rect.top) / rect.height) * HEIGHT;

    const next = {
      x: Math.round(clamp((localX - ORIGIN_X) / SCALE) * 10) / 10,
      y: Math.round(clamp((ORIGIN_Y - localY) / SCALE) * 10) / 10
    };

    if (target === "a") setA(next);
    else setB(next);
  }

  return (
    <div className="dot-product-playground">
      <div className="dot-stage">
        <svg
          aria-label={text.instruction}
          onPointerMove={(event) => {
            if (dragging) {
              updateFromPointer(dragging, event.clientX, event.clientY);
            }
          }}
          onPointerUp={() => setDragging(null)}
          onPointerCancel={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
          ref={svgRef}
          role="img"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        >
          <defs>
            <marker
              id="dot-arrow-a"
              markerHeight="8"
              markerWidth="8"
              orient="auto-start-reverse"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path className="dot-arrow-a-fill" d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
            <marker
              id="dot-arrow-b"
              markerHeight="8"
              markerWidth="8"
              orient="auto-start-reverse"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path className="dot-arrow-b-fill" d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>

          {Array.from({ length: 11 }, (_, index) => index - 5).map((value) => (
            <g key={value}>
              <line
                className="vector-grid-line"
                x1={ORIGIN_X + value * SCALE}
                x2={ORIGIN_X + value * SCALE}
                y1="0"
                y2={HEIGHT}
              />
              <line
                className="vector-grid-line"
                x1="0"
                x2={WIDTH}
                y1={ORIGIN_Y + value * SCALE}
                y2={ORIGIN_Y + value * SCALE}
              />
            </g>
          ))}

          <line className="vector-axis" x1="0" x2={WIDTH} y1={ORIGIN_Y} y2={ORIGIN_Y} />
          <line className="vector-axis" x1={ORIGIN_X} x2={ORIGIN_X} y1="0" y2={HEIGHT} />

          <line
            className="dot-vector-a"
            markerEnd="url(#dot-arrow-a)"
            x1={ORIGIN_X}
            x2={aEnd.x}
            y1={ORIGIN_Y}
            y2={aEnd.y}
          />
          <line
            className="dot-vector-b"
            markerEnd="url(#dot-arrow-b)"
            x1={ORIGIN_X}
            x2={bEnd.x}
            y1={ORIGIN_Y}
            y2={bEnd.y}
          />

          <g className="lab-drag-handle"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging("a");
            }}
          >
            <circle aria-label={text.vectorA} cx={aEnd.x} cy={aEnd.y} r="9" fill="transparent" stroke="transparent" strokeWidth="36" vectorEffect="non-scaling-stroke" />
            <circle
              aria-label={text.vectorA}
              className="dot-handle-a"
              cx={aEnd.x}
              cy={aEnd.y}
              r="9"
            />
          </g>

          <g className="lab-drag-handle"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging("b");
            }}
          >
            <circle aria-label={text.vectorB} cx={bEnd.x} cy={bEnd.y} r="9" fill="transparent" stroke="transparent" strokeWidth="36" vectorEffect="non-scaling-stroke" />
            <circle
              aria-label={text.vectorB}
              className="dot-handle-b"
              cx={bEnd.x}
              cy={bEnd.y}
              r="9"
            />
          </g>
        </svg>
      </div>

      <div className="dot-controls">
        <p>{text.instruction}</p>

        <div className="dot-vector-values">
          <div>
            <span>{text.vectorA}</span>
            <strong>[{a.x.toFixed(1)}, {a.y.toFixed(1)}]</strong>
          </div>
          <div>
            <span>{text.vectorB}</span>
            <strong>[{b.x.toFixed(1)}, {b.y.toFixed(1)}]</strong>
          </div>
        </div>

        <div className="dot-sliders">
          {(["a", "b"] as const).map((target) =>
            (["x", "y"] as const).map((axis) => (
              <label key={`${target}-${axis}`}>
                <span>{target}.{axis}</span>
                <input
                  aria-label={`${target === "a" ? text.vectorA : text.vectorB} ${axis}`}
                  max="5"
                  min="-5"
                  onChange={(event) => {
                    const next = { ...(target === "a" ? a : b), [axis]: Number(event.target.value) };
                    if (target === "a") setA(next);
                    else setB(next);
                  }}
                  step="0.1"
                  type="range"
                  value={(target === "a" ? a : b)[axis]}
                />
                <output>{(target === "a" ? a : b)[axis].toFixed(1)}</output>
              </label>
            ))
          )}
        </div>

        <dl>
          <div>
            <dt>{text.dot}</dt>
            <dd>{dotValue.toFixed(2)}</dd>
          </div>
          <div>
            <dt>{text.cosine}</dt>
            <dd>{cosine.toFixed(3)}</dd>
          </div>
          <div>
            <dt>{text.angle}</dt>
            <dd>{angle.toFixed(1)}°</dd>
          </div>
          <div>
            <dt>{text.projection}</dt>
            <dd>{projection.toFixed(2)}</dd>
          </div>
        </dl>

        <div className="dot-relationship">{relationship}</div>

        <button
          className="vector-reset"
          onClick={() => {
            setA({ x: 4, y: 1 });
            setB({ x: 2, y: 3 });
          }}
          type="button"
        >
          {text.reset}
        </button>
      </div>
    </div>
  );
}
