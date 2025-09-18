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
      visit "/errors/404"
      expect(page).to have_content("404")
      expect(page).to have_content(I18n.t('errors.not_found.title'))
      expect(page).to have_content(I18n.t('errors.not_found.message'))
      expect(page).to have_link(I18n.t('common.buttons.home'), href: root_path)
    end

    it "存在しないページにアクセスしたときにカスタム404ページが表示されること" do
      visit "/nonexistent_page"
      expect(page).to have_content("404")
      expect(page).to have_content(I18n.t('errors.not_found.title'))
      expect(page).to have_content(I18n.t('errors.not_found.message'))
      expect(page).to have_link(I18n.t('common.buttons.home'), href: root_path)
    end
  end

  # 500エラーページ（サーバー内部エラー）のテスト
  describe "500エラーページ" do
    it "カスタム500ページが表示されること" do
      visit "/errors/500"
      expect(page).to have_content("500")
      expect(page).to have_content(I18n.t('errors.internal_server_error.title'))
      expect(page).to have_content(I18n.t('errors.internal_server_error.message'))
      expect(page).to have_link(I18n.t('common.buttons.home'), href: root_path)
    end
  end
end
