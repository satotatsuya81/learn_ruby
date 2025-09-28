# Business Card Manager - 設計書

## システム概要

Business Card Managerは、名刺管理Webアプリケーションです。Ruby on Railsをベースとし、devcontainer環境での開発を通じて、モダンなWeb開発手法を実践します。

### 現在の実装状況（2025年9月28日時点）

#### ✅ 実装完了
- **基本的な名刺管理システム**: ユーザー認証・CRUD操作・データベース設計
- **React/TypeScript統合**: フロントエンド技術スタックの近代化完了
- **インタラクティブ機能**: ユーザビリティ改善とUX向上
- **レスポンシブUI**: Bootstrap 5 + Stimulusによるモダンインターフェース
- **検索・フィルタリング**: 名前、会社、タグによる高度検索
- **タグ管理システム**: 柔軟なタグ付けとカテゴリ分類
- **画像アップロード**: 名刺画像の保存と最適化

#### 🔄 実装中
- **OCR処理システム**: 名刺画像からの自動データ抽出
- **統計・分析ダッシュボード**: データ可視化と分析機能
- **データエクスポート**: CSV、JSON形式での出力機能
- **ネットワーク分析**: 人脈関係の可視化

#### 🔴 未実装
- **データ品質管理**: 重複検出・データ検証・品質スコア算出
- **機械学習機能**: 予測・推奨・自動分類

以下の要素を取り入れます：
- 名刺画像からの自動データ抽出（OCR機能の基盤）
- 人脈ネットワークの可視化
- 機械学習を活用したデータ品質向上
- 大規模データ処理に対応したアーキテクチャ
- プロダクト開発における技術的意思決定プロセス
- ユーザー体験を重視した機能設計
- データドリブンな機能改善サイクル

## アーキテクチャ設計

### システム全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Web Browser (Chrome, Firefox, Safari, Edge)               │
│  - Bootstrap 5 + Stimulus (基本UI) ✅ 実装済み             │
│  - React/TypeScript + Redux (コンポーネントベースUI) ✅ 実装済み │
│  - esbuild (高速ビルドシステム)                             │
│  - ESLint + TypeScript (品質管理・型安全性)                 │
└─────────────────────────────────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                Application Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Ruby on Rails 8.0 Application Server                      │
│  ├── Controllers (MVC)                                     │
│  ├── Models (ActiveRecord)                                 │
│  ├── Views (ERB Templates)                                 │
│  ├── Services (Business Logic)                             │
│  ├── Jobs (Background Processing)                          │
│  └── API (JSON for React)                                  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Data Layer                                   │
├─────────────────────────────────────────────────────────────┤
│  MySQL 8.0 Database                                        │
│  ├── Users Table                                           │
│  ├── Business Cards Table                                  │
│  ├── Tags Table                                            │
│  ├── Business Card Tags Table (Join)                      │
│  └── Active Storage Tables                                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                Storage Layer                                 │
├─────────────────────────────────────────────────────────────┤
│  File Storage                                               │
│  ├── Local Storage (Development)                           │
│  └── AWS S3 (Production)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 開発環境アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                Development Environment                       │
├─────────────────────────────────────────────────────────────┤
│  VS Code + Dev Containers Extension                         │
│  └── devcontainer.json Configuration                       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                Docker Environment                            │
├─────────────────────────────────────────────────────────────┤
│  Docker Compose Services:                                  │
│  ├── app (Rails Application Container)                     │
│  │   ├── Ruby 3.3 + YJIT                                 │
│  │   ├── Rails 8.0                                        │
│  │   ├── Node.js (for Asset Pipeline)                     │
│  │   └── Development Tools                                 │
│  ├── db (MySQL Container)                                  │
│  │   ├── MySQL 8.0                                        │
│  │   └── Persistent Volume                                 │
│  └── redis (Session Store Container)                       │
│      ├── Redis 7.0                                         │
│      └── Session & Cache Storage                           │
└─────────────────────────────────────────────────────────────┘
```

## データベース設計

### ER図

```
┌─────────────────┐       ┌─────────────────────────────────┐
│     Users       │       │        Business Cards          │
├─────────────────┤       ├─────────────────────────────────┤
│ id (PK)         │◄─────┤│ id (PK)                         │
│ name            │      1│ user_id (FK)                    │
│ email           │       │ name                            │
│ password_digest │       │ company                         │
│ admin           │       │ title                           │
│ activated       │       │ email                           │
│ activation_digest│       │ phone                           │
│ remember_digest │       │ address                         │
│ reset_digest    │       │ notes                           │
│ reset_sent_at   │       │ created_at                      │
│ created_at      │       │ updated_at                      │
│ updated_at      │       └─────────────────────────────────┘
└─────────────────┘                        │
                                          │ M
                                          │
                                          │ M
                           ┌─────────────────────────────────┐
                           │    Business Card Tags           │
                           ├─────────────────────────────────┤
                           │ id (PK)                         │
                           │ business_card_id (FK)           │
                           │ tag_id (FK)                     │
                           │ created_at                      │
                           └─────────────────────────────────┘
                                          │ M
                                          │
                                          │ 1
                           ┌─────────────────────────────────┐
                           │           Tags                  │
                           ├─────────────────────────────────┤
                           │ id (PK)                         │
                           │ name                            │
                           │ color                           │
                           │ created_at                      │
                           │ updated_at                      │
                           └─────────────────────────────────┘
