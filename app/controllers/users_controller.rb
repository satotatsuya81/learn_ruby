class UsersController < ApplicationController
  # ユーザ登録フォームを表示
  def new
    @user = User.new
  end

  # ユーザ登録処理
  def create
    @user = User.new(user_params)
    if @user.save
      # ユーザ登録成功時の処理（例: ログイン、リダイレクトなど）
      @user.activation_email
      flash[:info] = t("users.check_email_for_activation")

      respond_to do |format|
        format.html { redirect_to root_url }
        format.json { render json: { message: t("users.check_email_for_activation") }, status: :created }
      end
    else
      # ユーザ登録失敗時の処理（例: フォームの再表示,精査エラー）
      respond_to do |format|
        format.html { render "new", status: :unprocessable_content }
        format.json { render json: { errors: @user.errors.full_messages }, status: :unprocessable_content }
      end
    end
  end

  # ユーザ情報の表示
  def show
    @user = User.find(params[:id])
    redirect_to root_url unless @user.activated?
  rescue ActiveRecord::RecordNotFound
    # 存在しないユーザーIDが指定された場合の安全な処理
    flash[:danger] = t("users.user_not_found")
    redirect_to root_url
  end

  # 現在ログイン中のユーザー情報を返すAPI（TypeScript フロントエンド用）
  def current
    if logged_in?
      respond_to do |format|
        format.json { render json: { data: current_user, success: true } }
      end
    else
      respond_to do |format|
        format.json { render json: { success: false, error: "Not authenticated" }, status: :unauthorized }
      end
    end
  end

  private

  # Strong Parameters：許可するパラメータを限定
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
