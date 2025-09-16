require 'rails_helper'

  RSpec.describe 'shared/_header.html.erb', type: :view do
    # テストで必要なヘルパーメソッドのモック設定
    before do
      allow(view).to receive(:root_path).and_return('/')
      allow(view).to receive(:login_path).and_return('/login')
      allow(view).to receive(:signup_path).and_return('/signup')
      allow(view).to receive(:logout_path).and_return('/logout')
      allow(view).to receive(:t).with('application.name').and_return('Business Card Manager')
      allow(view).to receive(:t).with('navigation.home').and_return('ホーム')
      allow(view).to receive(:t).with('navigation.login').and_return('ログイン')
      allow(view).to receive(:t).with('navigation.signup').and_return('ユーザー登録')
      allow(view).to receive(:t).with('navigation.logout').and_return('ログアウト')
    end

    context "未ログインユーザの場合" do
      before do
        allow(view).to receive(:logged_in?).and_return(false)
      end

      it "アプリケーション名が表示されること" do
        render
        expect(rendered).to have_link('Business Card Manager', href: "/")
      end

      it "ホームリンクが表示されること" do
        render
        expect(rendered).to have_link('ホーム', href: "/")
      end

      it "ログインリンクが表示されること" do
        render
        expect(rendered).to have_link('ログイン', href: "/login")
      end

      it "ユーザー登録リンクが表示されること" do
        render
        expect(rendered).to have_link('ユーザー登録', href: "/signup")
      end

      it "ログアウトリンクが表示されないこと" do
        render
        expect(rendered).not_to have_link('ログアウト', href: "/logout")
      end
    end

    context "ログインユーザの場合" do
      let(:user) { create(:user, name: "テストユーザ") }
      before do
        allow(view).to receive(:logged_in?).and_return(true)
        allow(view).to receive(:current_user).and_return(user)
        allow(view).to receive(:t).with('authentication.navigation.welcome_message', name: "テストユーザ")
                                  .and_return("ようこそ、テストユーザさん")
      end

      it "アプリケーション名が表示されること" do
        render
        expect(rendered).to have_link('Business Card Manager', href: "/")
      end

      it "ウェルカムメッセージが表示されること" do
        render
        expect(rendered).to include('ようこそ、テストユーザさん')
      end

      it "ホームリンクが表示されること" do
        render
        expect(rendered).to have_link('ホーム', href: "/")
      end

      it "ログアウトリンクが表示されること" do
        render
        expect(rendered).to have_link('ログアウト', href: "/logout")
      end

      it "ログインリンクが表示されないこと" do
        render
        expect(rendered).not_to have_link('ログイン', href: "/login")
      end

      it "ユーザー登録リンクが表示されないこと" do
        render
        expect(rendered).not_to have_link('ユーザー登録', href: "/signup")
      end
    end

    context "共通のレイアウト要素" do
      it "ナビゲーションバーが正しいBootstrapクラスでレンダリングされること" do
        render

        expect(rendered).to have_css('nav.navbar.navbar-expand-lg.navbar-dark.bg-primary')
        expect(rendered).to have_css('.container')
        expect(rendered).to have_css('.navbar-brand')
        expect(rendered).to have_css('.navbar-toggler')
      end

      it "アプリケーション名がブランドリンクとして含まれること" do
        render

        expect(rendered).to have_link(href: root_path)
        expect(rendered).to include(I18n.t('application.name'))
      end

      it "レスポンシブナビゲーション要素が含まれること" do
        render

        expect(rendered).to have_css('.navbar-collapse')
        expect(rendered).to have_css('.navbar-nav')
        expect(rendered).to have_css('.nav-item')
        expect(rendered).to have_css('.nav-link')
      end
    end
  end
