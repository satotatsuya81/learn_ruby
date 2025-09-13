# Business Card Manager - 開発ガイド

## 🏗️ 開発プロセス

### 開発フロー

```mermaid
graph LR
    A[要件定義] --> B[設計]
    B --> C[実装]
    C --> D[テスト]
    D --> E[レビュー]
    E --> F[デプロイ]
    F --> G[監視]
    G --> A
```

### 開発原則

#### 1. テスト駆動開発（TDD）
```ruby
# 1. テストを先に書く
RSpec.describe BusinessCard do
  it "validates presence of name" do
    card = BusinessCard.new(company: "Test Corp")
    expect(card).not_to be_valid
    expect(card.errors[:name]).to include("can't be blank")
  end
end

# 2. 最小限の実装でテストを通す
class BusinessCard < ApplicationRecord
  validates :name, presence: true
end

# 3. リファクタリング
class BusinessCard < ApplicationRecord
  validates :name, presence: true, length: { maximum: 100 }
  validates :company, presence: true, length: { maximum: 200 }
end
```

#### 2. 段階的実装
- **小さな単位**: 1つの機能を複数のタスクに分割
- **継続的統合**: 各タスク完了後にmainブランチにマージ
- **早期フィードバック**: 動作する最小限の機能から開始

#### 3. Rails Way準拠
- **Convention over Configuration**: Rails規約に従った実装
- **RESTful設計**: リソース指向のURL設計
- **ActiveRecord活用**: ORMの機能を最大限活用

## 🐳 開発環境アーキテクチャ

### devcontainer構成

```yaml
# .devcontainer/docker-compose.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ../..:/workspaces:cached
    command: sleep infinity
    environment:
      - RUBY_YJIT_ENABLE=1  # YJIT有効化
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: business_card_manager_development
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

### Dockerfile設定

```dockerfile
FROM ruby:3.3-slim

# YJIT有効化
ENV RUBY_YJIT_ENABLE=1

# 必要なパッケージのインストール
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    default-mysql-client \
    libmysqlclient-dev \
    nodejs \
    npm \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ設定
WORKDIR /workspaces/business-card-manager

# Gemfile コピーと bundle install
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Node.js パッケージのインストール
COPY package.json package-lock.json ./
RUN npm install

# アプリケーションコードのコピー
COPY . .

# ポート公開
EXPOSE 3000

# 起動コマンド
CMD ["rails", "server", "-b", "0.0.0.0"]
```

## 🏛️ アーキテクチャ詳細

### MVC + Services アーキテクチャ

```
app/
├── controllers/           # HTTP リクエスト処理
│   ├── application_controller.rb
│   ├── business_cards_controller.rb
│   ├── users_controller.rb
│   └── api/
│       └── v1/
│           ├── base_controller.rb
│           └── business_cards_controller.rb
├── models/               # データモデル・ビジネスロジック
│   ├── application_record.rb
│   ├── user.rb
│   ├── business_card.rb
│   └── tag.rb
├── views/                # プレゼンテーション層
│   ├── layouts/
│   ├── business_cards/
│   └── shared/
├── services/             # 複雑なビジネスロジック
│   ├── ocr_processing_service.rb
│   ├── data_quality_service.rb
│   └── network_analysis_service.rb
├── jobs/                 # バックグラウンド処理
│   ├── ocr_processing_job.rb
│   └── data_quality_job.rb
└── helpers/              # ビューヘルパー
    ├── application_helper.rb
    └── business_cards_helper.rb
```

### データベース設計原則

#### 1. 正規化とパフォーマンスのバランス
```sql
-- 正規化された設計
CREATE TABLE business_cards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  company_id BIGINT,  -- 正規化: 会社情報を別テーブル
  -- ...
);

CREATE TABLE companies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL UNIQUE,
  industry VARCHAR(100),
  -- ...
);

-- パフォーマンス重視: 非正規化
CREATE TABLE business_cards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  company_name VARCHAR(200) NOT NULL,  -- 非正規化: 検索性能向上
  -- ...
);
```

#### 2. インデックス戦略
```sql
-- 単一カラムインデックス
CREATE INDEX idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX idx_business_cards_company ON business_cards(company_name);

-- 複合インデックス
CREATE INDEX idx_business_cards_user_company ON business_cards(user_id, company_name);

-- 全文検索インデックス
CREATE FULLTEXT INDEX ft_business_cards_search ON business_cards(name, company_name, title);
```

### API設計原則

#### 1. RESTful API設計
```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :business_cards do
        member do
          post :extract_data    # POST /api/v1/business_cards/:id/extract_data
          patch :verify_data    # PATCH /api/v1/business_cards/:id/verify_data
        end
        collection do
          get :search          # GET /api/v1/business_cards/search
          get :analytics       # GET /api/v1/business_cards/analytics
        end
      end
    end
  end
