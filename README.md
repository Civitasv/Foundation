# Foundation

**Foundation** 是一张从第一性原理理解和开发 AI Agent 的开源、可交互知识地图。

它不是框架教程，也不是一本线性的书。项目把 Agent Engineering 看成一套彼此连接的知识系统：数学、神经网络、Transformer、LLM 推理、Agent 架构、系统工程、安全与评测。

English is maintained as a first-class secondary language. The product defaults to Chinese.

## Product idea

Foundation 有三种互补的学习方式：

- **Learn / 学习** — 根据前置知识生成学习路径。
- **Explore / 探索** — 在知识图谱中自由移动。
- **Build / 动手** — 用可视化、模拟器和实验把抽象概念变成可操作的机制。

## Architecture

```text
content/concepts/*
        |
        v
bilingual concept metadata + lessons
        |
        v
@foundation/knowledge
        |
        v
apps/web
        |
        v
GitHub Pages
```

## Development

```bash
pnpm install
pnpm dev
pnpm check
```

Create a bilingual concept seed:

```bash
pnpm concept:new -- vector-space "向量空间" "Vector Space" foundations
```

## Website

```text
https://civitasv.github.io/Foundation/
```

## License

MIT.
