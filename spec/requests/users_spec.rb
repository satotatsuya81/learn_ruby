require 'rails_helper'

  RSpec.describe "Users", type: :request do
    describe "GET /signup" do
      it "ユーザ登録フォームが正常に表示されること" do
        get signup_path
        expect(response).to have_http_status(:success)
      end
    end

    describe "GET /users/new" do
      it "ユーザ登録フォームが正常に表示されること" do
        get new_user_path
        expect(response).to have_http_status(:success)
        expect(response.body).to include(I18n.t("users.sign_up"))
      end
    end

    describe "POST /users" do
      context "有効なパラメータの場合" do
        let(:valid_params) do
          {
            user: {
              name: "Example User",
              email: "user@example.com",
              password: "password",
              password_confirmation: "password"
            }
          }
        end

        it "新しいユーザが作成されること" do
          expect {
            post users_path, params: valid_params
          }.to change(User, :count).by(1)
        end

        it "302リダイレクトされること" do
          post users_path, params: valid_params
          expect(response).to have_http_status(302)
        end

        it "root_pathにリダイレクトされること" do
          post users_path, params: valid_params
          expect(response).to redirect_to(root_path)
        end

        it "アカウント有効化メールが送信されること" do
          expect {
            post users_path, params: valid_params
          }.to change { ActionMailer::Base.deliveries.count }.by(1)
        end
      end

      context "無効なパラメータ（精査エラー）の場合" do
        let(:invalid_params) do
          {
            user: {
              name: "",
              email: "invalid_email",
              password: "short",
              password_confirmation: "mismatch"
            }
          }
        end

        it "ユーザが作成されないこと" do
          expect {
            post users_path, params: invalid_params
          }.not_to change(User, :count)
        end

        it "422 Unprocessable Entityが返ること" do
          post users_path, params: invalid_params
          expect(response).to have_http_status(:unprocessable_content)
        end

        it "ユーザ登録フォームが再表示されること" do
          post users_path, params: invalid_params
          expect(response.body).to include(I18n.t("users.sign_up"))
        end

        it "バリデーションエラーが表示されること" do
          post users_path, params: invalid_params
          # React統合後も、バリデーションエラーはdata属性として渡される
          expect(response.body).to include('data-user-registration-form-errors-value')
          # 実際のエラーメッセージが含まれることを確認
          expect(response.body).to include('名前 を入力してください')
          expect(response.body).to include('メールアドレス は不正な値です')
        end
      end

      context "無効なパラメータ（email重複）の場合" do
        let(:duplicate_email_params) do
          {
            user: {
              name: "Another User",
              email: "user@example.com",
              password: "password",
              password_confirmation: "password"
            }
          }
        end

        before do
          create(:user, email: "user@example.com")
        end

        it "ユーザが作成されないこと" do
          expect {
            post users_path, params: duplicate_email_params
          }.not_to change(User, :count)
        end

        it "422 Unprocessable Entityが返ること" do
          post users_path, params: duplicate_email_params
          expect(response).to have_http_status(:unprocessable_content)
        end

        it "ユーザ登録フォームが再表示されること" do
          post users_path, params: duplicate_email_params
          expect(response.body).to include(I18n.t("users.sign_up"))
        end

        it "バリデーションエラーが表示されること" do
          post users_path, params: duplicate_email_params
          # React統合後も、バリデーションエラーはdata属性として渡される
          expect(response.body).to include('data-user-registration-form-errors-value')
          # 実際のエラーメッセージが含まれることを確認（翻訳の有無に関わらず）
          expect(response.body).to include('メールアドレス')
          expect(response.body).to include('taken')
        end
      end

      describe "GET /users/:id" do
        let(:user) { create(:user, :activated) }
        let(:unactivated_user) { create(:user, activated: false) }

        it "有効なユーザのプロフィールが表示されること" do
          get user_path(user)
          expect(response).to have_http_status(:success)
          expect(response.body).to include(user.name)
        end

        it "無効なユーザのプロフィールにアクセスするとroot_pathにリダイレクトされること" do
          get user_path(unactivated_user)
          expect(response).to redirect_to(root_path)
        end

        it "存在しないユーザIDにアクセスするとroot_pathにリダイレクトされること" do
          get user_path(id: "nonexistent")
          expect(response).to redirect_to(root_path)
          expect(flash[:danger]).to eq(I18n.t("users.user_not_found"))
        end
      end
    end
  end
