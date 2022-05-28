---
layout: post
title: Testing Table Styles
katex: true
tags:
    - test
---

<table>
<thead><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></thead>
<tbody>
  <tr>
    <td>Testing...</td>
    <td>
    <pre>
# This is a test, this function is being used to fill space.
def foo():
    pass
    </pre>
    </td>
    <td>;;;;</td>
  <td markdown=1>
 $$f^{(n)}(z) = \frac{n!}{2πi}\oint_{|z-z_0|=\rho} \frac{f(w)}{(w-z)^{n+1}} dw$$
  </td>
    <td>...</td>
  </tr>
  <tr><td>Testing...</td><td>Testing...</td><td>;;;</td><td>;;;</td><td>;;;</td></tr>
</tbody>
</table>

$$
    f(z) = \oint_{\left|z-z_0\right|=\rho} \frac{f(w)}{w-z} dw - \oint_{\left|z-z_0\right|=\sigma} \frac{f(w)}{w - z} dw
$$
