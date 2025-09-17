require 'rails_helper'

RSpec.describe "password_resets/new", type: :view do
  before do
    render
  end

  it "パスワードリセット要求フォームが表示される" do
    # フォーム要素の存在確認
    expect(rendered).to have_selector('form[action="/password_resets"]')
    expect(rendered).to have_selector('input[name="password_reset[email]"]')
    expect(rendered).to have_selector('input[type="submit"]')
  end

  it "メールアドレス入力欄のラベルが表示される" do
    expect(rendered).to have_content(I18n.t('password_resets.email'))
  end

  it "送信ボタンが表示される" do
    expect(rendered).to have_button(I18n.t('password_resets.send_password_reset_email'))
  end

  it "メールアドレス入力欄にHTML5バリデーション属性が設定される" do
    # required属性の確認
    expect(rendered).to have_selector('input[name="password_reset[email]"][required]')

    # email type属性の確認
    expect(rendered).to have_selector('input[name="password_reset[email]"][type="email"]')
  end

  it "フォームがCSSクラスを持つ" do
    # Bootstrap対応のCSSクラス確認
    expect(rendered).to have_selector('input[name="password_reset[email]"].form-control')
    expect(rendered).to have_selector('input[type="submit"].btn')
  end
end
