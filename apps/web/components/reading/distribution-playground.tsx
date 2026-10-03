"use client";

import { useMemo, useState } from "react";
import type { FoundationLocale } from "@foundation/knowledge";

const OUTCOMES = [0, 1, 2, 3] as const;

const labels = {
  "zh-CN": {
    instruction: "调节四个原始权重。它们会自动归一化成概率分布。",
    rawWeight: "原始权重",
    probability: "概率",
    sum: "概率和",
    expectation: "期望 E[X]",
    entropy: "熵 H(X)",
    sampled: "最近一次采样",
    sampleOnce: "采样一次",
    presets: "预设",
    uniform: "均匀",
    certain: "确定",
    skewed: "偏斜",
    bimodal: "双峰",
    reset: "重置",
    bits: "bits",
    outcome: "结果"
  },
  en: {
    instruction: "Adjust four raw weights. They are normalized automatically into a probability distribution.",
    rawWeight: "Raw weight",
    probability: "Probability",
    sum: "Probability sum",
    expectation: "Expectation E[X]",
    entropy: "Entropy H(X)",
    sampled: "Latest sample",
    sampleOnce: "Sample once",
    presets: "Presets",
    uniform: "Uniform",
    certain: "Certain",
    skewed: "Skewed",
    bimodal: "Bimodal",
    reset: "Reset",
    bits: "bits",
    outcome: "Outcome"
  }
} as const;

function normalize(weights: number[]): number[] {
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return weights.map(() => 1 / weights.length);
  return weights.map((value) => value / total);
}

function entropy(probabilities: number[]): number {
  return probabilities.reduce((sum, probability) => {
    if (probability <= 0) return sum;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function sample(probabilities: number[]): number {
  const target = Math.random();
  let cumulative = 0;

  for (let index = 0; index < probabilities.length; index += 1) {
    cumulative += probabilities[index] ?? 0;
    if (target <= cumulative) return index;
  }

  return probabilities.length - 1;
}

export function DistributionPlayground({
  locale
}: Readonly<{ locale: FoundationLocale }>) {
  const [weights, setWeights] = useState([5, 3, 1, 1]);
  const [lastSample, setLastSample] = useState<number | null>(null);
  const text = labels[locale];

  const probabilities = useMemo(() => normalize(weights), [weights]);
  const probabilitySum = probabilities.reduce((sum, value) => sum + value, 0);
  const expectedValue = probabilities.reduce(
    (sum, probability, index) => sum + probability * (OUTCOMES[index] ?? 0),
    0
  );
  const entropyBits = entropy(probabilities);

  function updateWeight(index: number, value: number) {
    setWeights((current) =>
      current.map((weight, currentIndex) => currentIndex === index ? value : weight)
    );
  }

  function setPreset(next: number[]) {
    setWeights(next);
    setLastSample(null);
  }

  return (
    <div className="distribution-playground">
      <div className="distribution-chart" aria-label={text.instruction}>
        {OUTCOMES.map((outcome, index) => {
          const probability = probabilities[index] ?? 0;
          return (
            <div className="distribution-column" key={outcome}>
              <div className="distribution-bar-area">
                <div
                  className="distribution-bar"
                  style={{ height: `${Math.max(2, probability * 100)}%` }}
                >
                  <span>{(probability * 100).toFixed(1)}%</span>
                </div>
              </div>
              <strong>{text.outcome} {outcome}</strong>
            </div>
          );
        })}
      </div>

      <div className="distribution-controls">
        <p>{text.instruction}</p>

        <div className="distribution-sliders">
          {weights.map((weight, index) => (
            <label key={OUTCOMES[index]}>
              <span>{text.rawWeight} {OUTCOMES[index]}</span>
              <input
                max="10"
                min="0"
                onChange={(event) => updateWeight(index, Number(event.target.value))}
                step="0.1"
                type="range"
                value={weight}
              />
              <output>{weight.toFixed(1)}</output>
            </label>
          ))}
        </div>

        <dl className="distribution-facts">
          <div><dt>{text.sum}</dt><dd>{probabilitySum.toFixed(3)}</dd></div>
          <div><dt>{text.expectation}</dt><dd>{expectedValue.toFixed(3)}</dd></div>
          <div><dt>{text.entropy}</dt><dd>{entropyBits.toFixed(3)} {text.bits}</dd></div>
          <div><dt>{text.sampled}</dt><dd>{lastSample === null ? "—" : lastSample}</dd></div>
        </dl>

        <button
          className="distribution-sample"
          onClick={() => setLastSample(OUTCOMES[sample(probabilities)] ?? 0)}
          type="button"
        >
          {text.sampleOnce}
        </button>

        <div className="distribution-presets">
          <span>{text.presets}</span>
          <button type="button" onClick={() => setPreset([1, 1, 1, 1])}>{text.uniform}</button>
          <button type="button" onClick={() => setPreset([10, 0, 0, 0])}>{text.certain}</button>
          <button type="button" onClick={() => setPreset([7, 2, 1, 0])}>{text.skewed}</button>
          <button type="button" onClick={() => setPreset([5, 0, 0, 5])}>{text.bimodal}</button>
        </div>

        <button className="vector-reset" type="button" onClick={() => setPreset([5, 3, 1, 1])}>{text.reset}</button>
      </div>
    </div>
  );
}