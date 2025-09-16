require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe "GET #new" do
    it "新規登録フォームが正常に表示されること" do
      get :new
      expect(response).to have_http_status(:success)
    end

    it "新しいユーザオブジェクトが作成されること" do
      get :new
      expect(assigns(:user)).to be_a_new(User)
    end

    it "newテンプレートがレンダリングされること" do
      get :new
      expect(response).to render_template(:new)
    end
  end

  describe "POST #create" do
    context "有効なパラメータの場合" do
      let(:valid_attributes) do
        {
          name: "Test User",
          email: "test@example.com",
          password: "password",
          password_confirmation: "password"
        }
      end
      it "ユーザが作成されること" do
        expect {
          post :create, params: { user: valid_attributes }
        }.to change(User, :count).by(1)
      end

      it "アカウント有効化メールが送信されること" do
        expect {
          post :create, params: { user: valid_attributes }
        }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it "ルートURLにリダイレクトされること" do
        post :create, params: { user: valid_attributes }
        expect(response).to redirect_to(root_url)
      end

      it "フラッシュメッセージが設定されること" do
        post :create, params: { user: valid_attributes }
        expect(flash[:info]).to eq(I18n.t("users.check_email_for_activation"))
      end
    end

    context "無効なパラメータの場合" do
      let(:invalid_attributes) do
        {
          name: "",
          email: "invalid_email",
          password: "short",
          password_confirmation: "mismatch"
        }
      end

      it "ユーザが作成されないこと" do
        expect {
          post :create, params: { user: invalid_attributes }
        }.not_to change(User, :count)
      end

      it "newテンプレートが再表示されること" do
        post :create, params: { user: invalid_attributes }
        expect(response).to render_template(:new)
      end

      it "エラーメッセージが表示されること" do
        post :create, params: { user: invalid_attributes }
        expect(assigns(:user).errors).not_to be_empty
      end

      it "422 Unprocessable Entityステータスが返されること" do
        post :create, params: { user: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
