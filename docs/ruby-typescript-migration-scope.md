# Rails Ruby担当機能 vs TypeScript移行対象 - 完全一覧

## 🔴 **Rubyが担っている機能一覧（継続予定）**

### 1. **サーバーサイド・バックエンド処理**
```ruby
# Models - データモデル・ビジネスロジック層
app/models/
├── application_record.rb          # ActiveRecord基底クラス
├── user.rb                        # ユーザーモデル（認証・認可・パスワード管理）
├── business_card.rb               # 名刺モデル（バリデーション・スコープ）
└── concerns/                      # 共通ロジック

# Controllers - HTTP API・認証・認可
app/controllers/
├── application_controller.rb      # 基底コントローラー（CSRF・認証・例外処理）
├── business_cards_controller.rb   # 名刺CRUD API
├── users_controller.rb           # ユーザー管理 API
├── sessions_controller.rb        # 認証セッション管理
├── account_activations_controller.rb  # アカウント有効化
├── password_resets_controller.rb # パスワードリセット
├── home_controller.rb            # ホームページ
└── errors_controller.rb          # エラーハンドリング
```

### 2. **認証・認可・セキュリティ**
```ruby
# Helper Modules
app/helpers/
├── application_helper.rb         # 基本ヘルパーメソッド
└── sessions_helper.rb           # セッション管理・ログイン状態・Remember Me

# セキュリティ機能
- CSRF保護（protect_from_forgery）
- パスワードハッシュ化（BCrypt）
- セッション管理（encrypted cookies）
- Remember Me機能
- アカウント有効化
- パスワードリセット
- 認証トークン管理
```

### 3. **データベース・永続化**
```ruby
# Database Configuration
config/database.yml              # MySQL接続設定

# Database Migrations
db/migrate/
├── 20250915122429_create_users.rb
├── 20250916035850_add_remember_digest_to_users.rb
├── 20250916074326_add_activation_to_users.rb
├── 20250917051702_add_reset_columns_to_users.rb
└── ...

# Database Schema
db/schema.rb                     # データベーススキーマ定義
db/seeds.rb                      # シードデータ

# ActiveRecord Features
- アソシエーション（has_many, belongs_to）
- バリデーション（presence, format, uniqueness）
- スコープメソッド（by_company, recent）
- コールバック（before_save, before_create）
```

### 4. **メール送信・通知**
```ruby
# Mailers
app/mailers/
├── application_mailer.rb        # 基底メーラー
└── user_mailer.rb              # ユーザー関連メール（有効化・パスワードリセット）

# Email Templates
app/views/user_mailer/
├── activation_email.html.erb    # アカウント有効化メール
└── password_reset.html.erb     # パスワードリセットメール
```

### 5. **ルーティング・設定**
```ruby
# Routing
config/routes.rb                 # RESTful API ルート定義

# Application Configuration
config/
├── application.rb              # Rails アプリケーション設定
├── environments/               # 環境別設定（development, test, production）
├── initializers/              # 初期化設定
└── locales/                   # 国際化（i18n）設定
```

### 6. **バックグラウンドジョブ**
```ruby
# Jobs
app/jobs/
└── application_job.rb          # バックグラウンドタスク基底クラス
```

---

## 🔵 **TypeScriptに移行する機能一覧（段階的移行予定）**

### 1. **フロントエンド・ユーザーインターフェース**
```erb
# 現在のERBビュー（TypeScript + Reactに置き換え予定）
app/views/
├── layouts/
│   └── application.html.erb    → React Layout Component
├── business_cards/
│   ├── index.html.erb         → BusinessCardList Component
│   ├── show.html.erb          → BusinessCardDetail Component
│   ├── new.html.erb           → BusinessCardForm Component
│   ├── edit.html.erb          → BusinessCardEditForm Component
│   ├── _business_card.html.erb → BusinessCardItem Component
│   └── _form.html.erb         → BusinessCardFormFields Component
├── users/
│   ├── new.html.erb           → UserRegistrationForm Component
│   └── show.html.erb          → UserProfile Component
├── sessions/
│   └── new.html.erb           → LoginForm Component
├── password_resets/
│   ├── new.html.erb           → PasswordResetRequest Component
│   └── edit.html.erb          → PasswordResetForm Component
├── home/
│   └── index.html.erb         → HomePage Component
└── shared/
    └── _header.html.erb       → Header Component
```

