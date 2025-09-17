require 'rails_helper'

RSpec.describe "password_resets/edit", type: :view do
  let(:user) { create(:user) }

  before do
    user.create_reset_digest
    assign(:user, user)
    # params[:token] と params[:id] を設定
    allow(view).to receive(:params).and_return(ActionController::Parameters.new(
      id: user.id.to_s,
      token: user.reset_token
    ))
    render
  end

  it "パスワード更新フォームが表示される" do
    # フォーム要素の存在確認
    expect(rendered).to have_selector("form[action=\"/password_resets/#{user.id}\"]")
    expect(rendered).to have_selector('input[name="user[password]"]')
    expect(rendered).to have_selector('input[name="user[password_confirmation]"]')
    expect(rendered).to have_selector('input[type="submit"]')
  end

  it "パスワード入力欄のラベルが表示される" do
    expect(rendered).to have_content(I18n.t('password_resets.password'))
    expect(rendered).to have_content(I18n.t('password_resets.password_confirmation'))
  end

  it "更新ボタンが表示される" do
    expect(rendered).to have_button(I18n.t('password_resets.update_password'))
  end

  it "隠しフィールドでトークンが送信される" do
    # トークンが隠しフィールドとして含まれることを確認
    expect(rendered).to have_selector('input[name="token"]', visible: false)
  end
end
