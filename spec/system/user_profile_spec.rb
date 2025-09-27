require 'rails_helper'

RSpec.describe "User Profile", type: :system, js: true do
  let(:activated_user) { create(:user, activated: true) }
  let(:unactivated_user) { create(:user, activated: false) }

  describe "ユーザ取得機能" do
    context "有効化済みユーザーの場合" do
      before do
        # 実際のログイン処理を追加
        visit login_path
        fill_in I18n.t('authentication.login.email_label'), with: activated_user.email
        fill_in I18n.t('authentication.login.password_label'), with: 'password123'  # FactoryBotのパスワードに修正
        click_button I18n.t('authentication.login.submit_button')
        # ログイン成功を確認
        expect(page).to have_current_path(root_path)
      end
      it "GET /users/:id で有効化済みユーザーのプロフィールが表示されること" do
        with_locale(:ja) do
          visit user_path(activated_user)
          expect(page).to have_current_path(user_path(activated_user))
          expect(page).to have_title(activated_user.name)
          expect(page).to have_content(activated_user.email)
        end
      end
    end
    describe "未有効化ユーザーの場合" do
      it "GET /users/:id でトップページにリダイレクトされること" do
        with_locale(:ja) do
          visit user_path(unactivated_user)
          expect(page).to have_current_path(login_path)
        end
      end
    end

    describe "存在しないユーザーの場合" do
      it "GET /users/:id でトップページにリダイレクトされること" do
        with_locale(:ja) do
          visit user_path(99999) # 存在しないユーザーIDを指定
          expect(page).to have_current_path(login_path)
          # フラッシュメッセージの確認
          expect(page).to have_content(I18n.t("users.user_not_found"))
        end
      end
    end
  end
end
