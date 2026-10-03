# Concept Page Template

This is an authoring structure, not final MDX runtime syntax.

Not every concept must use every section.

## Canonical Chinese outline

```md
# 中文标题
English Title

一句话 summary，说明这个概念解决什么问题。

[可选 epigraph / opening example]

## 为什么需要它

连续正文。

[可选 aside: prerequisite / context / definition]

## 直觉

先形成可以操作的心智模型，再进入公式。

[figure / diagram]

## 机制与数学

必要的定义、公式和推导。

[equation]
[可选 aside: notation / derivation]

## 交互实验

实验目标是什么？
用户改变什么？
应该观察什么？

[interactive lab]

## 最小实现

把概念落成最小代码或伪代码。

[precise code step]

## 与 Agent 的关系

明确连接到 context、memory、tools、planning、runtime、
evaluation、security 等 Agent 系统问题。

## 参考资料

- primary source
- official docs
- deeper reading

[Previous concept]                      [Next concept]
```

## English outline

The English lesson should preserve the same conceptual structure and learning goal.

Do not mechanically translate Chinese sentence order when idiomatic English can explain the same idea more clearly.

## Opening rules

A chapter opening should answer, quickly:

- What is this?
- Why should I care?
- What should I already know?
- What will I be able to explain or build after reading?

Do not put all four answers into a metadata dashboard.

Use editorial prose and contextual side material.

## Section rules

A section should have one conceptual job.

If a section contains several unrelated ideas, split it.

If a section is only one decorative sentence beneath a heading, merge it into the surrounding flow.

## Sidebar rules

Sidebars are anchored to the part of the chapter they support.

Do not accumulate all asides in a permanent right-hand metadata column.

Different semantic asides may use different presentations.

See `sidebar-system.md`.

## Completion rules

A concept is not "complete" merely because prose exists.

A deep concept should eventually include:

- correct prerequisite edges;
- a coherent Chinese lesson;
- an equivalent English lesson;
- at least one concrete model, implementation, or experiment;
- Agent relevance;
- references;
- validation in CI.
