class BusinessCardsController < ApplicationController
  before_action :require_login
  before_action :set_business_card, only: [ :show, :edit, :update, :destroy ]

  # GET /business_cards
  # 現在ログインしているユーザーの名刺一覧を表示
  def index
    @business_cards = current_user.business_cards

    respond_to do |format|
      format.html
      format.json { render json: { business_cards: @business_cards } }
    end
  end

  # GET /business_cards/1
  # 指定された名刺の詳細を表示（自分の名刺のみアクセス可能）
  def show
    @similar_cards = current_user.business_cards
                                .where(company_name: @business_card.company_name)
                                .where.not(id: @business_card.id)
                                .limit(3)
  end

  # GET /business_cards/new
  # 新規名刺作成フォームを表示
  def new
      @business_card = current_user.business_cards.build
  end

  # POST /business_cards
  # 名刺作成処理
  def create
    @business_card = current_user.business_cards.build(business_card_params)

    if @business_card.save
      flash[:success] = t("business_cards.messages.created_successfully")
      # 成功時: 名刺一覧ページにリダイレクト & 成功メッセージ表示
      redirect_to business_cards_path
    else
      # 失敗時: 新規作成フォームを再表示（エラーメッセージ付き）
      render :new, status: :unprocessable_content
    end
  end

  # GET /business_cards/:id/edit
  # 名刺編集フォームを表示
  def edit
  end

  # PATCH/PUT /business_cards/:id
  # 名刺更新処理
  def update
    if @business_card.update(business_card_params)
      flash[:success] = t("business_cards.messages.updated_successfully")

      respond_to do |format|
        format.html { redirect_to @business_card }
        format.json { render json: { success: true, business_card: @business_card } }
      end
    else
      # 失敗時: 編集フォームを再表示（エラーメッセージ付き）
      respond_to do |format|
        format.html { render :edit, status: :unprocessable_content }
        format.json { render json: { success: false, errors: @business_card.errors.full_messages }, status: :unprocessable_contents }
      end
    end
  end

  # DELETE /business_cards/:id
  # 名刺削除処理
  def destroy
    respond_to do |format|
      if @business_card.destroy
        format.html do
          flash[:success] = t("business_cards.messages.deleted_successfully")
          redirect_to business_cards_path
        end
        format.json do
          flash[:success] = t("business_cards.messages.deleted_successfully")
          render json: { success: true, message: t("business_cards.messages.deleted_successfully") }
        end
      else
        format.html do
          flash[:alert] = t("business_cards.messages.delete_failed")
          redirect_to business_cards_path
        end
        format.json { render json: { success: false, errors: @business_card.errors.full_messages }, status: :unprocessable_contents }
      end
    end
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
      flash[:error] = t("business_cards.messages.not_found")
      redirect_to root_path
    end
  rescue ActiveRecord::RecordNotFound
    flash[:error] = t("business_cards.messages.not_found")
    redirect_to root_path
  end

  # Strong Parameters: 許可するパラメータを明示的に定義
  def business_card_params
    params.require(:business_card).permit(:name, :company_name, :job_title, :department, :email, :phone, :mobile, :address, :website, :notes)
  end
end
