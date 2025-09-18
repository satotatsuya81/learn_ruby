# TypeScript移行におけるワークフロー変化

## 概要
このドキュメントでは、現在のRails ERBベースのシステムから、TypeScript + React基盤へと段階的に移行する際のワークフロー変化について説明します。

## 1. 現在のシステムワークフロー（Rails ERB + Stimulus）

```mermaid
graph TD
    A[ユーザー操作] --> B[ブラウザ]
    B --> C[Rails Router<br/>config/routes.rb]
    C --> D[Business Cards Controller<br/>app/controllers/business_cards_controller.rb]

    D --> E[Active Record Model<br/>app/models/business_card.rb]
    E --> F[PostgreSQL Database]

    D --> G[ERB View<br/>app/views/business_cards/]
    G --> H[HTML + Bootstrap CSS]
    H --> I[Stimulus Controllers<br/>app/javascript/controllers/]
    I --> J[基本的なDOM操作]

    J --> K[レスポンス<br/>HTML + CSS + 少量のJS]
    K --> B

    %% データフロー
    F -.-> E
    E -.-> G

    %% スタイル
    classDef current fill:#e1f5fe
    classDef model fill:#f3e5f5
    classDef view fill:#e8f5e8
    classDef js fill:#fff3e0

    class A,B,C,D,G,H,K current
    class E,F model
    class I,J js
```

### 現在のシステムの特徴
- **サーバーサイドレンダリング**: ERBテンプレートでHTML生成
- **フルページリロード**: 各操作でページ全体を再読み込み
- **最小限のJavaScript**: Stimulusによる基本的なインタラクション
- **型安全性なし**: JavaScriptでの実行時エラーリスク
- **同期的処理**: リクエスト→レスポンス→ページリロード

## 2. TypeScript移行後のワークフロー（Rails API + TypeScript + React）

```mermaid
graph TD
    A[ユーザー操作] --> B[React Component<br/>TypeScript]
    B --> C[State Management<br/>React Hook / Redux]

    C --> D[Type-Safe API Client<br/>app/javascript/utils/api.ts]
    D --> E[CSRF Token処理<br/>Rails統合]
    E --> F[Rails API Controller<br/>業務ロジック + JSON API]

    F --> G[Active Record Model<br/>バリデーション + ビジネスロジック]
    G --> H[PostgreSQL Database]

    F --> I[JSON Response<br/>型定義済み]
    I --> J[TypeScript型検証<br/>実行時型安全性]
    J --> K[React State更新<br/>リアクティブUI]
    K --> L[仮想DOM更新<br/>効率的レンダリング]
    L --> M[UI即座に更新<br/>ページリロードなし]

    %% エラーハンドリング
    N[TypeScript Compiler] --> O[コンパイル時型チェック]
    O --> P[ESLint + Prettier<br/>コード品質保証]

    %% テスト
    Q[Jest + TypeScript] --> R[型安全なユニットテスト]
    R --> S[APIクライアントテスト<br/>spec/javascript/utils/api.spec.ts]

    %% データフロー
    H -.-> G
    G -.-> I
    I -.-> J

    %% 開発フロー
    N -.-> P
    Q -.-> S

    %% スタイル
    classDef react fill:#61dafb,color:#000
    classDef ts fill:#3178c6,color:#fff
    classDef api fill:#ff6b6b,color:#fff
    classDef rails fill:#cc0000,color:#fff
    classDef db fill:#336791,color:#fff
    classDef test fill:#99cc00,color:#000

    class A,B,C,K,L,M react
    class D,J,N,O,P ts
    class E,F,I api
    class G,H db
    class Q,R,S test
```

### TypeScript移行後の特徴
- **クライアントサイドレンダリング**: React Components による動的UI
- **SPA（Single Page Application）**: ページリロードなしの快適な操作感
- **型安全なAPI通信**: TypeScriptによる事前型チェック
- **リアルタイム更新**: 状態管理による即座のUI反映
- **開発体験向上**: コンパイル時エラー検出とIDE支援

## 3. 移行における主要な変化点

### 3.1 データフロー
```mermaid
graph LR
    subgraph "現在（同期）"
        A1[ユーザー操作] --> B1[フォーム送信]
        B1 --> C1[サーバー処理]
        C1 --> D1[ページリロード]
    end

    subgraph "移行後（非同期）"
        A2[ユーザー操作] --> B2[React Event]
        B2 --> C2[API Call]
        C2 --> D2[State Update]
        D2 --> E2[UI Re-render]
    end
```

### 3.2 エラーハンドリング
```mermaid
graph TD
    subgraph "現在のエラー処理"
        A1[実行時エラー] --> B1[ブラウザコンソール]
        B1 --> C1[手動デバッグ]
    end

    subgraph "TypeScript後のエラー処理"
        A2[コンパイル時検証] --> B2[型エラー事前検出]
        B2 --> C2[IDE警告表示]
        C2 --> D2[自動修正提案]

        E2[実行時エラー] --> F2[型安全なエラー情報]
        F2 --> G2[構造化エラーレスポンス]
    end
```

## 4. API Client テスト（spec/javascript/utils/api.spec.ts）の位置付け

### 4.1 テストが担保する品質
```mermaid
graph TD
    A[APIクライアントテスト] --> B[型安全性の保証]
    A --> C[エラーハンドリングの検証]
    A --> D[CSRF統合の確認]
    A --> E[レスポンス形式の検証]

    B --> F[TypeScript型定義との一致]
    C --> G[ネットワークエラー対応]
    D --> H[Rails認証機能との統合]
    E --> I[BusinessCard型との整合性]

    F --> J[実行時エラー防止]
    G --> J
    H --> J
    I --> J
```

### 4.2 開発ワークフローにおける役割
```mermaid
graph LR
    A[REDフェーズ<br/>失敗するテスト作成] --> B[型定義とインターフェース設計]
    B --> C[GREENフェーズ<br/>実装でテスト成功]
    C --> D[REFACTORフェーズ<br/>品質改善]
    D --> E[継続的インテグレーション<br/>自動テスト実行]

    subgraph "品質保証レイヤー"
        F[TypeScript Compiler]
        G[ESLint]
        H[Jest Tests]
        I[型安全なAPI通信]
    end

    B -.-> F
    C -.-> G
    D -.-> H
    E -.-> I
```

## 5. 移行の段階的アプローチ

### Phase 1: TypeScript基盤構築（現在のタスク12）
- TypeScript設定とビルド環境
- 基本型定義（BusinessCard, User等）
- 型安全なAPIクライアント実装
- Jest + TypeScriptテスト環境

### Phase 2: React導入
- 単一コンポーネントからの置き換え開始
- 名刺一覧のReact化
- 状態管理の導入

### Phase 3: 全面移行
- 全ERBビューのReact化
- API化（Rails側のJSON対応）
- リアルタイム機能追加

## 6. 現在のテスト（api.spec.ts）が重要な理由

1. **型安全性の事前保証**: APIの入出力型が正しく定義されているか
2. **Rails統合の確認**: CSRF、認証等のRails機能との連携
3. **エラーハンドリング**: ネットワークエラーやAPIエラーの適切な処理
4. **将来の拡張基盤**: Reactコンポーネントが依存するAPI通信の品質保証

このテストによって、TypeScript移行の最初のステップである「型安全なAPI通信基盤」が確実に動作することを保証し、後続のReact実装時の信頼性を高めます。
