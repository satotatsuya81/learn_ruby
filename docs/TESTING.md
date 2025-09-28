# テスト実行ガイド

Business Card Manager のテスト実行方法とテスト構造について説明します。

## 概要

このプロジェクトでは以下のテストフレームワークを使用しています：

- **Ruby/Rails**: RSpec（ユニットテスト、統合テスト、システムテスト）
- **JavaScript/TypeScript**: Jest（フロントエンドコンポーネントテスト）

## テスト実行方法

### Ruby/Rails テスト

RSpecを使用してRails アプリケーションのテストを実行します。

#### 全テスト実行
```bash
bundle exec rspec
```

#### 特定のテストファイル実行
```bash
# モデルテスト
bundle exec rspec spec/models/user_spec.rb

# リクエストテスト
bundle exec rspec spec/requests/business_cards_spec.rb

# システムテスト
bundle exec rspec spec/system/user_registration_spec.rb
```

#### 特定のテストケース実行
```bash
# 行番号指定
bundle exec rspec spec/models/user_spec.rb:25

# タグ指定
bundle exec rspec --tag focus
```

#### カバレッジ付き実行
```bash
COVERAGE=true bundle exec rspec
```

### JavaScript/TypeScript テスト

Jestを使用してフロントエンドコンポーネントのテストを実行します。

#### 全テスト実行
```bash
npm test
```

#### カバレッジ付きテスト実行
```bash
npm run test:coverage
```

#### ウォッチモードでテスト実行
```bash
npm run test:watch
```

#### CI環境でのテスト実行
```bash
npm run test:ci
```

### 型チェック

TypeScriptの型チェックを実行します。

```bash
npm run type-check
```

### コード品質チェック

ESLintを使用してコード品質をチェックします。

```bash
# チェックのみ
npm run lint

# 自動修正付き
npm run lint:fix
```

### 統合テスト実行

すべてのテストとチェックを一度に実行します。

```bash
# JavaScript/TypeScript関連のすべてのチェック
npm run test:all

# Rails テスト
bundle exec rspec
```

## テスト構造

### Ruby/Rails テスト構造

```
spec/
├── factories/           # FactoryBot ファクトリ定義
│   ├── business_cards.rb
│   └── users.rb
├── helpers/            # テストヘルパーメソッド
├── mailers/            # メイラーテスト
│   └── user_mailer_spec.rb
├── models/             # モデルテスト
│   ├── application_record_spec.rb
│   ├── business_card_spec.rb
│   └── user_spec.rb
├── requests/           # APIテスト（統合テスト）
│   ├── account_activations_spec.rb
│   ├── business_cards_spec.rb
│   ├── errors_spec.rb
│   ├── home_spec.rb
│   ├── password_resets_spec.rb
│   ├── sessions_spec.rb
│   └── users_spec.rb
├── routing/            # ルーティングテスト
├── support/            # テスト設定とヘルパー
│   └── capybara.rb
├── system/             # E2Eテスト（ブラウザテスト）
│   ├── business_card_management_spec.rb
│   ├── error_pages_spec.rb
│   └── user_registration_spec.rb
├── rails_helper.rb     # Rails用テスト設定
└── spec_helper.rb      # 共通テスト設定
```

### JavaScript/TypeScript テスト構造

```
spec/javascript/
├── components/         # Reactコンポーネントテスト
│   ├── BusinessCardForm.spec.tsx
│   ├── DeleteConfirmModal.spec.tsx
│   ├── FlashMessage.spec.tsx
│   ├── LoginForm.spec.tsx
│   ├── SearchFilter.spec.tsx
│   └── UserProfile.spec.tsx
├── utils/             # ユーティリティ関数テスト
│   ├── api.spec.ts
│   └── validation.spec.ts
├── types/             # 型定義テスト
│   └── business_card.spec.ts
└── setup.ts           # Jest設定ファイル
```

## テストカテゴリ詳細

### 1. モデルテスト (`spec/models/`)

- **目的**: モデルのバリデーション、関連、メソッドをテスト
- **実行速度**: 高速
- **カバレッジ範囲**: データモデルとビジネスロジック

