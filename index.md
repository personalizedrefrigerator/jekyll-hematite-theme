---
title: Hematite Theme
layout: default
katex: true
lang: en
---

# The Hematite Theme

This [Jekyll](https://jekyllrb.com/docs/) theme is very much a work in progress.

<aside class="warning" markdown=1>
### Warning!
This theme is currently
[under development on GitHub](https://github.com/personalizedrefrigerator/jekyll-hematite-theme) and
not production-ready.

The `calendar` layout below, for example, is not yet implemented.
</aside>

# Features
## Syntax Highlighting

Hematite uses [Rogue](https://github.com/rouge-ruby/rouge) for syntax highlighting and
has [its own rogue theme](https://github.com/personalizedrefrigerator/jekyll-hematite-theme/blob/main/_sass/_rogue.scss). For example,

<details markdown=1><summary>Python Example</summary>
```py
def my_function():
    if 1 == 2:
        assert False
    else:
        variable = 123.4 + 1 / 2

        # Now print something!
        print("This is Python")

if __name__ == "__main__":
    import sys
    my_function()
    sys.exit(1)
```
</details>

<details markdown=1><summary>HTML Example</summary>
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Test...</title>
        <script>
            if (true || 1 || false) {
                alert(`Testing...`);
            }
            // JS Comment 1
            /* JS comment 2 */
        </script>

        <style>
            :root {
                color: red;
            }
        </style>

        <!-- An HTML comment -->
    </head>
    <body>
        <h1>Header</h1>
        <p>Paragraph</p>
    </body>
</html>
```
</details>
<details markdown=1><summary>Java Example</summary>
```java
package foo.bar;

public class Foo {
    public static void main(String[] args) {
        System.out.println("Hmm...");
    }
}
```
</details>


## Calendar Layout
Select the `calendar` layout to display a visual calendar. [Calendar layout example](example/calendar).

## Math
By including `katex: true` in a site's header, $$\KaTeX$$ can be loaded.

Write math by wrapping expressions in `$$`. For example,

```tex
### $$\KaTeX$$ example
$$\text{This}\qquad$$ is an example of $$\KaTeX$$ usage.

\\[
    f^{(n)}\left(z\right) = \frac{n!}{2\pi i} \oint_\gamma \frac{f(w)}{\left(w - z\right)^{n + 1}} dw
\\]
```

renders as
<details markdown=1><summary>Result</summary>
### $$\KaTeX$$ example
$$\text{This}\qquad$$ is an example of $$\KaTeX$$ usage.

\\[
    f^{(n)}\left(z\right) = \frac{n!}{2\pi i} \oint_\gamma \frac{f(w)}{\left(w - z\right)^{n + 1}} dw
\\]
</details>

