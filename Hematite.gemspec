# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "Hematite"
  spec.version       = "0.1.1"
  spec.authors       = ["Henry Heino"]
  spec.email         = ["personalizedrefrigerator@gmail.com"]

  spec.summary       = "A responsive and elegant Jekyll theme."
  spec.homepage      = "https://github.com/personalizedrefrigerator/jekyll-hematite-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_data|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.2"
end
