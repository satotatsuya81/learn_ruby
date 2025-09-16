require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe "GET #new" do
    it "正常にレスポンスを返すこと" do
      get :new
      expect(response).to have_http_status(:success)
    end

    it "新しいユーザオブジェクトが作成されること" do
      get :new
      expect(assigns(:user)).to be_a_new(User)
    end
  end
end
