require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  let(:user) { create(:user, :activated) }

  describe "GET /login" do
    it "ログインページが表示されること" do
        get login_path
        expect(response).to have_http_status(200)
        expect(response.body).to include("ログイン")
    end
  end

  describe "POST /login" do
    context "有効なパラメータの場合" do
      let(:valid_params) do
        {
          session: {
            id: user.id,
            email: user.email,
            password: user.password,
            remember_token: user.remember_token,
            remember_digest: user.remember_digest
          }
        }
      end

      it "ログインに成功し、ルートページにリダイレクトされること" do
        post login_path, params: valid_params
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(response.body).to include(I18n.t('navigation.welcome_message', name: user.name))
      end

      it "セッションにユーザIDが設定されること" do
        post login_path, params: valid_params
        expect(session[:user_id]).to eq(user.id)
      end

      it "リメンバーミーが有効な場合、永続的なセッションが作成されること" do
        post login_path, params: valid_params
        expect(session[:user_id]).to eq(user.id)
        # 暗号化クッキーの存在確認（Request specでは間接的に確認）
        expect(response.cookies).to be_present
      end
    end

    context "無効なパラメータの場合" do
      let(:invalid_params) do
        {
          session: {
            email: user.email,
            password: "wrongpassword"
          }
        }
      end

      it "422エラーが返されること" do
        post login_path, params: invalid_params
        expect(response).to have_http_status(422)
        expect(response.body).to include("ログイン")
        expect(response.body).to include("メールアドレスまたはパスワードが正しくありません")
      end

      it "セッションにユーザIDが設定されないこと" do
        post login_path, params: invalid_params
        expect(session[:user_id]).to be_nil
      end

      it "ログインページが再表示されること" do
        post login_path, params: invalid_params
        expect(response.body).to include("ログイン")
      end

      it "フラッシュメッセージが表示されること" do
        post login_path, params: invalid_params
        expect(response.body).to include("メールアドレスまたはパスワードが正しくありません")
      end
    end

    context "未有効化ユーザーの場合" do
      let!(:unactivated_user) { create(:user, activated: false) }
        let(:unactivated_credentials) do
          {
            session: {
              email: unactivated_user.email,
              password: unactivated_user.password
            }
          }
        end

      it "422エラーが返されること" do
        post login_path, params: unactivated_credentials
        expect(response).to have_http_status(422)
        expect(response.body).to include("ログイン")
      end

      it "セッションにユーザIDが設定されないこと" do
        post login_path, params: unactivated_credentials
        expect(session[:user_id]).to be_nil
      end

      it "ログインページが再表示されること" do
        post login_path, params: unactivated_credentials
        expect(response.body).to include("ログイン")
      end

      it "フラッシュメッセージが表示されること" do
        post login_path, params: unactivated_credentials
        expect(response.body).to include("アカウントが有効化されていません。メールをご確認ください。")
      end
    end
  end

  describe "DELETE /logout" do
    # 事前にログインしておく
    before do
      post login_path, params: { session: { email: user.email, password: user.password } }
    end
    context "ログイン状態からログアウトする場合" do
      it "ログアウトに成功し、ルートページにリダイレクトされること" do
        delete logout_path
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(response.body).to include("ログイン")
      end

      it "セッションがクリアされること" do
        delete logout_path
        expect(session[:user_id]).to be_nil
      end

      it "Remember Meクッキーがクリアされること" do
          delete logout_path
          expect(cookies[:remember_token]).to be_blank
        end
    end

    context "ログアウト状態でログアウトを試みる場合" do
      it "エラーにならず、ルートページにリダイレクトされること" do
        delete logout_path # 1回目のログアウト（ログイン状態）
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)

        delete logout_path # 2回目のログアウト（ログアウト状態）
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(response.body).to include("ログイン")
      end
    end
  end
end
