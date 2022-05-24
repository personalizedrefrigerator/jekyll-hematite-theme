---
---
<!-- Using a .html.resource file to prevent Jekyll from changing the extension -->

<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang | default: "en-US" }}">
    <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <meta charset="utf-8"/>
        <!-- Content of remark presentation iframe. Based on https://github.com/gnab/remark/wiki#getting-started -->
        <style>
/* Stylesheet mostly taken from https://github.com/gnab/remark/wiki#getting-started */
@import url(https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz);
@import url(https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic);
@import url(https://fonts.googleapis.com/css?family=Ubuntu+Mono:400,700,400italic);

body { font-family: 'Droid Serif'; }
h1, h2, h3 {
    font-family: 'Yanone Kaffeesatz';
    font-weight: normal;
}

.remark-code, .remark-inline-code { font-family: 'Ubuntu Mono'; }

/* Show hidden slides to allow preprocessors (e.g. mermaid) to
   properly account for container size.
   */
.remark-slide-container:not(.remark-visible) {
    display: block;
    box-shadow: none;
    z-index: -999;
    visibility: hidden;
}

nav {
    position: absolute;
    z-index: 10000;
    bottom: 0;
    left: 0;
    opacity: 0.8;
}

nav:hover, nav:focus-within {
    opacity: 1;
}

@media print {
    nav {
        display: none;
    }
}

        </style>
    </head>
    <body>
    </body>
    <script src="{{ 'assets/plugin/remark_presenter/remark.min.js' | relative_url }}"></script>
</html>
