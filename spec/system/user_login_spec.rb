require 'rails_helper'

RSpec.describe "User Login", type: :system do
  before do
    driven_by(:rack_test)
  end

  let(:user) { create(:user, email: "user@example.com", password: "password", password_confirmation: "password", name: "Test User") }

  describe "ログイン機能" do
    context "有効な情報でログインする場合" do
      it "ログインに成功し、ダッシュボードにリダイレクトすること" do
        visit login_path

        # ページタイトルが正しいことを確認
        expect(page).to have_title("Log in")

        # フォームに情報を入力
        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: user.password

        # ログインを実施
        click_button "ログイン"

        # ダッシュボードにリダイレクトされることを確認
        expect(current_path).to eq(root_path)
        expect(page).to have_link("ログアウト")
      end

      it "Remember meが正常に動作していること" do
        visit login_path

        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: user.password
        check "ログイン情報を保持する"  # Remember meをチェック

        click_button "ログイン"

        # Remember me機能が正常に動作していることを確認（暗号化クッキーのため、存在をチェック）
        expect(page.driver.browser.rack_mock_session.cookie_jar['user_id']).to be_present
        expect(page.driver.browser.rack_mock_session.cookie_jar['remember_token']).to be_present
        # ログイン状態が維持されていることも確認
        expect(current_path).to eq(root_path)
        expect(page).to have_link("ログアウト")
      end
    end

    context "無効な情報でログインする場合" do
      it "ログインに失敗し、エラーメッセージが表示されること" do
        visit login_path

        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: "wrongpassword"  # 間違ったパスワード

        click_button "ログイン"

        # ログインページに留まり、エラーメッセージが表示されることを確認
        expect(current_path).to eq(login_path)
        expect(page).to have_content("メールアドレスまたはパスワードが正しくありません")
        expect(page).to have_link("ログイン")
        expect(page).not_to have_link("ログアウト")
      end

      it "存在しないメールアドレスでログインに失敗すること" do
        visit login_path

        fill_in "メールアドレス", with: "nonexistent@example.com"
        fill_in "パスワード", with: "password"

        click_button "ログイン"

        # ログインページに留まり、エラーメッセージが表示されることを確認
        expect(current_path).to eq(login_path)
        expect(page).to have_content("メールアドレスまたはパスワードが正しくありません")
      end
    end
  end

  describe "ログアウト機能" do
    before do
      # 事前にログインしておく
      visit login_path
      fill_in "メールアドレス", with: user.email
      fill_in "パスワード", with: user.password
      click_button "ログイン"
    end

    it "正常にログアウトし、ホームページにリダイレクトすること" do
      click_link "ログアウト"

      # ホームページにリダイレクトされることを確認
      expect(current_path).to eq(root_path)
      expect(page).to have_link("ログイン")
      expect(page).not_to have_link("ログアウト")
    end
  end
end