```

### テーブル定義

#### Users テーブル
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_digest VARCHAR(255) NOT NULL,
  admin BOOLEAN DEFAULT FALSE,
  activated BOOLEAN DEFAULT FALSE,
  activation_digest VARCHAR(255),
  remember_digest VARCHAR(255),
  reset_digest VARCHAR(255),
  reset_sent_at DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,

  INDEX idx_users_email (email),
  INDEX idx_users_activated (activated)
);
```

#### Business Cards テーブル
```sql
CREATE TABLE business_cards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  company VARCHAR(200) NOT NULL,
  title VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  notes TEXT,
  -- OCR・画像処理関連
  image_processed BOOLEAN DEFAULT FALSE,
  ocr_confidence DECIMAL(3,2),
  extraction_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  -- データ品質管理
  data_quality_score DECIMAL(3,2),
  verification_status ENUM('unverified', 'auto_verified', 'manual_verified') DEFAULT 'unverified',
  -- 人脈ネットワーク
  connection_strength DECIMAL(3,2) DEFAULT 0.0,
  last_contact_date DATE,
  contact_frequency INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_business_cards_user_id (user_id),
  INDEX idx_business_cards_company (company),
  INDEX idx_business_cards_name (name),
  INDEX idx_business_cards_extraction_status (extraction_status),
  INDEX idx_business_cards_data_quality (data_quality_score),
  FULLTEXT INDEX ft_business_cards_search (name, company, title)
);
```

#### Tags テーブル
```sql
CREATE TABLE tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6c757d',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,

  INDEX idx_tags_name (name)
);
```

#### Business Card Tags テーブル
```sql
CREATE TABLE business_card_tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  business_card_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL,

  FOREIGN KEY (business_card_id) REFERENCES business_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_business_card_tag (business_card_id, tag_id),
  INDEX idx_business_card_tags_business_card_id (business_card_id),
  INDEX idx_business_card_tags_tag_id (tag_id)
);
```

## フロントエンド技術移行アーキテクチャ

### 段階的移行戦略

#### フェーズ1: TypeScript基盤構築
```
既存ERBビュー → TypeScript導入 → esbuild設定
├── app/javascript/application.ts
├── tsconfig.json
├── package.json (既存依存関係活用)
└── esbuild.config.js
```

#### フェーズ2: Reactコンポーネント化
```
Rails ERB → React TSX コンポーネント → Redux状態管理
├── 名刺一覧 (BusinessCardList.tsx)
├── 削除確認 (DeleteConfirmModal.tsx)
├── フラッシュ通知 (FlashMessage.tsx)
└── 検索・フィルター (SearchFilter.tsx)
```

#### フェーズ3: Redux統合・API連携
```
Local State → Redux Store → Rails API
├── Redux Toolkit設定
├── 型安全なAPI呼び出し
├── 楽観的更新
└── エラーハンドリング
```

### TypeScript型定義設計

#### ドメインモデル型
```typescript
// Domain Types
interface BusinessCard {
  id: number;
  name: string;
  company: string;
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  activated: boolean;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}
```

#### API レスポンス型
```typescript
// API Response Types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
  };
}
```

#### Redux State型
```typescript
// Redux State Types
interface RootState {
  businessCards: BusinessCardsState;
  ui: UiState;
  auth: AuthState;
}

interface BusinessCardsState {
  items: BusinessCard[];
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    selectedTags: number[];
    company: string;
  };
}
```

