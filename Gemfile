source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.2", ">= 8.0.2.1"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use mysql as the database for Active Record
gem "mysql2", "~> 0.5"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "jsbundling-rails"
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Bootstrap framework for styling [https://getbootstrap.com]
gem "bootstrap", "~> 5.3.0"

# jQuery for Bootstrap's JavaScript plugins [https://jquery.com]
gem "jquery-rails", "~> 4.4"

# Use Sass to process CSS [https://sass-lang.com/documentation/rails]
gem "sassc-rails", "~> 2.1"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false

  # Use RSpec for tests [https://rspec.info/]
  gem "rspec-rails", "~> 7.0"

  # Use Factory Bot for fixtures replacement [https://github.com/factory-bot/factory_bot_rails]
  gem "factory_bot_rails", "~> 6.0"

  # https://github.com/faker-ruby/faker
  gem "faker", "~> 3.0"

  # Use byebug for debugging [https://github.com/bbatsov/byebug]
  gem "byebug", "~> 12.0", platforms: [ :mri ]

  # Support for controller/view specs in RSpec [https://github.com/rails/rails-controller-testing]
  gem "rails-controller-testing", "~> 1.0"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"

  # Ruby LSP for VS Code integration
  gem "ruby-lsp", require: false

  # Ruby LSP addon for RSpec
  gem "ruby-lsp-rspec", "~> 0.1.28", require: false
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "listen", "~> 3.3"

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  # Use RuboCop for code style checking [https://rubocop.org]
  gem "rubocop", require: false

  # Additional RuboCop rules for Rails [https://github.com/rails/rubocop-rails]
  gem "rubocop-rails", require: false
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara", "~> 3.0"
  gem "selenium-webdriver", "~> 4.0"
  gem "webdrivers"

  # Code coverage reporting [https://github.com/simplecov-ruby/simplecov]
  gem "simplecov", require: false
  # Simplifies the use of shoulda matchers with RSpec and Minitest [https://github.com/shoulda/shoulda-matchers]
  gem "shoulda-matchers", "~> 5.0"
end
