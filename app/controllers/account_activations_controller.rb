class AccountActivationsController < ApplicationController
  def edit
    user = User.find_by(id: params[:id])
    if user && !user.activated? && user.authenticated?(:activation, params[:token])
      user.activate
      log_in user
      flash[:success] = t("account_activations.success")
      redirect_to user
    else
      Rails.logger.warn "Invalid activation attempt for user_id: #{params[:id]}"
      flash[:danger] = t("account_activations.invalid_link")
      redirect_to root_url
    end
  end
end
