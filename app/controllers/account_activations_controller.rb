class AccountActivationsController < ApplicationController
  # GET /account_activations/:id/edit?token=...
  def edit
    user = User.find_by(id: params[:id])
    if user && user.authenticated?(:activation, params[:token])
      if user.activated?
        flash[:info] = t("user_mailer.activation_email.already_activated")
        redirect_to root_url
        return
      end
      user.activate
      log_in user
      flash[:success] = t("user_mailer.activation_email.success")
      redirect_to user
    else
      Rails.logger.warn "Invalid activation attempt for user_id: #{params[:id]}"
      flash[:danger] = t("user_mailer.activation_email.invalid_link")
      redirect_to root_url
    end
  end
end
