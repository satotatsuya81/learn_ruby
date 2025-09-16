class UserMailer < ApplicationMailer
  default from: "noreply@example.com"

  def activation_email(user)
    @user = user
    mail(to: @user.email, subject: t("user_mailer.account_activation.subject"))
  end
end