**例**:
```ruby
# spec/models/user_spec.rb
RSpec.describe User, type: :model do
  it "有効なユーザーが作成できること" do
    user = build(:user)
    expect(user).to be_valid
  end
end
```

```ruby
# spec/models/business_card_spec.rb
RSpec.describe BusinessCard, type: :model do
  it "有効な名刺が作成できること" do
    business_card = build(:business_card)
    expect(business_card).to be_valid
  end
end
```

### 2. リクエストテスト (`spec/requests/`)

- **目的**: HTTPリクエスト/レスポンス、API動作をテスト
- **実行速度**: 中程度
- **カバレッジ範囲**: コントローラー、ルーティング、認証

**例**:
```ruby
# spec/requests/business_cards_spec.rb
RSpec.describe "BusinessCards", type: :request do
  describe "GET /business_cards" do
    it "名刺一覧が表示される" do
      get business_cards_path
      expect(response).to have_http_status(200)
    end
  end
end
```

### 3. システムテスト (`spec/system/`)

- **目的**: ブラウザ操作を含むE2Eテスト
- **実行速度**: 低速
- **カバレッジ範囲**: ユーザー操作フロー全体

**例**:
```ruby
# spec/system/user_registration_spec.rb
RSpec.describe "ユーザー登録", type: :system do
  it "新規ユーザーが登録できること" do
    visit signup_path
    fill_in "名前", with: "テストユーザー"
    click_button "登録"
    expect(page).to have_content("登録が完了しました")
  end
end
```

### 4. JavaScript/TypeScript テスト

- **目的**: Reactコンポーネント、フロントエンドロジック、型定義をテスト
- **実行速度**: 高速
- **カバレッジ範囲**: UIコンポーネント、ユーザーインタラクション、APIユーティリティ

## テスト設定

### RSpec 設定

主要な設定項目（`rails_helper.rb`, `spec_helper.rb`）:

- **FactoryBot**: テストデータ作成
- **Capybara**: システムテスト用ブラウザ操作
- **Database Cleaner**: テスト間のデータベースクリーンアップ
- **Shoulda Matchers**: バリデーションテスト用マッチャー

### Jest 設定

主要な設定項目（`jest.config.js`）:

- **ts-jest**: TypeScriptファイルの直接テスト実行
- **Testing Library**: Reactコンポーネントテスト
- **JSDOM**: ブラウザ環境シミュレーション
- **モジュールエイリアス**: `@/` を `app/javascript/` にマッピング

## テスト実行時の注意事項

### 1. データベース

- テスト用データベースは `test` 環境を使用
- 各テスト前にデータがクリーンアップされます
- FactoryBotでテストデータを作成します

### 2. 環境変数

テスト実行時は以下の環境変数が設定されます：

```bash
RAILS_ENV=test
NODE_ENV=test
```

### 3. 並列実行

RSpecの並列実行を有効にする場合：

```bash
# 4プロセスで並列実行
bundle exec rspec --parallel_tests 4
```

### 4. カバレッジレポート

カバレッジレポートは以下の場所に生成されます：

- **Ruby**: `coverage/index.html`
- **JavaScript**: `coverage/lcov-report/index.html`

## CI/CD での実行

GitHub Actions やその他のCI環境での実行例：

```yaml
# .github/workflows/test.yml 例
- name: Run Rails tests
  run: bundle exec rspec

- name: Run JavaScript tests
  run: npm run test:ci

- name: Type check
  run: npm run type-check

- name: Lint check
  run: npm run lint
```

## デバッグ

### RSpecデバッグ

```ruby
# テスト内でデバッグ
binding.pry

# ログ出力
puts response.body
```

### Jestデバッグ

```bash
# デバッグモードで実行
npm test -- --debug
```

## ベストプラクティス

### 1. テスト分離

- 各テストは独立して実行可能であること
- テスト間でデータを共有しない
- 外部依存性をモック化する

### 2. 読みやすいテスト

- テスト名は実行内容を明確に表現
- `describe` と `context` で構造化
- 1テストケース＝1つの検証項目

### 3. パフォーマンス

- システムテストは最小限に抑える
- 必要最小限のデータを作成
- 不要なフィーチャーテストは削除

---

**更新日**: 2025年9月28日
**参考**: Rails Testing Guide, RSpec Documentation, Jest Documentation