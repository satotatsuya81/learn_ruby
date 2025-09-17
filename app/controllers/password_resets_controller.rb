class PasswordResetsController < ApplicationController
  before_action :get_user, only: [ :edit, :update ]
  before_action :valid_user, only: [ :edit, :update ]
  before_action :check_expiration, only: [ :edit, :update ]

  # GET /password_resets/new
  def new
    @user = User.new
  end

  # POST /password_resets
  def create
    @user = User.find_by(email: params[:password_reset][:email].downcase)
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      flash[:info] = t("password_resets.email_sent")
      redirect_to root_url
    else
      flash.now[:danger] = t("password_resets.email_not_found")
      render :new, status: :unprocessable_content
    end
  end

  # GET /password_resets/:id/edit?email=...
  def edit
  end

  # PATCH /password_resets/:id
  def update
    if params[:user][:password].empty?
      @user.errors.add(:password, t("password_resets.password_empty"))
      render :edit, status: :unprocessable_content
    elsif @user.update(user_params)
      log_in @user
      @user.update_columns(reset_digest: nil, reset_sent_at: nil)
      flash[:success] = t("password_resets.password_updated")
      redirect_to @user
    else
      render :edit, status: :unprocessable_content
    end
  end

  private

  # Strong Parameters - セキュリティのために許可するパラメータを制限
  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  # リセット対象ユーザーの取得
  def get_user
    @user = User.find(params[:id])
  end

  # トークン検証 - セキュリティ要件
  def valid_user
    unless @user && @user.authenticated?(:reset, params[:token])
      redirect_to root_url
    end
  end

  # 有効期限チェック - セキュリティ要件
  def check_expiration
    if @user.password_reset_expired?
      flash[:danger] = t("password_resets.password_reset_expired")
      redirect_to new_password_reset_url
    end
  end
end