### 2. **クライアントサイドロジック**
```typescript
# TypeScript実装予定
app/javascript/
├── types/                     # 型定義ファイル
│   ├── business_card.ts      ✅ 実装済み
│   ├── user.ts               ⏳ 実装予定
│   └── api.ts                ⏳ 実装予定
├── utils/                    # ユーティリティ関数
│   ├── api.ts                ⏳ 実装予定（API通信）
│   └── validation.ts         ⏳ 実装予定（フォームバリデーション）
├── components/               # React コンポーネント
│   ├── Layout/
│   ├── BusinessCard/
│   ├── User/
│   ├── Auth/
│   └── Common/
├── hooks/                    # カスタムReact Hooks
├── store/                    # 状態管理（Redux/Context）
└── services/                 # ビジネスロジック
```

### 3. **フォーム処理・バリデーション**
```typescript
// 現在：サーバーサイドバリデーションのみ
// 移行後：クライアントサイド + サーバーサイド

// TypeScript実装予定機能
- リアルタイムフォームバリデーション
- 入力値の型チェック
- エラー表示の即座な更新
- フォーム状態管理
- 送信前の包括的チェック
```

### 4. **ユーザーインタラクション**
```typescript
// 現在：最小限のStimulus Controllers
// 移行後：リッチなReactインタラクション

移行予定機能：
- モーダルダイアログ
- ドラッグ&ドロップ
- リアルタイム検索
- 自動補完
- 無限スクロール
- 状態保持（ローカルストレージ）
- オフライン対応
```

### 5. **API通信層**
```typescript
// 現在：フォーム送信 + ページリロード
// 移行後：AJAX + JSON API

// TypeScript API Client実装予定
app/javascript/utils/api.ts:
- 型安全なAPIクライアント
- CSRF トークン自動処理
- エラーハンドリング
- レスポンス型チェック
- リクエスト/レスポンスインターセプター
```

### 6. **状態管理**
```typescript
// 現在：サーバーサイド状態のみ
// 移行後：クライアントサイド状態管理

実装予定：
- React State (useState, useReducer)
- Context API（グローバル状態）
- Redux Toolkit（複雑な状態管理）
- React Query（API状態管理）
```

### 7. **ビルド・開発ツール**
```typescript
// TypeScript開発環境
tsconfig.json                 ✅ 実装済み
jest.config.js               ✅ 実装済み
package.json                 ✅ TypeScript対応済み

// 実装予定ツール
.eslintrc.json               ⏳ TypeScript対応強化
prettier.config.js          ⏳ コードフォーマット
vite.config.ts              ⏳ 高速ビルド（esbuild代替検討）
```

---

## 📊 **移行戦略・段階的アプローチ**

### Phase 1: TypeScript基盤構築（現在のタスク12）✅
```typescript
✅ 完了済み
- TypeScript設定（tsconfig.json）
- 基本型定義（BusinessCard）
- Jest + TypeScript テスト環境

⏳ 進行中
- 型安全なAPIクライアント実装
- ESLint TypeScript対応強化
```

### Phase 2: React基盤導入
```typescript
実装予定：
- 単一コンポーネントの置き換え（名刺一覧から開始）
- React + TypeScript基本構造
- 状態管理の基礎実装
```

### Phase 3: 段階的コンポーネント移行
```typescript
移行順序：
1. 名刺一覧 (index.html.erb → BusinessCardList)
2. 名刺詳細 (show.html.erb → BusinessCardDetail)
3. 名刺作成 (new.html.erb → BusinessCardForm)
4. ログイン (sessions/new.html.erb → LoginForm)
5. ユーザー登録 (users/new.html.erb → SignupForm)
```

### Phase 4: 全面SPA化
```typescript
最終形態：
- 全ERBビューのReact化完了
- Rails: 純粋なJSON API
- TypeScript: 完全なフロントエンド責任
- リアルタイム機能（WebSocket）
```

---

## 🎯 **重要な設計判断**

### **Rubyに残す理由**
1. **データベース操作**: ActiveRecordの強力なORM機能
2. **認証・認可**: Railsのセキュリティ機能とエコシステム
3. **バックグラウンドジョブ**: sidekiq, delayed_jobとの統合
4. **メール送信**: Action Mailerの安定性
5. **API エンドポイント**: RESTful設計とJSON レスポンス

### **TypeScriptに移行する理由**
1. **ユーザー体験**: ページリロードなしの快適な操作
2. **型安全性**: 実行時エラーの事前防止
3. **開発効率**: IDE支援とコンパイル時チェック
4. **モダンUI**: リアクティブなインターフェース
5. **保守性**: 構造化されたフロントエンドコード

このアプローチにより、Railsの堅牢なバックエンドを活かしながら、モダンなフロントエンド体験を実現します。
