import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./reading.css";

export const metadata: Metadata = {
  title: "Foundation — 从第一性原理理解 Agent",
  description:
    "从基础概念到 Agent 工程的交互式章节：数学、Transformer 与 LLM、工具调用、运行时、安全与评测。"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "light",
  themeColor: "#ffffff"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
