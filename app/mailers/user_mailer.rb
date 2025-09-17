class UserMailer < ApplicationMailer
  default from: "noreply@example.com"

  # アカウント有効化メールの送信
  def activation_email(user)
    @user = user
    mail(
      to: @user.email,
      subject: t("user_mailer.activation_email.subject"))
  end
  # パスワードリセットメールの送信
  def password_reset(user)
    @user = user
    @reset_token = user.reset_token
    mail(
      to: user.email,
      subject: t("user_mailer.password_reset.subject")
    )
  end
end
