// TypeScript版 Stimulus Controllers インデックス
// Rails 7のStimulusコントローラーをTypeScript化する際の基盤ファイル

// Stimulusコントローラーの自動読み込み設定
import { application } from "./application";

// React統合のためのStimulusコントローラー
import BusinessCardFormController from "./business_card_form_controller"
import BusinessCardDetailController from "./business_card_detail_controller"
import HomePageController from "./home_page_controller"
import UserProfileController from "./user_profile_controller"

// コントローラーの登録
application.register("business-card-form", BusinessCardFormController)
application.register("business-card-detail", BusinessCardDetailController)
application.register("home-page", HomePageController)
application.register("user-profile", UserProfileController)

// デバッグモードの設定
application.debug = true
window.Stimulus = application

// TypeScript移行完了の目安：
// - 全てのStimulusコントローラーがTypeScript化されている
// - 型安全なDOMアクセスが実装されている
// - イベントハンドリングが型定義されている

export { application };
