import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundation — 从第一性原理理解 Agent",
  description:
    "一张可交互的 Agent 工程知识地图：从数学、Transformer 与 LLM，到工具调用、运行时、安全与评测。"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
