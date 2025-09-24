// TypeScript版 Stimulus Controllers インデックス
// Rails 7のStimulusコントローラーをTypeScript化する際の基盤ファイル

// Stimulusコントローラーの自動読み込み設定
import { application } from "@/controllers/application";

// React統合のためのStimulusコントローラー
import BusinessCardFormController from "@/controllers/business_card_form_controller"
import BusinessCardDetailController from "@/controllers/business_card_detail_controller"
import HomePageController from "@/controllers/home_page_controller"
import UserProfileController from "@/controllers/user_profile_controller"

// コントローラーの登録
application.register("business-card-form", BusinessCardFormController)
application.register("business-card-detail", BusinessCardDetailController)
application.register("home-page", HomePageController)
application.register("user-profile", UserProfileController)

// デバッグモードの設定
application.debug = true
window.Stimulus = application

export { application };
