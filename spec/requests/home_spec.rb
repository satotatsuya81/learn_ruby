require 'rails_helper'

# Home（トップページ）へのHTTPリクエストのテスト
RSpec.describe "Home", type: :request do
  describe "GET /" do
    it "ホームページが表示されること" do
      get root_path  # "/" （ルートパス）に GET リクエストを送信
      expect(response).to have_http_status(:success)  # HTTPステータス 200（成功）が返ることを確認
    end

    it "ホームページにアプリ名が表示されること" do
      get root_path  # ルートパスにアクセス
      expect(response.body).to include("Business Card Manager")  # レスポンスHTMLにアプリ名が含まれることを確認
    end
  end

  # 将来の /home パスのテスト（現在はコメントアウト）
  # 理由: 現在は root_path のみ実装しており、/home パスは存在しないため
  # describe "GET /home" do
  #   it "returns http success" do
  #     get home_index_path
  #     expect(response).to have_http_status(:success)
  #   end
  # end
end
