source "https://rubygems.org"
  git_source(:github) { |repo| "https://github.com/#{repo}.git" }

  ruby "3.3.9"

  # Rails本体
  gem "rails", "~> 7.0.8"

  # データベース
  gem "mysql2", "~> 0.5"

  # アセット・フロントエンド
  gem "sprockets-rails"
  gem "importmap-rails"
  gem "turbo-rails"
  gem "stimulus-rails"
  gem "cssbundling-rails"
  gem "jsbundling-rails"

  # その他の基本gem
  gem "image_processing", "~> 1.2"
  gem "bootsnap", require: false

  group :development, :test do
    # テスト関連
    gem "rspec-rails"
    gem "factory_bot_rails"
    gem "faker"
    # デバッグ
    gem "debug", platforms: %i[ mri ]
    gem "pry-rails"
  end

  group :development do
    # 開発効率化
    gem "web-console"
    gem "listen"
    gem "spring"

    # コード品質
    gem "rubocop-rails", require: false
    gem "rubocop-rspec", require: false
    gem "brakeman", require: false

    # LSP・フォーマッター
    gem "ruby-lsp", require: false
    gem "syntax_tree", require: false
  end
