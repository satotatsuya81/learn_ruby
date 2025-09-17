require 'rails_helper'

RSpec.describe "Password Reset", type: :system do
  before do
    driven_by(:rack_test)
  end
  let(:user) { create(:user, :activated) }

  describe "パスワードリセット用メール送信機能" do
    it "有効なメールアドレスでリセットリンク送信" do
      visit login_path
      click_link I18n.t("password_resets.forgot_password")

      fill_in I18n.t("activerecord.attributes.user.email"), with: user.email
      click_button I18n.t("user_mailer.password_reset.send_email_button")

      expect(page).to have_content(I18n.t("password_resets.email_sent"))
      expect(ActionMailer::Base.deliveries.size).to eq(1)

      user.reload
      expect(user.reset_digest).not_to be_nil
      expect(user.reset_sent_at).not_to be_nil
    end

    it "無効なメールアドレスでエラーメッセージ表示" do
      visit login_path
      click_link I18n.t("password_resets.forgot_password")

      fill_in I18n.t("activerecord.attributes.user.email"), with: "invalid@example.com"
      click_button I18n.t("user_mailer.password_reset.send_email_button")

      expect(page).to have_content(I18n.t("password_resets.email_not_found"))
      expect(ActionMailer::Base.deliveries.size).to eq(0)
      # データベースが変更されていないことを確認
      user.reload
      expect(user.reset_digest).to be_nil
    end

    it "空のメールアドレスでエラーメッセージ表示" do
      visit login_path
      click_link I18n.t("password_resets.forgot_password")

      fill_in I18n.t("activerecord.attributes.user.email"), with: ""
      click_button I18n.t("user_mailer.password_reset.send_email_button")

      # ブラウザバリデーションによりページが遷移しないことを確認
      expect(page).to have_current_path(password_resets_path)
      expect(ActionMailer::Base.deliveries.size).to eq(0)
      # データベースが変更されていないことを確認
      user.reload
      expect(user.reset_digest).to be_nil
    end
  end

  describe "パスワードリセットの実行機能" do
    before do
      user.create_reset_digest
    end
    it "有効なトークンとユーザーIDでパスワードリセット成功" do
      visit edit_password_reset_path(user.id, token: user.reset_token)

      fill_in I18n.t("password_resets.password"), with: "newpassword"
      fill_in I18n.t("password_resets.password_confirmation"), with: "newpassword"
      click_button I18n.t("password_resets.update_password")

      expect(page).to have_current_path(user_path(user))
      expect(page).to have_content(I18n.t("password_resets.password_updated"))
      expect(user.reload.authenticate("newpassword")).to be_truthy

      user.reload
      expect(user.reset_digest).to be_nil

      click_button I18n.t("navigation.logout")

      click_link I18n.t("navigation.login")
      fill_in I18n.t('authentication.login.email_label'), with: user.email
      fill_in I18n.t('authentication.login.password_label'), with: "newpassword"
      click_button I18n.t('authentication.login.submit_button')
      expect(page).to have_current_path(root_path)
    end

    it "無効なトークンでパスワードリセット失敗" do
      # 無効なトークンでアクセス
      visit edit_password_reset_path(user.id, token: "invalid_token")

      # ルートページにリダイレクトされることを確認
      expect(page).to have_current_path(root_path)
    end

    it "パスワードと確認用パスワードが不一致でエラーメッセージ表示" do
      visit edit_password_reset_path(user.id, token: user.reset_token)

      fill_in I18n.t("password_resets.password"), with: "newpassword"
      fill_in I18n.t("password_resets.password_confirmation"), with: "mismatch"
      click_button I18n.t("password_resets.update_password")

      expect(page).to have_content(I18n.t("activerecord.errors.messages.confirmation", attribute: I18n.t("activerecord.attributes.user.password")))
    end

    it "空のパスワードでエラーメッセージ表示" do
      visit edit_password_reset_path(user.id, token: user.reset_token)

      fill_in I18n.t("password_resets.password"), with: ""
      fill_in I18n.t("password_resets.password_confirmation"), with: ""
      click_button I18n.t("password_resets.update_password")

      expect(page).to have_content(I18n.t("activerecord.errors.messages.blank"))
    end

    it "期限切れトークンでリセットページにリダイレクトされる" do
      # トークン発行から3時間以上経過させる
      # 3時間1秒後に時間を進める
      travel_to 3.hours.from_now + 1.seconds do
        visit edit_password_reset_path(user.id, token: user.reset_token)
        expect(page).to have_current_path(new_password_reset_path)
        expect(page).to have_content(I18n.t("password_resets.password_reset_expired"))
      end
    end
  end
  describe "ログインページからのアクセス" do
    it "ログインページにパスワードリセットリンクが存在すること" do
      visit login_path
      click_link I18n.t("password_resets.forgot_password")
      expect(page).to have_current_path(new_password_reset_path)
      expect(page).to have_title(I18n.t("password_resets.reset_password"))
    end
  end
end
