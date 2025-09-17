require 'rails_helper'

RSpec.describe "Account Activation", type: :system do
  before do
    driven_by(:rack_test)
  end
  let(:user) { create(:user, activated: false) }

  describe "アカウント有効化の成功シナリオ" do
    context "有効なトークンとユーザーIDの場合" do
      it "アカウントが有効化されること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_current_path(user_path(user))
          expect(page).to have_content(I18n.t("user_mailer.activation_email.success"))
          expect(user.reload.activated?).to be_truthy
        end
      end

      it "ログイン状態になること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_button(I18n.t("navigation.logout"))
        end
      end

      it "有効化成功時にユーザープロフィールページにリダイレクトされること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_current_path(user_path(user))
        end
      end

      it "フラッシュメッセージが表示されること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_content(I18n.t("user_mailer.activation_email.success"))
        end
      end
    end
  end

  describe "アカウント有効化の失敗シナリオ" do
    context "無効なトークンの場合" do
      it "アカウントが有効化されないこと" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: 'invalidtoken')
          expect(page).to have_current_path(root_path)
          expect(page).to have_content(I18n.t("user_mailer.activation_email.invalid_link"))
          expect(user.reload.activated?).to be_falsey
        end
      end

      it "ログインリンクが表示されること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: 'invalidtoken')
          expect(page).to have_link(I18n.t("navigation.login"))
        end
      end

      it "フラッシュメッセージが表示されること" do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: 'invalidtoken')
          expect(page).to have_content(I18n.t("user_mailer.activation_email.invalid_link"))
        end
      end
    end

    context "既に有効化済みのアカウントで再度有効化を試みた場合" do
      it "ルートページにリダイレクトされること" do
        user.activate  # ユーザーを有効化済みにする
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_current_path(root_path)
        end
      end

      it "ログインリンクが表示されること" do
        user.activate  # ユーザーを有効化済みにする
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_link(I18n.t("navigation.login"))
        end
      end

      it "フラッシュメッセージが表示されること" do
        user.activate  # ユーザーを有効化済みにする
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit edit_account_activation_path(id: user.id, token: user.activation_token)
          expect(page).to have_content(I18n.t("user_mailer.activation_email.already_activated"))
        end
      end
    end
  end
end
