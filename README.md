# Business Card Manager

モダンな名刺管理Webアプリケーション

## 🎯 プロジェクト目的

このプロジェクトは、Ruby on Railsを使用した実用的な名刺管理システムの構築を通じて、以下の技術力を実証することを目的としています：

- **Ruby/Rails習得**: Java経験者の効率的な技術移行
- **プロダクト開発思考**: ユーザー価値を重視した機能設計
- **モダン開発手法**: devcontainer、TDD、CI/CDの実践
- **AI協働開発**: Claude Codeを活用した効率的な開発プロセス

## 🏗️ システム概要

### 主要機能

#### 基本機能
- **ユーザー管理**: 認証・認可、プロフィール管理
- **名刺CRUD**: 名刺の登録・編集・削除・一覧表示
- **検索・フィルタリング**: 名前・会社名・タグでの高速検索
- **タグ管理**: 名刺の分類・整理機能
- **画像アップロード**: 名刺写真の保存・表示

#### 高度な機能
- **OCR・自動データ抽出**: 名刺画像からの自動テキスト抽出
- **データ品質管理**: 重複検出・データ補完・品質スコア算出
- **人脈ネットワーク分析**: 関係性可視化・接触履歴管理
- **統計・分析**: ダッシュボード・グラフ表示
- **データエクスポート**: CSV/JSON形式でのデータ出力

#### UI/UX
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **アクセシビリティ**: WCAG 2.1準拠
- **モダンUI**: Bootstrap 5 + Stimulus + React/TypeScript

### 技術スタック

#### バックエンド
- **Ruby**: 3.3 + YJIT（パフォーマンス最適化）
- **Rails**: 7.0
- **データベース**: MySQL 8.0
- **認証**: Rails標準（has_secure_password）
- **ファイルストレージ**: Active Storage（開発）/ AWS S3（本番）

#### フロントエンド
- **基本UI**: Bootstrap 5 + Stimulus
- **ダッシュボード**: React 18 + TypeScript 4.9
- **スタイリング**: Sass + CSS Modules
- **アイコン**: Bootstrap Icons

#### 開発・運用
- **開発環境**: devcontainer（Docker Compose）
- **テスト**: RSpec + FactoryBot + Capybara
- **CI/CD**: GitHub Actions
- **デプロイ**: Heroku（初期）/ AWS（将来）
- **監視**: Rails標準ログ + 外部監視サービス

## 🚀 クイックスタート

### 前提条件
- Docker Desktop
- VS Code + Dev Containers拡張機能

### セットアップ手順

1. **リポジトリのクローン**
```bash
git clone https://github.com/sato-tatsuya/business-card-manager.git
cd business-card-manager
```

2. **VS Codeでdevcontainerを開く**
```bash
code .
# VS Codeで「Reopen in Container」を選択
```

3. **データベースのセットアップ**
```bash
rails db:create
rails db:migrate
rails db:seed
```

4. **アプリケーションの起動**
```bash
rails server
```

5. **ブラウザでアクセス**
```
http://localhost:3000
```

### テスト実行
```bash
# 全テスト実行
bundle exec rspec

# 特定のテスト実行
bundle exec rspec spec/models/
bundle exec rspec spec/controllers/
bundle exec rspec spec/system/
```

## 📊 プロジェクト進捗

### 開発フェーズ

- [x] **フェーズ1**: 開発環境構築とプロジェクト基盤
- [ ] **フェーズ2**: 認証・ユーザー管理機能
- [ ] **フェーズ3**: 名刺管理基本機能
- [ ] **フェーズ4**: タグ管理機能
- [ ] **フェーズ5**: 検索・フィルタリング機能
- [ ] **フェーズ6**: 画像アップロード機能
- [ ] **フェーズ7**: OCR・自動データ抽出機能
- [ ] **フェーズ8**: データ品質管理機能
- [ ] **フェーズ9**: 統計・分析機能
- [ ] **フェーズ10**: データエクスポート機能
- [ ] **フェーズ11**: UI/UX改善・レスポンシブ対応
- [ ] **フェーズ12**: API実装
- [ ] **フェーズ13**: テスト実装
- [ ] **フェーズ14**: セキュリティ・パフォーマンス対策
- [ ] **フェーズ15**: デプロイメント・運用

### 主要マイルストーン

- **MVP完成**: 基本的な名刺CRUD機能（フェーズ1-3）
- **検索機能完成**: 高度な検索・フィルタリング（フェーズ4-5）
- **画像機能完成**: アップロード・OCR機能（フェーズ6-7）
- **分析機能完成**: 統計・ネットワーク分析（フェーズ8-9）
- **本番リリース**: 全機能完成・デプロイ（フェーズ10-15）

## 🎓 学習・技術実証要素

### Ruby/Rails習得実証
- **Java → Ruby移行**: 5年のJava経験を活かした効率的学習
- **Rails Way習得**: Convention over Configurationの実践
- **ActiveRecord活用**: ORM設計・クエリ最適化
- **テスト駆動開発**: RSpecによる包括的テスト実装

### プロダクト開発思考
- **ユーザー価値重視**: 実用的な機能設計による価値提供
- **データドリブン**: 統計・分析機能による意思決定支援
- **継続的改善**: フィードバックループの設計
- **スケーラビリティ**: 大規模データ処理への対応

### モダン開発手法
- **devcontainer**: Docker による開発環境統一
- **AI協働開発**: Claude Code活用による効率化
- **CI/CD**: 自動テスト・デプロイパイプライン
- **アジャイル**: 段階的リリース・継続的デリバリー

## 🔗 関連リンク

- **開発ドキュメント**: [DEVELOP.md](DEVELOP.md)
- **要件定義書**: [.kiro/specs/namecard-manager/requirements.md](.kiro/specs/namecard-manager/requirements.md)
- **設計書**: [.kiro/specs/namecard-manager/design.md](.kiro/specs/namecard-manager/design.md)
- **タスクリスト**: [.kiro/specs/namecard-manager/tasks.md](.kiro/specs/namecard-manager/tasks.md)
- **学習記録**: [dev/learning/](dev/learning/)
- **技術比較**: [dev/comparison/](dev/comparison/)

## 📞 連絡先

**開発者**: 佐藤辰哉  
**GitHub**: https://github.com/sato-tatsuya  
**開発期間**: 2025年9月11日〜継続中

## 📄 ライセンス

このプロジェクトは学習・技術実証目的で作成されています。