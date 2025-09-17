require 'rails_helper'

RSpec.describe "Errors", type: :request do
  describe "GET /errors/404" do
    it "404エラーページが表示されること" do
      get "/errors/404"
      expect(response).to have_http_status(404)
    end

    it "404エラーページの内容が表示されること" do
      get "/errors/404"
      expect(response.body).to include("ページが見つかりません")
      expect(response.body).to include("404")
    end

    context "JSON形式でリクエストした場合" do
      it "JSONエラーレスポンスが返されること" do
        get "/errors/404", headers: { 'Accept' => 'application/json' }
        expect(response).to have_http_status(404)
        expect(JSON.parse(response.body)).to eq({ "error" => "Not Found" })
      end
    end
  end

  describe "GET /errors/500" do
    it "500エラーページが表示されること" do
      get "/errors/500"
      expect(response).to have_http_status(500)
    end

    it "500エラーページの内容が表示されること" do
      get "/errors/500"
      expect(response.body).to include("サーバーエラーが発生しました")
      expect(response.body).to include("500")
    end

    context "JSON形式でリクエストした場合" do
      it "JSONエラーレスポンスが返されること" do
        get "/errors/500", headers: { 'Accept' => 'application/json' }
        expect(response).to have_http_status(500)
        expect(JSON.parse(response.body)).to eq({ "error" => "Internal Server Error" })
      end
    end
  end

  describe "GET 存在しないパス" do
    it "404エラーページが表示されること" do
      get "/nonexistent-path"
      expect(response).to have_http_status(404)
      expect(response.body).to include("ページが見つかりません")
    end
  end

  # 注意: /404 と /500 パスは Rails の開発環境では静的ファイル（public/404.html, public/500.html）を返すため
  # Request Spec では直接テストできない。実際のエラー処理は /errors/* パスでテストする。
end