### React コンポーネント設計

#### コンポーネント階層
```
App (最上位)
├── Layout
│   ├── Header (認証情報、ナビゲーション)
│   ├── FlashMessages (通知表示)
│   └── Footer
├── BusinessCardsList (一覧画面)
│   ├── SearchFilter (検索・フィルター)
│   ├── BusinessCardGrid (カード表示)
│   │   └── BusinessCardItem (個別カード)
│   └── Pagination
├── BusinessCardDetail (詳細画面)
│   ├── BusinessCardInfo (基本情報)
│   ├── TagList (タグ表示)
│   └── ActionButtons (編集・削除)
└── Modals
    ├── DeleteConfirmModal (削除確認)
    └── BusinessCardFormModal (作成・編集)
```

#### コンポーネント設計原則
- **単一責任**: 各コンポーネントは1つの責任のみ
- **再利用性**: 共通コンポーネントの抽出と再利用
- **型安全性**: PropsとStateの完全な型定義
- **テスタビリティ**: 単体テスト可能な設計

### Redux Store設計

#### Store構成
```typescript
// Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import businessCardsSlice from './slices/businessCardsSlice';
import uiSlice from './slices/uiSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    businessCards: businessCardsSlice,
    ui: uiSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

#### 非同期アクション（Thunk）
```typescript
// Async Actions
export const fetchBusinessCards = createAsyncThunk(
  'businessCards/fetchBusinessCards',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await api.businessCards.fetchAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
```

### API通信層設計

#### HTTP クライアント
```typescript
// HTTP Client Configuration
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// CSRF トークン設定
api.defaults.headers.common['X-CSRF-Token'] =
  document.querySelector('[name="csrf-token"]')?.getAttribute('content') || '';
```

#### API サービス層
```typescript
// Business Cards API Service
export const businessCardsApi = {
  fetchAll: (params: SearchParams): Promise<ApiResponse<BusinessCard[]>> =>
    api.get('/business_cards', { params }).then(res => res.data),

  create: (data: BusinessCardFormData): Promise<ApiResponse<BusinessCard>> =>
    api.post('/business_cards', data).then(res => res.data),

  update: (id: number, data: BusinessCardFormData): Promise<ApiResponse<BusinessCard>> =>
    api.put(`/business_cards/${id}`, data).then(res => res.data),

  delete: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/business_cards/${id}`).then(res => res.data),
};
```

### ビルドシステム設計

#### esbuild設定
```javascript
// esbuild.config.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['app/javascript/application.ts'],
  bundle: true,
  sourcemap: true,
  outdir: 'app/assets/builds',
  publicPath: '/assets',
  target: ['es2020'],
  format: 'esm',
  splitting: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
}).catch(() => process.exit(1));
```

#### TypeScript設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "app/javascript/**/*"
  ]
}
```

### パフォーマンス最適化

#### コード分割
- **Dynamic Imports**: 画面単位でのコード分割
- **Lazy Loading**: 必要時のみコンポーネント読み込み
- **Tree Shaking**: 未使用コードの削除

#### 状態管理最適化
- **Memoization**: React.memo, useMemo, useCallback活用
- **仮想化**: 大量データのリスト仮想化
- **楽観的更新**: UIレスポンス向上のための楽観的更新

## コンポーネント設計

### MVCアーキテクチャ

#### Models
```ruby
# User Model
class User < ApplicationRecord
  has_many :business_cards, dependent: :destroy
  has_secure_password

  # Authentication & Authorization
  # Profile Management
  # Business Logic Methods
end

# BusinessCard Model
class BusinessCard < ApplicationRecord
  belongs_to :user
  has_many :business_card_tags, dependent: :destroy
  has_many :tags, through: :business_card_tags
  has_one_attached :card_image

  # Validations
  # Scopes for Search & Filter
  # Business Logic Methods
end

# Tag Model
class Tag < ApplicationRecord
  has_many :business_card_tags, dependent: :destroy
  has_many :business_cards, through: :business_card_tags

  # Validations
  # Utility Methods
end
```

#### Controllers
```ruby
# Application Controller (Base)
class ApplicationController < ActionController::Base
  include SessionsHelper

  # Authentication
  # Authorization
  # Common Helpers
end

# Business Cards Controller
class BusinessCardsController < ApplicationController
  # CRUD Actions: index, show, new, create, edit, update, destroy
  # Additional Actions: search, analytics, export
  # Authentication & Authorization Filters