end
```

#### 2. 統一されたレスポンス形式
```ruby
# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ApplicationController
  def render_success(data = {}, message = 'Success', status = :ok)
    render json: {
      success: true,
      message: message,
      data: data,
      timestamp: Time.current.iso8601
    }, status: status
  end

  def render_error(message, status = :unprocessable_entity, errors = {})
    render json: {
      success: false,
      message: message,
      errors: errors,
      timestamp: Time.current.iso8601
    }, status: status
  end
end
```

## 🧪 テスト戦略

### テストピラミッド実装

#### 1. Model Specs（Unit Tests）
```ruby
# spec/models/business_card_spec.rb
RSpec.describe BusinessCard, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:company) }
    it { should validate_length_of(:name).is_at_most(100) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:business_card_tags) }
    it { should have_many(:tags).through(:business_card_tags) }
  end

  describe 'scopes' do
    let!(:card1) { create(:business_card, company: 'Tech Corp') }
    let!(:card2) { create(:business_card, company: 'Other Corp') }

    it 'filters by company' do
      expect(BusinessCard.by_company('Tech')).to include(card1)
      expect(BusinessCard.by_company('Tech')).not_to include(card2)
    end
  end
end
```

#### 2. Controller Specs（Integration Tests）
```ruby
# spec/controllers/business_cards_controller_spec.rb
RSpec.describe BusinessCardsController, type: :controller do
  let(:user) { create(:user) }
  let(:business_card) { create(:business_card, user: user) }

  before { sign_in user }

  describe 'GET #index' do
    it 'returns success response' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'assigns @business_cards' do
      get :index
      expect(assigns(:business_cards)).to eq([business_card])
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_attributes) { attributes_for(:business_card) }

      it 'creates a new business card' do
        expect {
          post :create, params: { business_card: valid_attributes }
        }.to change(BusinessCard, :count).by(1)
      end
    end
  end
end
```

#### 3. System Specs（E2E Tests）
```ruby
# spec/system/business_cards_spec.rb
RSpec.describe 'Business Cards', type: :system do
  let(:user) { create(:user) }

  before do
    sign_in user
    visit business_cards_path
  end

  describe 'creating a business card' do
    it 'allows user to create a new business card' do
      click_link '新しい名刺を追加'
      
      fill_in '名前', with: '田中太郎'
      fill_in '会社名', with: 'サンプル株式会社'
      fill_in '役職', with: 'エンジニア'
      
      click_button '保存'
      
      expect(page).to have_content '名刺を作成しました'
      expect(page).to have_content '田中太郎'
    end
  end

  describe 'searching business cards' do
    let!(:business_card) { create(:business_card, name: '田中太郎', user: user) }

    it 'finds business cards by name' do
      fill_in '検索', with: '田中'
      click_button '検索'
      
      expect(page).to have_content '田中太郎'
    end
  end
end
```

### FactoryBot設定
```ruby
# spec/factories/business_cards.rb
FactoryBot.define do
  factory :business_card do
    association :user
    name { Faker::Name.name }
    company { Faker::Company.name }
    title { Faker::Job.title }
    email { Faker::Internet.email }
    phone { Faker::PhoneNumber.phone_number }
    
    trait :with_tags do
      after(:create) do |business_card|
        create_list(:tag, 2, business_cards: [business_card])
      end
    end
    
    trait :with_image do
      after(:build) do |business_card|
        business_card.card_image.attach(
          io: File.open(Rails.root.join('spec', 'fixtures', 'sample_card.jpg')),
          filename: 'sample_card.jpg',
          content_type: 'image/jpeg'
        )
      end
    end
  end
end
```

## 🔒 セキュリティ実装

### 認証・認可
```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include SessionsHelper
  
  protect_from_forgery with: :exception
  
  private
  
  def logged_in_user
    unless logged_in?
      store_location
      flash[:danger] = "ログインしてください"
      redirect_to login_url
    end
  end
  
  def correct_user
    @user = User.find(params[:id])
    redirect_to(root_url) unless current_user?(@user)
  end
end
```

### Strong Parameters
```ruby
# app/controllers/business_cards_controller.rb
class BusinessCardsController < ApplicationController
  private
  
  def business_card_params
    params.require(:business_card).permit(
      :name, :company, :title, :email, :phone, :address, :notes, :card_image
    )
  end
end
```

### ファイルアップロードセキュリティ
```ruby
# app/models/business_card.rb
class BusinessCard < ApplicationRecord
  has_one_attached :card_image
  
  validate :acceptable_image
  
  private
  
  def acceptable_image
    return unless card_image.attached?
    
    unless card_image.blob.byte_size <= 5.megabyte
      errors.add(:card_image, "ファイルサイズは5MB以下にしてください")
    end
    
    acceptable_types = ["image/jpeg", "image/png"]
    unless acceptable_types.include?(card_image.blob.content_type)
      errors.add(:card_image, "JPEG または PNG ファイルをアップロードしてください")
    end
  end
end
```

## ⚡ パフォーマンス最適化

### Ruby 3.3 + YJIT活用
```ruby
# config/application.rb
module BusinessCardManager
  class Application < Rails::Application
    # YJIT有効化（環境変数でも制御可能）
    config.yjit = true if RUBY_VERSION >= "3.3"
  end
