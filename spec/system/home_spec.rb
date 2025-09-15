require 'rails_helper'

# Home page（トップページ）のシステムテスト
# System Test は、ブラウザでの実際のユーザー操作をシミュレートするテストです
# Request Test との違い: JavaScriptの動作やCSS表示なども含めて、より実際の使用環境に近いテストができる
RSpec.describe 'Home page', type: :system do
  before do
    # rack_test: 軽量なテストドライバー（JavaScriptは動作しないが高速）
    # selenium_chrome_headless: より本格的（JavaScript動作、画面表示確認可能だが低速）
    driven_by(:rack_test)
  end

  # ページ内容のテストグループ
  describe 'Page content' do

    # 日本語表示の場合のテスト
    context 'when locale is Japanese' do
      # テスト1: 日本語ロケール時に、すべてのコンテンツが日本語で表示されるかチェック
      # 目的: 多言語対応が正しく機能し、日本語ユーザーに適切なコンテンツが表示されることを確認
      it 'displays all content in Japanese' do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          visit root_path  # トップページにアクセス

          # ヘッダー部分の確認
          expect(page).to have_css('nav.navbar')  # ナビゲーションバーが表示されているか
          expect(page).to have_link('Business Card Manager')  # アプリ名のリンクがあるか
          expect(page).to have_link('ホーム')  # 日本語でのホームリンクがあるか

          # メインコンテンツ部分の確認
          expect(page).to have_content('Business Card Manager')  # アプリ名が表示されているか
          expect(page).to have_content('名刺管理システムへようこそ')  # 日本語の歓迎メッセージ
          expect(page).to have_content('主な機能')  # 日本語のセクションタイトル
          expect(page).to have_content('今後の予定')  # 日本語のセクションタイトル
          expect(page).to have_content('技術スタック')  # 日本語のセクションタイトル

          # フッター部分の確認
          expect(page).to have_css('footer')  # フッター要素が存在するか
          expect(page).to have_content('© 2025 Business Card Manager')  # コピーライト表示
          expect(page).to have_content('効率的な名刺管理システム')  # 日本語の説明文
        end
      end
    end

    # 英語表示の場合のテスト
    context 'when locale is English' do
      # テスト2: 英語ロケール時に、すべてのコンテンツが英語で表示されるかチェック
      # 目的: 多言語対応が正しく機能し、英語ユーザーに適切なコンテンツが表示されることを確認
      it 'displays all content in English' do
        with_locale(:en) do  # 一時的に英語ロケールに切り替え
          visit root_path  # トップページにアクセス

          # ヘッダー部分の確認（英語版）
          expect(page).to have_css('nav.navbar')  # ナビゲーションバーが表示されているか
          expect(page).to have_link('Business Card Manager')  # アプリ名のリンク
          expect(page).to have_link('Home')  # 英語でのホームリンクがあるか

          # メインコンテンツ部分の確認（英語版）
          expect(page).to have_content('Business Card Manager')  # アプリ名
          expect(page).to have_content('Welcome to Business Card Management System')  # 英語の歓迎メッセージ
          expect(page).to have_content('Main Features')  # 英語のセクションタイトル
          expect(page).to have_content('Future Plans')  # 英語のセクションタイトル
          expect(page).to have_content('Tech Stack')  # 英語のセクションタイトル

          # フッター部分の確認（英語版）
          expect(page).to have_css('footer')  # フッター要素が存在するか
          expect(page).to have_content('Business Card Manager')  # コピーライト表示
          expect(page).to have_content('Efficient business card management system')  # 英語の説明文
        end
      end
    end
  end

  # ページ構造のテストグループ
  describe 'Page structure' do

    # テスト3: HTMLの意味的な構造が正しいかをチェック
    # 目的: SEO対策とアクセシビリティを確保するため、適切なHTML要素が使われていることを確認
    it 'has proper semantic HTML structure' do
      visit root_path  # トップページにアクセス

      # セマンティックHTML要素の確認
      expect(page).to have_css('nav')     # ナビゲーション領域
      expect(page).to have_css('main')    # メインコンテンツ領域
      expect(page).to have_css('footer')  # フッター領域
      expect(page).to have_css('h1')      # メイン見出し（SEOで重要）
      expect(page).to have_css('h3')      # サブ見出し（階層構造）
    end

    # テスト4: レスポンシブデザインの要素が正しく配置されているかをチェック
    # 目的: スマホ・タブレット・PCでの表示が適切になるBootstrapクラスが使われていることを確認
    it 'has responsive design elements' do
      visit root_path  # トップページにアクセス

      # Bootstrapのレスポンシブデザイン要素の確認
      expect(page).to have_css('.container')      # 中央寄せコンテナ（画面幅に応じて調整）
      expect(page).to have_css('.navbar-toggler') # モバイル用ハンバーガーメニューボタン
      expect(page).to have_css('.row')            # Bootstrapのグリッドシステム（行）
      expect(page).to have_css('.col-md-4')       # Bootstrapのグリッドシステム（列、中画面以上で4/12幅）
    end
  end
end
