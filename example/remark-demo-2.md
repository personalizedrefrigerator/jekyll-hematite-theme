---
layout: example_custom_remark_slideshow
title: Example slideshow (2)
---

<div markdown=0>

class: center, middle

# Remark and slides

 * Currently, remarkjs presentation source files must be wrapped in
`&lt;div markdown=0&gt;...&lt;/div&gt;` to prevent Jekyll's default markdown parser
from converting them to HTML.

 * Alternatively, use a `.html` extension.

---

# This is an example

```md
---
layout: remark_slideshow
katex: true
mermaid: true
additional_import_html: >-
    Additional imports (for both the main page and the
    slides) go here.

remark_presentation_config_html: >-
    Additional HTML for configuring/styling the iframe that
    contains the remark slides!
---

&lt;div markdown=0&gt;

class: center, middle

A slide!

<i class="test" id="text123">Some text!</i>

---

Another slide!

&lt;/div&gt;
```

---

# A test of Liquid variables

`{% raw %}{{ site.title }}{% endraw %}` renders as {{ site.title }}.

---

# This is another slide

With math: \\(f^{(n)}(z) = \frac{n!}{2πi} \oint_γ \frac{f(w)}{(w - z)^{n + 1}} dw\\)!

---

Highlighted text:
```js
function foo() {
    while (true) {
        break;
    }

    console.log("Testing...");
    document.body.innerHTML += `1` - 3;
    // A comment
    /* Another comment */
}
```

???

And some notes!

---

1. Foo
2. Bar
3. Baz

---

<div class="mermaid">
flowchart LR
    id1[Item 1]
    id2[Another item]

    id1 -- Label --> id2
</div>

</div>
