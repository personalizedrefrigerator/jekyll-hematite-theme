---
layout: post
title: "Remark and Mermaid"
mermaid: true
katex: true
---

The upcoming release of Hematite comes with [Mermaid-js](https://mermaid-js.github.io/mermaid/) bundled!

To enable it (like $$\KaTeX$$), add `mermaid: true` to your frontmatter. For example, on this page,
```yaml
---
layout: post
title: "Remark and Mermaid"
mermaid: true
katex: true
---
```

Mermaid allows diagram creation. For example,
```html
<!-- Creates a flowchart from left to right -->
<div class="mermaid">
flowchart LR
    id1[Item 1]
    id2[Another item]

    id1 -- Label --> id2
</div>
```

renders as
<div class="mermaid">
flowchart LR
    id1[Item 1]
    id2[Another item]

    id1 -- Label --> id2
</div>

See [this demo for an example of Remark slides]({{ 'example/remark-demo' | relative_url }}).

