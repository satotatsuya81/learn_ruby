require 'rails_helper'

RSpec.describe "AccountActivations", type: :request do
  let(:user) { create(:user) }

  describe "GET /account_activations/:id/edit" do
    context "有効なトークンで要求する場合" do
      it "ユーザのアカウントが有効化されること" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        user.reload
        expect(response).to have_http_status(302)
        expect(user.activated?).to be_truthy
      end

      it "ユーザープロフィールに遷移すること" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        expect(response).to redirect_to(user)
      end

      it "フラッシュメッセージが表示されること" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        follow_redirect!
        expect(response.body).to include(I18n.t("user_mailer.activation_email.success"))
      end

      it "ログイン状態になること" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        follow_redirect!
        expect(response.body).to include(I18n.t("navigation.logout"))
      end
    end

    context "無効なトークンで要求する場合" do
      it "アカウントが有効化されないこと" do
        get edit_account_activation_path(user.id), params: { token: 'wrongtoken' }
        user.reload
        expect(response).to have_http_status(302)
        expect(user.activated?).to be_falsey
      end

      it "ルートにリダイレクトされること" do
        get edit_account_activation_path(user.id), params: { token: 'wrongtoken' }
        expect(response).to redirect_to(root_url)
      end

      it "フラッシュメッセージが表示されること" do
        get edit_account_activation_path(user.id), params: { token: 'wrongtoken' }
        follow_redirect!
        expect(response.body).to include(I18n.t("user_mailer.activation_email.invalid_link"))
      end
    end

    context "既に有効化されているアカウントで要求する場合" do
      before { user.activate }

      it "アカウントが再度有効化されないこと" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        user.reload
        expect(response).to have_http_status(302)
        expect(user.activated?).to be_truthy
      end

      it "ルートにリダイレクトされること" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        expect(response).to redirect_to(root_url)
      end

      it "フラッシュメッセージが表示されること" do
        get edit_account_activation_path(user.id), params: { token: user.activation_token }
        follow_redirect!
        expect(response.body).to include(I18n.t("user_mailer.activation_email.already_activated"))
      end
    end

    context "存在しないユーザーの場合" do
      it "ルートにリダイレクトされること" do
        get edit_account_activation_path(9999), params: { token: 'sometoken' }
        expect(response).to redirect_to(root_url)
      end
    end
  end
end
