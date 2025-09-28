# Business Card Manager - ドキュメント改善 TODO リスト

作成日: 2025年9月28日
参照: `docs/PROJECT_STATUS_AND_DOCUMENTATION_PLAN.md`

## 📋 Phase 1: 緊急修正 (即座実施) 🔴

### 1. README.md更新 - 最優先
- [x] **現状の問題修正**: 「企画段階」記載を実際の実装状況に修正
- [x] **プロジェクト状況セクション更新**:
- [x] **主要機能セクション更新**:
- [x] **セットアップ手順の最新化**:
  ```markdown
  ## 🚀 プロジェクト状況
  - [x] **完成**: 基本的な名刺管理システム（認証・CRUD）
  - [x] **完成**: React/TypeScript統合
  - [x] **完成**: インタラクティブ機能
  - [ ] **実装中**: 高度機能（OCR、エクスポート、分析）
  ```
- [x] **セットアップ手順を実際の手順に修正**
- [x] **技術スタック情報更新** (Rails 8.0、完成済み機能の反映)

### 2. 古いタスクファイル削除
- [x] `.kiro/specs/namecard-manager/task-2.md` ～ `task-13.md` (12ファイル、約2,500行) 削除
- [x] `.kiro/specs/namecard-manager/task-tests.md` (164行) 削除

### 3. TypeScript移行ドキュメント削除
- [x] `TYPESCRIPT_MIGRATION.md` 削除
- [x] `docs/ruby-typescript-migration-scope.md` 削除
- [x] `docs/typescript-migration-workflow.md` 削除

## 📋 Phase 2: 重要更新 (1週間以内) 🟡

### 1. CLAUDE.md更新
- [x] **プロジェクト概要セクション更新**: 「企画段階」から実装済み状況に修正
- [x] **開発コマンドセクション更新**: 実際の利用可能コマンドに修正
  - `rails server` - 開発サーバーの起動
  - `bundle exec rspec` - テストの実行
  - `rails db:create db:migrate db:seed` - データベースのセットアップ
- [x] **主要機能セクション更新**: 実装済み機能と未実装機能の明確化

### 2. API.md新規作成
- [x] **ファイル作成**: `/workspace/docs/API.md`
- [x] **認証API仕様書作成**:
  - POST /login - ログイン
  - DELETE /logout - ログアウト
  - GET /current_user - 現在のユーザー情報
- [x] **名刺管理API仕様書作成**:
  - GET /business_cards - 名刺一覧
  - POST /business_cards - 名刺作成
  - GET /business_cards/:id - 名刺詳細
  - PATCH /business_cards/:id - 名刺更新
  - DELETE /business_cards/:id - 名刺削除

### 3. TESTING.md新規作成
- [x] **ファイル作成**: `/workspace/docs/TESTING.md`
- [x] **テスト実行方法記載**:
  - `bundle exec rspec` - Ruby/Railsテスト
  - `npm test` - JavaScript/TypeScriptテスト
  - `npm run test:coverage` - カバレッジ付きテスト
- [x] **テスト構造説明**:
  - `spec/models/` - モデルテスト
  - `spec/requests/` - APIテスト
  - `spec/system/` - E2Eテスト
  - `spec/javascript/` - フロントエンドテスト

## 📋 Phase 3: 補完更新 (2週間以内) 🟢

### 1. DEVELOP.md更新
- [ ] **技術スタック更新**: Rails 7.0 → Rails 8.0
- [ ] **TypeScript統合プロセス更新**: 統合済みの現状反映
- [ ] **実際のテスト実行方法更新**: 現在の開発フローに合わせた修正

### 2. 要件定義・設計書の微調整
- [ ] `requirements.md` の実装済み機能マーキング
- [ ] `design.md` の実装差分確認と更新

## 📁 保持対象ドキュメント

以下は**削除せず保持**:
- `.kiro/specs/namecard-manager/requirements.md` - 要件定義として価値あり
- `.kiro/specs/namecard-manager/design.md` - システム設計として価値あり
- `.kiro/specs/namecard-manager/learning-notes/` - 学習記録として価値あり

## 📊 期待効果

### ドキュメント量の最適化
- **削除**: 約2,500行の古いタスクファイル
- **更新**: 3つの主要ドキュメント
- **追加**: 3つの実用ドキュメント
- **結果**: 総量50%削減、実用性200%向上

### 開発効率の向上
- 新規参加者のオンボーディング時間短縮
- 実装済み機能の正確な把握
- 現実的なセットアップ手順による環境構築成功率向上

### プロジェクトの信頼性向上
- ドキュメントと実装の一致による信頼性向上
- 実用アプリケーションとしての適切なポジショニング
- 技術実証プロジェクトとしての価値の明確化

---

**作成者**: Claude Code
**参照資料**: `docs/PROJECT_STATUS_AND_DOCUMENTATION_PLAN.md`
**次のステップ**: Phase 1の実施から開始
