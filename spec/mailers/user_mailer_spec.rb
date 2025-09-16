require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  describe "activation_email" do
    let(:user) { create(:user) }
    let(:mail) { UserMailer.activation_email(user) }

    before do
      # アクティベーションメール送信前にトークンを生成
      user.activation_email
    end

    it "正しい宛先に送信されること" do
      expect(mail.to).to eq([ user.email ])
    end

    it "正しい送信元アドレスで送信されること" do
      expect(mail.from).to eq([ "noreply@example.com" ])
    end

    it "正しい件名で送信されること" do
      expect(mail.subject).to eq(I18n.t("user_mailer.activation_email.subject"))
    end

    it "テキスト版メール本文にユーザ名が含まれること" do
      expect(mail.text_part.body.to_s).to include(user.name)
    end

    it "HTML版メール本文にユーザ名が含まれること" do
      expect(mail.html_part.body.to_s).to include(user.name)
    end

    it "テキスト版メール本文にアクティベーションリンクが含まれること" do
      expect(mail.text_part.body.to_s).to include("account_activations")
      expect(mail.text_part.body.to_s).to include(user.activation_token)
    end

    it "HTML版メール本文にアクティベーションリンクが含まれること" do
      expect(mail.html_part.body.to_s).to include("account_activations")
      expect(mail.html_part.body.to_s).to include(user.activation_token)
    end

    it "テキスト版メール本文に無視メッセージが含まれること" do
      expect(mail.text_part.body.to_s).to include(I18n.t("user_mailer.activation_email.ignore_message"))
    end

    it "HTML版メール本文に無視メッセージが含まれること" do
      expect(mail.html_part.body.to_s).to include(I18n.t("user_mailer.activation_email.ignore_message"))
    end
  end
end