end

# API Controllers (for React)
class Api::V1::BaseController < ApplicationController
  # JSON API Base
  # Error Handling
  # Authentication for API
end
```

#### Views
```erb
<!-- Layout Templates -->
app/views/layouts/application.html.erb

<!-- Business Cards Views -->
app/views/business_cards/
├── index.html.erb      # 一覧画面
├── show.html.erb       # 詳細画面
├── new.html.erb        # 新規作成画面
├── edit.html.erb       # 編集画面
└── _form.html.erb      # フォーム部品

<!-- Shared Partials -->
app/views/shared/
├── _header.html.erb
├── _footer.html.erb
├── _flash_messages.html.erb
└── _pagination.html.erb
```

### Services層設計

```ruby
# Business Logic Services
class BusinessCardService
  # Complex Business Logic
  # Data Processing
  # External API Integration
end

# OCR・画像処理サービス
class OcrProcessingService
  # 画像からのテキスト抽出
  # データ構造化処理
  # 信頼度スコア算出
end

class DataQualityService
  # データ品質評価
  # 自動補完・修正
  # 重複検出・マージ
end

# 人脈ネットワーク分析
class NetworkAnalysisService
  # 人脈関係の分析
  # 接触頻度の計算
  # 推奨コンタクト提案
end

class AnalyticsService
  # Statistics Generation
  # Chart Data Preparation
  # Report Generation
  # ネットワーク可視化データ
end

class ExportService
  # CSV Export
  # JSON Export
  # Data Formatting
end
```

## API設計

### RESTful API エンドポイント

#### Authentication API
```
POST   /api/v1/sessions          # ログイン
DELETE /api/v1/sessions          # ログアウト
GET    /api/v1/current_user      # 現在のユーザー情報
```

#### Business Cards API
```
GET    /api/v1/business_cards              # 一覧取得
POST   /api/v1/business_cards              # 新規作成
GET    /api/v1/business_cards/:id          # 詳細取得
PUT    /api/v1/business_cards/:id          # 更新
DELETE /api/v1/business_cards/:id          # 削除
GET    /api/v1/business_cards/search       # 検索
GET    /api/v1/business_cards/analytics    # 統計データ
GET    /api/v1/business_cards/export       # エクスポート
-- OCR・画像処理API
POST   /api/v1/business_cards/upload_image # 画像アップロード・OCR処理
POST   /api/v1/business_cards/:id/extract  # データ抽出実行
PUT    /api/v1/business_cards/:id/verify   # データ検証・品質向上
-- 人脈ネットワークAPI
GET    /api/v1/business_cards/:id/connections    # 関連する人脈
POST   /api/v1/business_cards/:id/contact_log    # 接触履歴記録
GET    /api/v1/business_cards/network_analysis   # ネットワーク分析
```

#### Tags API
```
GET    /api/v1/tags              # タグ一覧
POST   /api/v1/tags              # タグ作成
PUT    /api/v1/tags/:id          # タグ更新
DELETE /api/v1/tags/:id          # タグ削除
GET    /api/v1/tags/popular      # 人気タグ
```

### API レスポンス形式

#### 成功レスポンス
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "田中太郎",
    "company": "サンプル株式会社",
    "title": "エンジニア",
    "email": "tanaka@example.com",
    "phone": "03-1234-5678",
    "created_at": "2025-09-13T10:00:00Z",
    "updated_at": "2025-09-13T10:00:00Z",
    "tags": [
      {
        "id": 1,
        "name": "エンジニア",
        "color": "#007bff"
      }
    ]
  }
}
```

