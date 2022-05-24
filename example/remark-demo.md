---
layout: remark_slideshow
title: Example slideshow
katex: true
mermaid: true
additional_import_html: >-
    <script>
        console.log("Additional scripts can be added via the additional_scripts header");
    </script>
---

class: center, middle

# This is an example

Testing...

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
