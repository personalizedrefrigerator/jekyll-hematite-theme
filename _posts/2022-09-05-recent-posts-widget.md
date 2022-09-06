---
title: Recent Posts Widget
layout: post
tags:
 - documentation
---

With version 0.1.16 of the Hematite theme comes a “recent posts” widget. Writing
```markdown
# Recent posts

{% raw %}{% include recent_posts.html %}{% endraw %}
```
renders as
<div class='boxed force-show-on-print'>
    {% include recent_posts.html %}
    <style>
        /* Override the default hide-on-print rule. */
        @media print {
            .recent-posts {
                display: flex;
                max-height: 200px;
            }
        }
    </style>
</div>

# Showing a different number of recent posts

To limit the number of recent posts to two,
```liquid
{% raw %}
{% assign recent_post_limit = 2 %}
{% include recent_posts.html %}
{% endraw %}
```