end
```

### データベースクエリ最適化
```ruby
# N+1問題の解決
class BusinessCardsController < ApplicationController
  def index
    @business_cards = current_user.business_cards
                                 .includes(:tags, card_image_attachment: :blob)
                                 .page(params[:page])
  end
end

# カウンタキャッシュ
class User < ApplicationRecord
  has_many :business_cards, dependent: :destroy, counter_cache: true
end

# バッチ処理
BusinessCard.find_each(batch_size: 1000) do |card|
  # 大量データの処理
end
```

### キャッシュ戦略
```ruby
# フラグメントキャッシュ
# app/views/business_cards/index.html.erb
<% cache @business_cards do %>
  <% @business_cards.each do |card| %>
    <% cache card do %>
      <%= render 'business_card', card: card %>
    <% end %>
  <% end %>
<% end %>

# ロシアンドール キャッシュ
class BusinessCard < ApplicationRecord
  belongs_to :user, touch: true  # 関連レコード更新時にタイムスタンプ更新
end
```

## 🚀 デプロイメント戦略

### 環境別設定
```ruby
# config/environments/production.rb
Rails.application.configure do
  # YJIT本番環境での有効化
  config.yjit = true
  
  # SSL強制
  config.force_ssl = true
  
  # 静的ファイル配信
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
  
  # ログレベル
  config.log_level = :info
  
  # キャッシュ設定
  config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }
end
```

### CI/CD パイプライン
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Ruby 3.3
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.3
          bundler-cache: true
      
      - name: Set up database
        run: |
          bundle exec rails db:create
          bundle exec rails db:migrate
        env:
          RAILS_ENV: test
          RUBY_YJIT_ENABLE: 1
      
      - name: Run tests
        run: bundle exec rspec
        env:
          RAILS_ENV: test
          RUBY_YJIT_ENABLE: 1
      
      - name: Run security checks
        run: |
          bundle exec brakeman --no-pager
          bundle exec bundle-audit check --update
```

## 📊 監視・ログ

### アプリケーション監視
```ruby
# config/initializers/instrumentation.rb
ActiveSupport::Notifications.subscribe "process_action.action_controller" do |name, started, finished, unique_id, data|
  duration = finished - started
  
  if duration > 1.0  # 1秒以上の処理をログ出力
    Rails.logger.warn "Slow request: #{data[:controller]}##{data[:action]} took #{duration}s"
  end
end

# パフォーマンス監視
class ApplicationController < ActionController::Base
  around_action :log_performance
  
  private
  
  def log_performance
    start_time = Time.current
    yield
    duration = Time.current - start_time
    
    Rails.logger.info "#{controller_name}##{action_name} completed in #{duration}s"
  end
end
```

### エラー監視
```ruby
# config/initializers/error_monitoring.rb
class ErrorMonitor
  def self.capture_exception(exception, context = {})
    Rails.logger.error "Exception: #{exception.class} - #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")
    
    # 外部監視サービスへの送信（Sentry等）
    # Sentry.capture_exception(exception, extra: context)
  end
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  rescue_from StandardError, with: :handle_exception
  
  private
  
  def handle_exception(exception)
    ErrorMonitor.capture_exception(exception, {
      user_id: current_user&.id,
      request_id: request.uuid,
      params: params.to_unsafe_h
    })
    
    render 'errors/500', status: :internal_server_error
  end
end
```

## 🔧 開発ツール設定

### VS Code設定
```json
// .vscode/settings.json
{
  "ruby.intellisense": "rubyLsp",
  "ruby.format": "rubocop",
  "ruby.lint": {
    "rubocop": true,
    "reek": true
  },
  "files.associations": {
    "*.html.erb": "erb"
  },
  "emmet.includeLanguages": {
    "erb": "html"
  }
}
```

### RuboCop設定
```yaml
# .rubocop.yml
require:
  - rubocop-rails
  - rubocop-rspec

AllCops:
  TargetRubyVersion: 3.3
  NewCops: enable
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'vendor/**/*'
    - 'node_modules/**/*'

Style/Documentation:
  Enabled: false

Metrics/BlockLength:
  Exclude:
    - 'spec/**/*'
    - 'config/routes.rb'
```

## 📚 参考資料

### 公式ドキュメント
- [Ruby 3.3 Documentation](https://docs.ruby-lang.org/en/3.3/)
- [Rails 7.0 Guides](https://guides.rubyonrails.org/v7.0/)
- [YJIT Performance Guide](https://github.com/ruby/ruby/blob/master/doc/yjit/yjit.md)

### ベストプラクティス
- [Rails Best Practices](https://rails-bestpractices.com/)
- [RSpec Best Practices](https://rspec.info/documentation/)
- [Secure Rails](https://guides.rubyonrails.org/security.html)

### 技術参考資料
- [Modern Rails Development](https://guides.rubyonrails.org/)
- [Ruby Performance Optimization](https://ruby-doc.org/core-3.3.0/)
- [Test-Driven Development with RSpec](https://rspec.info/)