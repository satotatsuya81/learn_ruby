class SessionsController < ApplicationController
  def new
    # ログインフォーム画面（追加されたテスト用）
  end

  def create
    # テストで要求されているログイン処理の実装
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password])
      if user.activated?
        # ログイン成功時の処理
        log_in(user)  # セッションにユーザーIDを保存
        # Remember Me機能の実装
        params[:session][:remember_me] == "1" ? remember(user) : forget(user)
        redirect_to root_path
      else
        # 未有効化ユーザーの場合
        flash.now[:danger] = t("authentication.login.account_not_activated")
        render :new, status: :unprocessable_content
      end
    else
      # ログイン失敗時の処理（テストで期待される日本語メッセージ）
      flash.now[:danger] = t("authentication.login.invalid_credentials")
      render :new, status: :unprocessable_content
    end
  end

  def destroy
    # ログアウト処理の実装
    log_out if logged_in?
    redirect_to root_url
  end
end
