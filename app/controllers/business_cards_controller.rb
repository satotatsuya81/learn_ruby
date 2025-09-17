class BusinessCardsController < ApplicationController
  before_action :require_login
  before_action :set_business_card, only: [ :show ]

  # GET /business_cards
  # 現在ログインしているユーザーの名刺一覧を表示
  def index
    @business_cards = current_user.business_cards
  end

  # GET /business_cards/1
  # 指定された名刺の詳細を表示（自分の名刺のみアクセス可能）
  def show
    @similar_cards = current_user.business_cards
                                .where(company_name: @business_card.company_name)
                                .where.not(id: @business_card.id)
                                .limit(3)
  end

  private

  # ログインが必要なページへのアクセス制限
  def require_login
    unless logged_in?
      redirect_to login_path
    end
  end

  # 指定されたIDの名刺を取得し、ユーザーの権限をチェック
  def set_business_card
    @business_card = current_user.business_cards.find_by(id: params[:id])
    unless @business_card
      redirect_to root_path
    end
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path
  end
end
