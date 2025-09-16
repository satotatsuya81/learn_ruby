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
        expect(flash[:success]).to eq("ログインしました")
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

  describe "DELETE #destroy" do
    let(:user) { create(:user) }
    before do
      # 事前にログインしておく
      session[:user_id] = user.id
    end

    it "正常にログアウトし、ホームページにリダイレクトすること" do
      delete :destroy

      # セッションからユーザIDが削除されていること
      expect(session[:user_id]).to be_nil

      # ホームページにリダイレクトされること
      expect(response).to redirect_to(root_path)

      # ログアウトフラッシュメッセージが設定されていること
      expect(flash[:success]).to eq("ログアウトしました")
    end

    context "ログインしていない状態でログアウトを試みる場合" do
      it "ホームページにリダイレクトされ、フラッシュメッセージが表示されること" do
        delete :destroy

        # セッションからユーザIDが削除されていること
        expect(session[:user_id]).to be_nil

        # ホームページにリダイレクトされること
        expect(response).to redirect_to(root_path)

        # ログアウトフラッシュメッセージが設定されていること
        expect(flash[:success]).to eq("ログアウトしました")
      end
    end
  end
end
