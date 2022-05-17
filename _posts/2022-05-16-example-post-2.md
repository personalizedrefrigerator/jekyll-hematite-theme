---
layout: post
title: "Example post 2"
tags:
    - test
    - documentation
---

Pages can now be excluded from *internal* search indexing! To do this, add `noindex: true` to the header of a page. Any value of `noindex` that is not `nil` will prevent a page from being indexed.

Note that this won't prevent search engines from indexing the page, just Hematite's internal search engine.

This post, for example, starts with
```
---
layout: post
title: "Example post 2"
tags:
    - test
    - documentation
---
```
To prevent it from showing up in internal search results, I might change it to
```
---
layout: post
title: "Example post 2"
noindex: true
tags:
    - test
    - documentation
---
```
