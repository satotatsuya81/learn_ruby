require 'rails_helper'

# エラーページのシステムテスト（E2Eテスト）
# システムテストは、実際のブラウザでユーザーが操作するように
# ページの表示内容や動作を確認するテストです
RSpec.describe "Error Pages", type: :system do
  # テスト実行前の設定
  # rack_testドライバーを使用（軽量で高速、JavaScriptなしの基本テスト用）
  before do
    driven_by(:rack_test)
    # カスタムエラーページが表示されるように設定
    Rails.application.config.consider_all_requests_local = false
    Rails.application.config.action_dispatch.show_exceptions = :all
  end

  # テスト後に設定を元に戻す
  after do
    Rails.application.config.consider_all_requests_local = true
    Rails.application.config.action_dispatch.show_exceptions = :rescuable
  end

  # 404エラーページ（ページが見つからない）のテスト
  describe "404エラーページ" do
    # テスト1: カスタム404ページが正しく表示されるか
    it "カスタム404ページが表示されること" do
      # /404 ページにアクセス（実際のユーザーがブラウザでアクセスする状況を再現）
      visit "/errors/404"

      # ページに「404」という文字が表示されることを確認
      expect(page).to have_content("404")

      # 国際化ファイル（ja.yml）で定義されたエラータイトルが表示されることを確認
      # I18n.t()で翻訳されたテキストが正しく表示されているかテスト
      expect(page).to have_content(I18n.t('errors.not_found.title'))

      # エラーメッセージが表示されることを確認
      expect(page).to have_content(I18n.t('errors.not_found.message'))

      # ホームページへ戻るリンクが正しく設置されていることを確認
      # href属性がroot_path（ホームページ）を指していることも確認
      expect(page).to have_link(I18n.t('buttons.home'), href: root_path)
    end

    # テスト2: ページの構造（HTML/CSS）が正しく設定されているか
    it "適切なページ構造を持つこと" do
      # /404 ページにアクセス
      visit "/errors/404"

      # エラーページ用のCSSクラスが適用されていることを確認
      expect(page).to have_css(".error-page")

      # Bootstrap5のクラスを使った大きな404表示が青色で表示されることを確認
      expect(page).to have_css(".display-1.text-primary", text: "404")

      # ホームに戻るボタンが主要ボタン（青色）スタイルで表示されることを確認
      expect(page).to have_css(".btn.btn-primary", text: I18n.t('buttons.home'))

      # 戻るボタンが補助ボタン（グレー）スタイルで表示されることを確認
      expect(page).to have_css(".btn.btn-outline-secondary", text: I18n.t('buttons.back'))
    end
  end

  # 500エラーページ（サーバー内部エラー）のテスト
  describe "500エラーページ" do
    # テスト3: カスタム500ページが正しく表示されるか
    it "カスタム500ページが表示されること" do
      # /500 ページにアクセス
      visit "/errors/500"

      # ページに「500」という文字が表示されることを確認
      expect(page).to have_content("500")

      # サーバーエラー用のタイトルが表示されることを確認
      expect(page).to have_content(I18n.t('errors.internal_server_error.title'))

      # サーバーエラー用のメッセージが表示されることを確認
      expect(page).to have_content(I18n.t('errors.internal_server_error.message'))

      # ホームページへ戻るリンクが設置されていることを確認
      expect(page).to have_link(I18n.t('buttons.home'), href: root_path)
    end

    # テスト4: 500ページの構造（HTML/CSS）が正しく設定されているか
    it "適切なページ構造を持つこと" do
      # /500 ページにアクセス
      visit "/errors/500"

      # エラーページ用のCSSクラスが適用されていることを確認
      expect(page).to have_css(".error-page")

      # 500エラーが赤色で大きく表示されることを確認（危険を表す赤色）
      expect(page).to have_css(".display-1.text-danger", text: "500")

      # ホームに戻るボタンが表示されることを確認
      expect(page).to have_css(".btn.btn-primary", text: I18n.t('buttons.home'))

      # 再読み込みボタンが表示されることを確認（サーバーエラーの場合は再試行が有効）
      expect(page).to have_css(".btn.btn-outline-secondary", text: I18n.t('buttons.reload'))
    end
  end

  # 国際化（多言語対応）機能のテスト
  # アプリケーションが日本語と英語の両方に対応しているかを確認
  describe "国際化機能" do
    # 英語表示のテスト
    context "ロケールが英語の場合" do
      # テスト実行前に英語ロケールに設定
      before { I18n.locale = :en }
      # テスト実行後にデフォルトロケール（日本語）に戻す
      after { I18n.locale = I18n.default_locale }

      # テスト5: エラーメッセージが英語で表示されるか
      it "エラーメッセージが英語で表示されること" do
        # 404ページにアクセス
        visit "/errors/404"

        # 英語のエラータイトルが表示されることを確認
        expect(page).to have_content("Page Not Found")

        # 英語のエラーメッセージ（の一部）が表示されることを確認
        expect(page).to have_content("The page you are looking for might have been removed")
      end
    end

    # 日本語表示のテスト
    context "ロケールが日本語の場合" do
      # テスト実行前に日本語ロケールに設定
      before { I18n.locale = :ja }

      # テスト6: エラーメッセージが日本語で表示されるか
      it "エラーメッセージが日本語で表示されること" do
        # 404ページにアクセス
        visit "/errors/404"

        # 日本語のエラータイトルが表示されることを確認
        expect(page).to have_content("ページが見つかりません")

        # 日本語のエラーメッセージが表示されることを確認
        expect(page).to have_content("お探しのページは存在しないか、移動または削除された可能性があります")
      end
    end
  end
end
