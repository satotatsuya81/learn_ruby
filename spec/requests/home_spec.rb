require 'rails_helper'

# Home（トップページ）へのHTTPリクエストのテスト
# Request Testは、実際のHTTPリクエストを送信して、レスポンスが正しいかをテストします
# Controller Testとの違い: より実際のユーザーの操作に近い状況をテストできる
RSpec.describe "Home", type: :request do
  # GET / （ルートパス・トップページ）へのリクエストテストグループ
  describe "GET /" do
    # テスト1: ルートパス（http://localhost:3000/）へのアクセスが成功するかチェック
    # 目的: ユーザーがサイトにアクセスした時にエラーページが表示されないことを確認
    it "returns http success" do
      get root_path  # "/" （ルートパス）に GET リクエストを送信
      expect(response).to have_http_status(:success)  # HTTPステータス 200（成功）が返ることを確認
    end

    # テスト2: レスポンスの内容が期待通りかをチェック
    # 目的: 正しいページ（アプリケーション名を含む）が表示されることを確認
    it "renders the home page" do
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
