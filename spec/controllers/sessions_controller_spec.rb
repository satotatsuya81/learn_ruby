require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  describe "POST #create" do
    let(:user) { create(:user,
      name: "Test User",
      email: "test@example.com",
      password: "password",
      password_confirmation: "password"
    ) }

    context "有効な認証情報でログインする場合" do
      it "正常にログインし、ホームページにリダイレクトすること" do
        # POSTリクエストを送信してログインを試みる
        post :create, params: {
          session: {
            email: user.email,
            password: 'password'
          }
        }

        # セッションにユーザIDが設定されていること
        expect(session[:user_id]).to eq(user.id)

        # ホームページにリダイレクトされること
        expect(response).to redirect_to(root_path)

        # 成功フラッシュメッセージが設定されていること
        expect(flash[:notice]).to eq("ログインしました")
      end
    end

    context "無効な認証情報でログインする場合" do
      it "ログインに失敗し、ログインページを再表示すること" do
        # 間違ったパスワードでPOSTリクエストを送信
        post :create, params: {
          session: {
            email: user.email,
            password: 'wrongpassword'
          }
        }

        # セッションにユーザIDが設定されていないこと
        expect(session[:user_id]).to be_nil

        # ログインページが再表示されること
        expect(response).to render_template(:new)

        # エラーフラッシュメッセージが設定されていること
        expect(flash.now[:alert]).to eq("メールアドレスまたはパスワードが正しくありません")
      end
    end
  end
end
