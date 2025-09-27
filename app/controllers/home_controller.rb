class HomeController < ApplicationController
  def index
    # 未ログインユーザーはログインページにリダイレクト
    unless logged_in?
      redirect_to login_path
      return
    end

    @page_title = "Home"

    # ホームページで表示する統計データを設定（現在のユーザーの名刺のみ）
    @total_business_cards = current_user.business_cards.count
    @companies_count = current_user.business_cards.distinct.count(:company_name)
    @last_updated = current_user.business_cards.maximum(:updated_at)&.strftime("%Y年%m月%d日") || "未更新"
  rescue StandardError => e
    # エラーが発生した場合はデフォルト値を設定
    Rails.logger.error "HomeController#index error: #{e.message}"
    @total_business_cards = 0
    @companies_count = 0
    @last_updated = "未更新"
  end
end
