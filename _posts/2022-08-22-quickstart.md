---
title: Quick Setup — GitHub Pages
layout: post
tags:
 - documentation
---

For more general quickstart instructions, see [the Quickstart guide]({{ "example/quick_setup" | relative_url }}).

# Steps

1. Follow the instructions on [jekyllrb.com](https://jekyllrb.com/docs/) to create a new static site.
2. Open `Gemfile` in your new site and comment out the lines similar to
    ```ruby
    gem "minima", "~> 2.5"
    ```
    and
    ```ruby
    gem "jekyll", "~> 4.2.2"
    ```
3. Uncomment the line
    ```ruby
    gem "github-pages", group: :jekyll_plugins
    ```
3. Open `_config.yml` and replace `theme: minima` with `remote_theme:  personalizedrefrigerator/jekyll-hematite-theme`.
4. Save `Gemfile` and run `bundle install` in the directory containing your site to install the the `github-pages` gem.
  - If you have trouble with this, try deleting `Gemfile.lock` and running `bundle install` again.
5. Run `bundle exec jekyll serve` to start testing the site!


At this point, your `Gemfile` might look similar to this:
```ruby
source "https://rubygems.org"
# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
# gem "jekyll", "~> 4.2.2"
# This is the default theme for new Jekyll sites. You may change this to anything you like.
# gem "hematite", "~> 0.1.15"
# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
gem "github-pages", group: :jekyll_plugins
# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

gem "webrick", "~> 1.7"
```

and your `_config.yml`:

```yml
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely edit after that. If you find
# yourself editing this file very often, consider using Jekyll's data files
# feature for the data you need to update frequently.
#
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'bundle exec jekyll serve'. If you change this file, please restart the server process.
#
# If you need help with YAML syntax, here are some quick references for you: 
# https://learn-the-web.algonquindesign.ca/topics/markdown-yaml-cheat-sheet/#yaml
# https://learnxinyminutes.com/docs/yaml/
#
# Site settings
# These are used to personalize your new site. If you look in the HTML files,
# you will see them accessed via {{ site.title }}, {{ site.email }}, and so on.
# You can create any custom variable you would like, and they will be accessible
# in the templates via {{ site.myvariable }}.

title: Your awesome title
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.
baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username:  jekyll

# Build settings
# theme: hematite
plugins:
  - jekyll-feed

# Uncomment if publishing to GitHub pages
remote_theme: personalizedrefrigerator/jekyll-hematite-theme

...
```

# Customization

GitHub pages might not apply the Hematite theme's default settings. You might, for example, want to configure the sidebar.

At the bottom of your `_config.yml`, add,
```yml
title: A page made with the Hematite Theme
# short_title: Add a shortened version of the title for small screens
description: A Jekyll theme intended for course websites
permalink: pretty

hematite:
  auto_invert_imgs: true

  # Set to true to minimize the header by default
  minimize_header: false

  # Date options are as specified here:
  # https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
  date_format:
    # Short weekday (e.g. Thu for Thursday)
    # weekday: short
    # Long weekday (e.g. Monday)
    weekday: long

    # Use two digits for the month and day
    month: 2-digit
    day: 2-digit

    # The full year
    year: numeric

    parsing:
      # True if the date should be parsed MM/DD/YYYY instead of
      # DD/MM/YYYY
      month_first: true

  sidebar:
    footer_html: 'Add HTML that shows up in the sidebar here!'
    show_settings_btn: true
```

The `parsing` section is used to convert headings to dates for the [calendar layout]({{ "example/calendar" | relative_url }}).

# See also
 * [The GitHub Pages documentation](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll) on using custom themes.
 * [The Jekyll documentation on using GitHub pages](https://jekyllrb.com/docs/github-pages/).

