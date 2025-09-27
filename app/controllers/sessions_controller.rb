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

        respond_to do |format|
          format.html { redirect_to root_path }
          format.json {
            render json: {
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                activated: user.activated
              },
              success: true,
              message: "ログインに成功しました"
            }, status: :ok
          }
        end
      else
        # 未有効化ユーザーの場合
        error_message = t("authentication.login.account_not_activated")
        respond_to do |format|
          format.html do
            flash.now[:danger] = error_message
            render :new, status: :unprocessable_content
          end
          format.json {
            render json: {
              error: error_message,
              details: { account: [ "アカウントが有効化されていません" ] }
            }, status: :unprocessable_content
          }
        end
      end
    else
      # ログイン失敗時の処理（テストで期待される日本語メッセージ）
      error_message = t("authentication.login.invalid_credentials")
      respond_to do |format|
        format.html do
          flash.now[:danger] = error_message
          render :new, status: :unprocessable_content
        end
        format.json {
          render json: {
            error: error_message,
            details: { credentials: [ "メールアドレスまたはパスワードが正しくありません" ] }
          }, status: :unprocessable_content
        }
      end
    end
  end

  def destroy
    # ログアウト処理の実装
    log_out if logged_in?
    respond_to do |format|
      format.html { redirect_to root_url }
      format.json {
        render json: {
          success: true,
          message: "ログアウトしました"
        }, status: :ok
      }
    end
  end
end
