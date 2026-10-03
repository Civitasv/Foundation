"use client";

import { useMemo, useRef, useState } from "react";
import type { FoundationLocale } from "@foundation/knowledge";

type Matrix2 = { a: number; b: number; c: number; d: number };
type Point = { x: number; y: number };

const WIDTH = 640;
const HEIGHT = 360;
const SCALE = 34;
const ORIGIN_X = WIDTH / 2;
const ORIGIN_Y = HEIGHT / 2;
const GRID_EXTENT = 4;

const labels = {
  "zh-CN": {
    instruction: "拖动两根基向量的端点，或直接调节矩阵四个元素。",
    matrix: "矩阵 A",
    determinant: "det(A)",
    area: "面积缩放",
    example: "[2, 1] 变换后",
    presets: "预设",
    identity: "单位",
    scale: "缩放",
    rotate: "旋转 45°",
    shear: "剪切",
    reflect: "反射",
    reset: "重置"
  },
  en: {
    instruction: "Drag the two basis-vector endpoints, or edit the four matrix entries.",
    matrix: "Matrix A",
    determinant: "det(A)",
    area: "Area scale",
    example: "[2, 1] after transform",
    presets: "Presets",
    identity: "Identity",
    scale: "Scale",
    rotate: "Rotate 45°",
    shear: "Shear",
    reflect: "Reflect",
    reset: "Reset"
  }
} as const;

const IDENTITY: Matrix2 = { a: 1, b: 0, c: 0, d: 1 };

function clamp(value: number): number {
  return Math.max(-2, Math.min(2, value));
}

function transform(matrix: Matrix2, point: Point): Point {
  return {
    x: matrix.a * point.x + matrix.b * point.y,
    y: matrix.c * point.x + matrix.d * point.y
  };
}

function screen(point: Point): Point {
  return {
    x: ORIGIN_X + point.x * SCALE,
    y: ORIGIN_Y - point.y * SCALE
  };
}

function format(value: number): string {
  const rounded = Math.abs(value) < 0.0005 ? 0 : value;
  return rounded.toFixed(2);
}

