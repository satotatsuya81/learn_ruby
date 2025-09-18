// TypeScript版 Stimulus Controllers インデックス
// Rails 7のStimulusコントローラーをTypeScript化する際の基盤ファイル

// Stimulusコントローラーの自動読み込み設定
import { application } from "./application";

// 既存のStimulusコントローラーを段階的にTypeScript化する際の
// import文をここに追加していく予定

// 例：将来のTypeScript Stimulusコントローラー
// import BusinessCardController from "./business_card_controller"
// import SearchController from "./search_controller"

// コントローラーの登録
// application.register("business-card", BusinessCardController)
// application.register("search", SearchController)

// TypeScript移行完了の目安：
// - 全てのStimulusコントローラーがTypeScript化されている
// - 型安全なDOMアクセスが実装されている
// - イベントハンドリングが型定義されている

export { application };