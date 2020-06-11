MRuby::Gem::Specification.new('docker') do |spec|
  spec.license = 'MIT'
  spec.authors = 'Fumiaki MATSUSHIMA'
  spec.version = '0.0.1'

  spec.add_dependency 'mruby-fast-remote-check', mgem: 'mruby-fast-remote-check'
end
