---
title: Quick Setup
layout: default
katex: true
lang: en
sidebarindex: 2
---

# Quick Setup
## 0. If you don't have a Jekyll site set up...
...please read the [Jekyll Quickstart guide](https://jekyllrb.com/docs/)
to create a near-empty site!

## 1. Modify Config Files
Add this line to your Jekyll site's Gemfile:
```Gemfile
gem "hematite"
```

If you're replacing an old theme with Hematite,
you may have a line with `gem "old-theme-name"`
in your `Gemfile`. Consider removing it.

Next, add this line to your Jekyll site's `_config.yml`:
```yml
theme: hematite
```
If you already have a `theme: themename` line, replace it
with `theme: hematite`.

## 2. Install dependencies

Run
```
$ bundle install
```
in the directory containing your theme to install all
dependencies in the `Gemspec`, including `hematite`.

You can also install **just** the theme:
```
$ gem install hematite
```

## 3. Add Content!
To-do!
