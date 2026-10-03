# Foundation

**Foundation** 是一张从第一性原理理解和开发 AI Agent 的开源、可交互知识地图。

它不是框架教程，也不是一本纯线性的书。项目把 Agent Engineering 看成一套彼此连接的知识系统：数学、神经网络、Transformer、LLM 推理、Agent 架构、系统工程、安全与评测。

English is maintained as a first-class secondary language. The product defaults to Chinese.

## Design direction

Foundation 的设计方向被明确拆成三层：

```text
阅读结构      Crafting Interpreters
视觉与交互    Apple design principles
产品能力      Foundation knowledge graph + interactive labs
```

因此：

- Concept 页面是连续的技术章节，而不是卡片式 Dashboard；
- 侧边栏是可适配的辅助阅读系统，不是固定右栏；
- Apple 风格体现在层级、对齐、留白、灰度、克制颜色和渐进披露，而不是表面模仿；
- 知识图谱、前置依赖和交互实验是 Foundation 自己的核心能力。

完整规范见 `docs/design/`。

## Architecture

```text
content/concepts
        |
        v
@foundation/knowledge
   /            \
 Read          Explore
   \            /
      apps/web
        |
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
