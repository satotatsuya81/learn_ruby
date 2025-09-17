require 'rails_helper'

RSpec.describe "ユーザー登録", type: :system do
  before do
      driven_by(:rack_test)
  end

  describe "ユーザー登録フォーム" do
    it "GET /signup でユーザー登録ページが表示されること" do
      visit signup_path
      expect(page).to have_http_status(:success)
      expect(page).to have_content(I18n.t("users.sign_up"))
      expect(page).to have_field(I18n.t("users.name"))
      expect(page).to have_field(I18n.t("users.email"))
      expect(page).to have_field(I18n.t("users.password"))
      expect(page).to have_field(I18n.t("users.password_confirmation"))
      expect(page).to have_button(I18n.t("users.create_account"))

      # フォームバリデーション属性の確認
      expect(page).to have_css("input[name='user[name]'][required]")
      expect(page).to have_css("input[name='user[email]'][type='email'][required]")
      expect(page).to have_css("input[name='user[password]'][type='password'][required]")
      expect(page).to have_css("input[name='user[password_confirmation]'][type='password'][required]")
    end
  end

  describe "ユーザー登録処理" do
    context "有効なパラメータの場合" do
      let(:valid_params) do
        {
          user: {
            name: "Example User",
            email: "user@example.com",
            password: "password",
            password_confirmation: "password"
          }
        }
      end
      it "新しいユーザが作成され、アカウント有効化メールが送信されること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit signup_path

          expect(page.title).to include(I18n.t('users.sign_up'))
          fill_in I18n.t('users.name'), with: valid_params[:user][:name]
          fill_in I18n.t('users.email'), with: valid_params[:user][:email]
          fill_in I18n.t('users.password'), with: valid_params[:user][:password]
          fill_in I18n.t('users.password_confirmation'), with: valid_params[:user][:password_confirmation]
          click_button I18n.t('users.create_account')

          expect(page).to have_current_path(root_path)
          expect(page).to have_content(I18n.t("users.check_email_for_activation"))
          expect(ActionMailer::Base.deliveries.size).to eq(1)
          expect(ActionMailer::Base.deliveries.first.to).to include(valid_params[:user][:email])
        end
      end
    end

    context "無効なパラメータの場合" do
      let(:invalid_params) do
        {
          user: {
            name: "",
            email: "invalid_email",
            password: "short",
            password_confirmation: "mismatch"
          }
        }
      end

      it "ユーザ登録に失敗し、エラーメッセージが表示されること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit signup_path

          expect(page.title).to include(I18n.t('users.sign_up'))
          fill_in I18n.t('users.name'), with: invalid_params[:user][:name]
          fill_in I18n.t('users.email'), with: invalid_params[:user][:email]
          fill_in I18n.t('users.password'), with: invalid_params[:user][:password]
          fill_in I18n.t('users.password_confirmation'), with: invalid_params[:user][:password_confirmation]
          click_button I18n.t('users.create_account')

          expect(page).to have_current_path(users_path) # フォームが再表示されることを確認
          expect(page).to have_content(I18n.t("activerecord.errors.messages.blank"))
          expect(page).to have_content(I18n.t("activerecord.errors.messages.invalid"))
          expect(page).to have_content(I18n.t("activerecord.errors.messages.too_short", count: 6))
          expect(page).to have_content(I18n.t("activerecord.errors.messages.confirmation", attribute: I18n.t("users.password")))
        end
      end
    end
  end
end
