# React統合後のフォームに対応したログインヘルパー
module LoginHelpers
  # React統合後のログインフォーム用ヘルパー
  def login(user)
    visit login_path
        # Reactコンポーネントのマウント完了を待機
        expect(page).to have_css('form', wait: 3)
        expect(page).to have_field('メールアドレス', wait: 3)

        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: user.password
        click_button "ログイン"
      # ログイン完了を確認
      expect(page).to have_current_path(root_path)
  end
end
# RSpec設定でヘルパーを有効化
RSpec.configure do |config|
  config.include LoginHelpers, type: :system
  config.include LoginHelpers, type: :request
end
