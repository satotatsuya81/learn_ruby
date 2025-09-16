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
      @user.send_activation_email
      flash[:info] = t("users.check_email_for_activation")
      redirect_to root_url
    else
      # ユーザ登録失敗時の処理（例: フォームの再表示,精査エラー）
      render "new", status: :unprocessable_content
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

  private

  # Strong Parameters：許可するパラメータを限定
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
