---
layout: post
title: Configuring User-Configurable Settings
tags:
 - documentation
---

The Hematite theme comes with a user-configurable settings page. Settings are stored using [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

<details markdown=1><summary>The settings GUI looks like this</summary>
```md
<!--
    Include the settings GUI in a page with the following Liquid include:
-->
{% raw %}{% include settings.html %}{% endraw %}
```
{% include settings.html %}
</details>

## Disabling them
The user-configurable settings page (enabled by default) can be disabled by adding the following to `_config.yml`:
```yaml
hematite:
  # ...

  sidebar:
    # ...
    show_settings_btn: false
```

You can see what settings are available [on this site's settings page]({{ "assets/html/settings" | relative_url }}).

## Adding custom settings
{% raw %}
If you have your own settings, create your own `assets/html/settings.html` to override the default settings page. You can then `{% include settings.html %}` to include the settings widgets that come with the Hematite theme.

The default settings page, for example, looks similar to this:
```html
---
layout: default
title: Settings
noindex: true
---

<!-- in assets/html/settings.html -->

<h1 id="settings_header">page_settings_header</h1>
<p id="settings_description">page_settings_description</p>

{% include settings.html %}
```

## Setting settings' default values
Change the default values of many of the settings in `_config.yml`!
```yaml
hematite:
    # ... Other settings ...

    user_config:
        # The font associated with the "small"
        # font size option, in pt.
        font_size_small: 9
        font_size_medium: 13
        font_size_large: 16

        # Whether to show/hide the sticky header by default
        minimize_header: false
```

Currently, the default font family must be changed with CSS. For example, if your site's `assets/style.scss` looks like this:
```scss
---
title: false
styles: true
---

@import "hematite";

// In dark mode, invert the brightness of images
@include auto-invert-images;
```
The default font families can then be customized by adding this to the end of `style.scss`:
```scss
:root {
    --serif-font-family: 'Times New Roman', 'Font of your choice', serif;
    --sans-font-family: 'URW Gothic, Book', 'Font of your choice', sans-serif;
    --main-font-family: var(--serif-font-family);
    // or
    // --main-font-family: var(--sans-font-family);
    // to default to a sans font.
}
```

{% endraw %}