export function MatrixTransformPlayground({
  locale
}: Readonly<{ locale: FoundationLocale }>) {
  const [matrix, setMatrix] = useState<Matrix2>(IDENTITY);
  const [dragging, setDragging] = useState<"e1" | "e2" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const text = labels[locale];

  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  const example = useMemo(() => transform(matrix, { x: 2, y: 1 }), [matrix]);
  const e1 = screen({ x: matrix.a, y: matrix.c });
  const e2 = screen({ x: matrix.b, y: matrix.d });

  function updateFromPointer(target: "e1" | "e2", clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const localX = ((clientX - rect.left) / rect.width) * WIDTH;
    const localY = ((clientY - rect.top) / rect.height) * HEIGHT;
    const x = Math.round(clamp((localX - ORIGIN_X) / SCALE) * 10) / 10;
    const y = Math.round(clamp((ORIGIN_Y - localY) / SCALE) * 10) / 10;

    setMatrix((current) =>
      target === "e1"
        ? { ...current, a: x, c: y }
        : { ...current, b: x, d: y }
    );
  }

  function setEntry(key: keyof Matrix2, value: number) {
    setMatrix((current) => ({ ...current, [key]: value }));
  }

  const gridLines = Array.from({ length: GRID_EXTENT * 2 + 1 }, (_, index) => index - GRID_EXTENT);

  return (
    <div className="matrix-playground">
      <div className="matrix-stage">
        <svg
          aria-label={text.instruction}
          onPointerMove={(event) => {
            if (dragging) updateFromPointer(dragging, event.clientX, event.clientY);
          }}
          onPointerUp={() => setDragging(null)}
          onPointerCancel={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
          ref={svgRef}
          role="img"
          viewBox="0 0 640 360"
        >
          {gridLines.map((value) => {
            const originalVerticalA = screen({ x: value, y: -GRID_EXTENT });
            const originalVerticalB = screen({ x: value, y: GRID_EXTENT });
            const originalHorizontalA = screen({ x: -GRID_EXTENT, y: value });
            const originalHorizontalB = screen({ x: GRID_EXTENT, y: value });
            const verticalA = screen(transform(matrix, { x: value, y: -GRID_EXTENT }));
            const verticalB = screen(transform(matrix, { x: value, y: GRID_EXTENT }));
            const horizontalA = screen(transform(matrix, { x: -GRID_EXTENT, y: value }));
            const horizontalB = screen(transform(matrix, { x: GRID_EXTENT, y: value }));

            return (
              <g key={value}>
                <line className="matrix-grid-original" x1={originalVerticalA.x} x2={originalVerticalB.x} y1={originalVerticalA.y} y2={originalVerticalB.y} />
                <line className="matrix-grid-original" x1={originalHorizontalA.x} x2={originalHorizontalB.x} y1={originalHorizontalA.y} y2={originalHorizontalB.y} />
                <line className="matrix-grid-transformed" x1={verticalA.x} x2={verticalB.x} y1={verticalA.y} y2={verticalB.y} />
                <line className="matrix-grid-transformed" x1={horizontalA.x} x2={horizontalB.x} y1={horizontalA.y} y2={horizontalB.y} />
              </g>
            );
          })}

          <line className="matrix-basis-e1" x1={ORIGIN_X} x2={e1.x} y1={ORIGIN_Y} y2={e1.y} />
          <line className="matrix-basis-e2" x1={ORIGIN_X} x2={e2.x} y1={ORIGIN_Y} y2={e2.y} />

          <circle
            aria-label={locale === "zh-CN" ? "第一基向量端点" : "First basis vector endpoint"}
            className="matrix-handle-e1"
            cx={e1.x}
            cy={e1.y}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging("e1");
            }}
            r="9"
          />
          <circle
            aria-label={locale === "zh-CN" ? "第二基向量端点" : "Second basis vector endpoint"}
            className="matrix-handle-e2"
            cx={e2.x}
            cy={e2.y}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging("e2");
            }}
            r="9"
          />
        </svg>
      </div>

      <div className="matrix-controls">
        <p>{text.instruction}</p>
        <div className="matrix-display" aria-label={text.matrix}>
          <span>[</span>
          <div>
            <strong>{format(matrix.a)}</strong>
            <strong>{format(matrix.b)}</strong>
            <strong>{format(matrix.c)}</strong>
            <strong>{format(matrix.d)}</strong>
          </div>
          <span>]</span>
        </div>

        <div className="matrix-sliders">
          {(["a", "b", "c", "d"] as const).map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input
                max="2"
                min="-2"
                onChange={(event) => setEntry(key, Number(event.target.value))}
                step="0.1"
                type="range"
                value={matrix[key]}
              />
              <output>{matrix[key].toFixed(1)}</output>
            </label>
          ))}
        </div>

        <dl className="matrix-facts">
          <div><dt>{text.determinant}</dt><dd>{format(determinant)}</dd></div>
          <div><dt>{text.area}</dt><dd>{format(Math.abs(determinant))}×</dd></div>
          <div className="matrix-example"><dt>{text.example}</dt><dd>[{format(example.x)}, {format(example.y)}]</dd></div>
        </dl>

        <div className="matrix-presets">
          <span>{text.presets}</span>
          <button type="button" onClick={() => setMatrix(IDENTITY)}>{text.identity}</button>
          <button type="button" onClick={() => setMatrix({ a: 1.5, b: 0, c: 0, d: 0.7 })}>{text.scale}</button>
          <button type="button" onClick={() => { const r = Math.SQRT1_2; setMatrix({ a: r, b: -r, c: r, d: r }); }}>{text.rotate}</button>
          <button type="button" onClick={() => setMatrix({ a: 1, b: 1, c: 0, d: 1 })}>{text.shear}</button>
          <button type="button" onClick={() => setMatrix({ a: -1, b: 0, c: 0, d: 1 })}>{text.reflect}</button>
        </div>

        <button className="vector-reset" type="button" onClick={() => setMatrix(IDENTITY)}>{text.reset}</button>
      </div>
    </div>
  );
}
