# Hematite

![The dark variant of the Hematite Theme, showing a calendar](./screenshot.png)

A work-in-progress theme intended to be used for course websites.

## Installation

Add this line to your Jekyll site's `Gemfile`:

```ruby
gem "hematite"
```

And add this line to your Jekyll site's `_config.yml`:

```yaml
theme: hematite
```


And then execute:

    $ bundle

Or install it yourself as:

    $ gem install hematite



## Usage

Further documentation for this is coming! For now, [minimal documentation](https://personalizedrefrigerator.github.io/jekyll-hematite-theme/) can be found on the theme's homepage.

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/personalizedrefrigerator/jekyll-hematite-theme). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

```md
TODO: Update this. This is still the default set of instructions.
```

To set up your environment to develop this theme, run `bundle install`.

Your theme is setup just like a normal Jekyll site! To test your theme, run `bundle exec jekyll serve` and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme. Add pages, documents, data, etc. like normal to test your theme's contents. As you make modifications to your theme and to your content, your site will regenerate and you should see the changes in the browser after a refresh, just like normal.

When your theme is released, only the files in `_layouts`, `_includes`, `_sass` and `assets` tracked with Git will be bundled.
To add a custom directory to your theme-gem, please edit the regexp in `Hematite.gemspec` accordingly.

**Note:** All user-facing strings in JavaScript should go in `assets/js/string_data.mjs` to permit future localization.

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