#### エラーレスポンス
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["can't be blank"],
    "company": ["can't be blank"]
  }
}
```

## セキュリティ設計

### 認証・認可
- **認証方式**: Session-based Authentication
- **パスワード**: bcryptによるハッシュ化
- **セッション管理**: Rails標準のセッション機能
- **Remember Me**: 永続化トークンによる自動ログイン

### セキュリティ対策
- **CSRF対策**: Rails標準のCSRF保護
- **XSS対策**: ERBテンプレートの自動エスケープ
- **SQLインジェクション対策**: ActiveRecordのパラメータ化クエリ
- **Mass Assignment対策**: Strong Parameters
- **ファイルアップロード対策**: Content-Type検証、ファイルサイズ制限

### データ保護
- **個人情報保護**: 最小限の情報収集
- **データ暗号化**: 本番環境でのHTTPS強制
- **バックアップ**: 定期的なデータベースバックアップ

## パフォーマンス設計

### データベース最適化
- **インデックス設計**: 検索頻度の高いカラムにインデックス
- **N+1問題対策**: includes/joinsの適切な使用
- **クエリ最適化**: 不要なデータ取得の回避

### キャッシュ戦略
- **ページキャッシュ**: 静的コンテンツのキャッシュ
- **フラグメントキャッシュ**: 部分的なビューキャッシュ
- **データベースキャッシュ**: 頻繁にアクセスされるデータのキャッシュ

### 画像最適化
- **画像リサイズ**: Active Storageによる自動リサイズ
- **画像圧縮**: 適切な品質設定
- **遅延読み込み**: 画像の遅延読み込み実装

## テスト戦略

### テストピラミッド
```
┌─────────────────────────────────────┐
│           E2E Tests                 │  ← 少数
│        (System Specs)               │
├─────────────────────────────────────┤
│        Integration Tests            │  ← 中程度
│      (Controller Specs)             │
├─────────────────────────────────────┤
│          Unit Tests                 │  ← 多数
│    (Model Specs, Service Specs)     │
└─────────────────────────────────────┘
```

### テスト種別
- **Model Specs**: バリデーション、アソシエーション、メソッドのテスト
- **Controller Specs**: HTTPレスポンス、認証・認可のテスト
- **System Specs**: ブラウザを使った統合テスト
- **API Specs**: JSON APIのテスト

### テストツール
- **RSpec**: テストフレームワーク
- **FactoryBot**: テストデータ生成
- **Capybara**: ブラウザ操作テスト
- **Faker**: ダミーデータ生成

### 型安全性・コード品質
- **Sorbet**: 静的型チェッカー
- **RSpec→sig自動生成**: テストコードからの型シグネチャ自動生成
- **RuboCop**: 静的コード解析
- **Brakeman**: セキュリティ脆弱性検査

## デプロイメント設計

### 開発環境
- **devcontainer**: Docker Composeによる統一環境
- **ホットリロード**: Rails開発サーバーによる自動リロード
- **デバッグ**: VS Codeデバッガー統合

### ステージング環境
- **Heroku**: 簡易デプロイメント
- **環境変数**: 本番環境設定の模擬
- **データベース**: Heroku Postgres

### 本番環境（将来）
- **AWS**: スケーラブルなインフラ
- **RDS**: マネージドデータベース
- **S3**: 画像ストレージ
- **CloudFront**: CDN

## 監視・ログ設計

### ログ管理
- **アプリケーションログ**: Rails標準ログ
- **エラーログ**: 例外の詳細記録
- **アクセスログ**: ユーザーアクセスの記録

### 監視項目
- **レスポンス時間**: ページ読み込み時間
- **エラー率**: 4xx/5xxエラーの発生率
- **データベース性能**: クエリ実行時間
- **リソース使用率**: CPU/メモリ使用率

## 拡張性設計

### 水平スケーリング対応
- **ステートレス設計**: セッション情報の外部化
- **データベース分離**: 読み書き分離対応
- **キャッシュ分離**: Redis等の外部キャッシュ

### 機能拡張対応
- **プラグインアーキテクチャ**: 機能の追加・削除容易性
- **API設計**: バージョニング対応
- **データベース**: マイグレーション対応
##
プロダクト開発プロセス設計

### 技術的意思決定フレームワーク
- **ユーザー価値優先**: 技術選択はユーザー体験向上を最優先
- **データドリブン**: A/Bテストや利用データに基づく機能改善
- **段階的リリース**: フィーチャーフラグによる段階的機能展開
- **継続的改善**: ユーザーフィードバックループの確立

### 開発・運用プロセス
- **アジャイル開発**: 2週間スプリントでの継続的デリバリー
- **品質保証**: 自動テスト + コードレビュー + QAテスト
- **監視・分析**: ユーザー行動分析とパフォーマンス監視
- **フィードバック収集**: アプリ内フィードバック機能

### ユーザー体験設計
- **ユーザビリティテスト**: 定期的なユーザビリティ検証
- **アクセシビリティ**: WCAG 2.1準拠のアクセシブルな設計
- **パフォーマンス**: Core Web Vitalsを意識したフロントエンド最適化
- **モバイルファースト**: スマートフォン利用を前提とした設計
