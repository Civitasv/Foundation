"use client";

import { useMemo, useRef, useState } from "react";
import type { FoundationLocale } from "@foundation/knowledge";

const labels = {
  "zh-CN": {
    x: "横坐标 x",
    y: "纵坐标 y",
    magnitude: "长度",
    angle: "方向",
    instruction: "拖动蓝色端点，或使用滑块改变向量。",
    reset: "重置"
  },
  en: {
    x: "x coordinate",
    y: "y coordinate",
    magnitude: "Magnitude",
    angle: "Direction",
    instruction: "Drag the blue endpoint, or use the sliders to change the vector.",
    reset: "Reset"
  }
} as const;

const WIDTH = 640;
const HEIGHT = 360;
const SCALE = 30;
const ORIGIN_X = WIDTH / 2;
const ORIGIN_Y = HEIGHT / 2;

function clamp(value: number): number {
  return Math.max(-5, Math.min(5, value));
}

export function VectorPlayground({
  locale
}: Readonly<{ locale: FoundationLocale }>) {
  const [x, setX] = useState(3);
  const [y, setY] = useState(2);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const text = labels[locale];

  const magnitude = useMemo(() => Math.hypot(x, y), [x, y]);
  const angle = useMemo(
    () => (Math.atan2(y, x) * 180) / Math.PI,
    [x, y]
  );

  const endpointX = ORIGIN_X + x * SCALE;
  const endpointY = ORIGIN_Y - y * SCALE;

  function updateFromPointer(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const localX = ((clientX - rect.left) / rect.width) * WIDTH;
    const localY = ((clientY - rect.top) / rect.height) * HEIGHT;

    setX(Math.round(clamp((localX - ORIGIN_X) / SCALE) * 10) / 10);
    setY(Math.round(clamp((ORIGIN_Y - localY) / SCALE) * 10) / 10);
  }

  return (
    <div className="vector-playground">
      <div className="vector-stage">
        <svg
          aria-label={text.instruction}
          onPointerMove={(event) => {
            if (dragging) updateFromPointer(event.clientX, event.clientY);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          ref={svgRef}
          role="img"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        >
          <defs>
            <marker
              id="vector-arrow"
              markerHeight="8"
              markerWidth="8"
              orient="auto-start-reverse"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" />
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
            className="vector-line"
            markerEnd="url(#vector-arrow)"
            x1={ORIGIN_X}
            x2={endpointX}
            y1={ORIGIN_Y}
            y2={endpointY}
          />
          <g className="lab-drag-handle"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
            }}
          >
            <circle aria-label={locale === "zh-CN" ? "向量端点" : "Vector endpoint"} cx={endpointX} cy={endpointY} r="9" fill="transparent" stroke="transparent" strokeWidth="36" vectorEffect="non-scaling-stroke" />
            <circle
              aria-label={locale === "zh-CN" ? "向量端点" : "Vector endpoint"}
              className="vector-handle"
              cx={endpointX}
              cy={endpointY}
              r="9"
            />
          </g>
        </svg>
      </div>

      <div className="vector-controls">
        <p>{text.instruction}</p>

        <label>
          <span>{text.x}</span>
          <input max="5" min="-5" onChange={(event) => setX(Number(event.target.value))} step="0.1" type="range" value={x} />
          <output>{x.toFixed(1)}</output>
        </label>

        <label>
          <span>{text.y}</span>
          <input max="5" min="-5" onChange={(event) => setY(Number(event.target.value))} step="0.1" type="range" value={y} />
          <output>{y.toFixed(1)}</output>
        </label>

        <dl>
          <div><dt>{text.magnitude}</dt><dd>{magnitude.toFixed(2)}</dd></div>
          <div><dt>{text.angle}</dt><dd>{angle.toFixed(1)}°</dd></div>
        </dl>

        <button className="vector-reset" onClick={() => { setX(3); setY(2); }} type="button">
          {text.reset}
        </button>
      </div>
    </div>
  );
}
