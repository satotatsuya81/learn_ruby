require 'rails_helper'

  RSpec.describe AccountActivationsController, type: :controller do
    describe "GET #edit" do
      let(:user) { create(:user, activated: false, activation_token: User.new_token) }

      before do
        user.activation_email
      end

      context "有効なトークンとメールアドレスの場合" do
        it "アカウントが有効化され、ユーザーにリダイレクトされること" do
          get :edit, params: { id: user.id, token: user.activation_token }
          user.reload
          expect(user.activated?).to be_truthy
          expect(user.activated_at).not_to be_nil
        end

        it "ログイン状態になること" do
          get :edit, params: { id: user.id, token: user.activation_token }
          expect(session[:user_id]).to eq(user.id)
        end

        it "成功のフラッシュメッセージが表示されること" do
          get :edit, params: { id: user.id, token: user.activation_token }
          expect(flash[:success]).to eq(I18n.t("user_mailer.activation_email.success"))
        end

        it "ユーザーページにリダイレクトされること" do
          get :edit, params: { id: user.id, token: user.activation_token }
          expect(response).to redirect_to(user_path(user))
        end
      end

      context "無効なトークンの場合" do
        it "アカウントが有効化されないこと" do
          get :edit, params: { id: user.id, token: "invalidtoken" }
          user.reload
          expect(user.activated?).to be_falsey
        end

        it "フラッシュメッセージが表示されること" do
          get :edit, params: { id: user.id, token: "invalidtoken" }
          expect(flash[:danger]).to eq(I18n.t("user_mailer.activation_email.invalid_link"))
        end

        it "ルートURLにリダイレクトされること" do
          get :edit, params: { id: user.id, token: "invalidtoken" }
          expect(response).to redirect_to(root_url)
        end
      end

      context "既に有効化されているアカウントの場合" do
        let(:activated_user) { create(:user, activated: true) }

        it "有効化処理が行われないこと" do
          expect(activated_user.activated?).to be_truthy
          original_activated_at = activated_user.activated_at
          get :edit, params: { id: activated_user.id, token: activated_user.activation_token }
          activated_user.reload
          expect(activated_user.activated_at).to eq(original_activated_at)
        end
      end
    end
  end
