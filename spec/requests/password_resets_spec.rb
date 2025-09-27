require 'rails_helper'

RSpec.describe "PasswordResets", type: :request do
  let(:user) { create(:user, :activated) }

  describe "GET /password_resets/new" do
    context "正常な要求が行われた場合" do
      it "レスポンスが成功すること" do
        get new_password_reset_path
        expect(response).to have_http_status(200)
        expect(response.body).to include(I18n.t("password_resets.send_password_reset_email"))
      end
    end
  end

  describe "POST /password_resets" do
    context "有効なメールアドレスが送信された場合" do
      it "パスワードリセットメールが送信されること" do
        expect {
          post password_resets_path, params: { password_reset: { email: user.email } }
        }.to change { user.reload.reset_digest }.from(nil)
        expect(response).to redirect_to(root_url)
        follow_redirect!
        follow_redirect!  # Follow the second redirect to login page
        expect(response.body).to include(I18n.t("password_resets.email_sent"))
        expect(ActionMailer::Base.deliveries.size).to eq(1)
      end
    end

    context "無効なメールアドレスが送信された場合" do
      it "エラーメッセージが表示され、newテンプレートが再表示される" do
        post password_resets_path, params: { password_reset: { email: "invalid@example.com" } }

        expect(response).to have_http_status(422)
        expect(response.body).to include(I18n.t("password_resets.email_not_found"))
      end
    end
  end
  describe "GET /password_resets/:id/edit" do
    context "有効なユーザーIDとトークンが提供された場合" do
      before do
        user.create_reset_digest
      end

      it "パスワード編集ページが正常に表示される" do
        get edit_password_reset_path(user.id), params: { token: user.reset_token }

        expect(response).to have_http_status(200)
        expect(response.body).to include(I18n.t("password_resets.reset_password"))
      end
    end

    context "無効なトークンが提供された場合" do
      before do
        user.create_reset_digest
      end

      it "ルートにリダイレクトされる" do
        get edit_password_reset_path(user.id), params: { token: "invalid_token" }

        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_url)
      end
    end

    context "期限切れトークンが提供された場合" do
      before do
        user.create_reset_digest
        user.update_columns(reset_sent_at: 3.hours.ago)
      end

      it "パスワードリセット要求ページにリダイレクトされる" do
        get edit_password_reset_path(user.id), params: { token: user.reset_token }

        expect(response).to have_http_status(302)
        expect(response).to redirect_to(new_password_reset_url)
        expect(flash[:danger]).to include(I18n.t("password_resets.password_reset_expired"))
      end
    end
  end

  describe "PATCH /password_resets/:id" do
    before do
      user.create_reset_digest
    end

    context "有効なパスワードが送信された場合" do
      it "パスワードが更新され、ユーザーページにリダイレクトされる" do
        patch password_reset_path(user.id), params: {
          token: user.reset_token,
          user: {
            password: "newpassword",
            password_confirmation: "newpassword"
          }
        }

        expect(response).to have_http_status(302)
        expect(response).to redirect_to(user_path(user))
        expect(flash[:success]).to eq(I18n.t("password_resets.password_updated"))
        # リセットダイジェストがクリアされることを確認
        expect(user.reload.reset_digest).to be_nil
      end
    end

    context "空のパスワードが送信された場合" do
      it "エラーメッセージが表示され、editテンプレートが再表示される" do
        patch password_reset_path(user.id), params: {
          token: user.reset_token,
          user: {
            password: "",
            password_confirmation: ""
          }
        }

        expect(response).to have_http_status(422)
        expect(response.body).to include(I18n.t("activerecord.errors.messages.blank"))
      end
    end

    context "パスワード（確認）が一致しない場合" do
      it "エラーメッセージが表示され、editテンプレートが再表示される" do
        patch password_reset_path(user.id), params: {
          token: user.reset_token,
          user: {
            password: "newpassword",
            password_confirmation: "different"
          }
        }

        expect(response).to have_http_status(422)
        expect(response.body).to include(I18n.t("activerecord.errors.messages.confirmation", attribute: I18n.t("activerecord.attributes.user.password")))
      end
    end

    context "無効なトークンが提供された場合" do
      it "ルートにリダイレクトされる" do
        patch password_reset_path(user.id), params: {
          token: "invalid_token",
          user: {
            password: "newpassword",
            password_confirmation: "newpassword"
          }
        }

        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_url)
      end
    end

    context "期限切れトークンが提供された場合" do
      before do
        user.update_columns(reset_sent_at: 3.hours.ago)
      end

      it "パスワードリセット要求ページにリダイレクトされる" do
        patch password_reset_path(user.id), params: {
          token: user.reset_token,
          user: {
            password: "newpassword",
            password_confirmation: "newpassword"
          }
        }

        expect(response).to have_http_status(302)
        expect(response).to redirect_to(new_password_reset_url)
        expect(flash[:danger]).to include(I18n.t("password_resets.password_reset_expired"))
      end
    end
  end
end
