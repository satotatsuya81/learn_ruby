class SessionsController < ApplicationController
  def new
    # ログインフォーム画面（追加されたテスト用）
  end

  def create
    # テストで要求されているログイン処理の最小実装
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password])
      # ログイン成功時の処理
      log_in(user)  # セッションにユーザーIDを保存
      flash[:notice] = "ログインしました"
      redirect_to root_path
    else
      # ログイン失敗時の処理（追加されたテストに対応）
      flash.now[:alert] = "メールアドレスまたはパスワードが正しくありません"
      render :new, status: :unprocessable_entity
    end
  end
end
