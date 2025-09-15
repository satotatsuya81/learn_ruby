require 'rails_helper'

# エラーページのルーティングテスト
# routes.rbで定義されたエラーページ用のルートが正しく設定されているかを確認
# ルーティングテストは、URLパスが正しいコントローラー・アクションにマッピングされているかをテストします
RSpec.describe "Error routing", type: :routing do
  # エラーページのルート設定テスト
  describe "エラーページのルート設定" do
    # テスト1: /404パスが正しくErrorsController#not_foundにルーティングされるか
    it "/404パスがerrors#not_foundにルーティングされること" do
      # GETリクエスト: 通常のブラウザアクセス（最も一般的）
      expect(get: "/404").to route_to("errors#not_found")

      # POSTリクエスト: フォーム送信後のエラー時
      expect(post: "/404").to route_to("errors#not_found")

      # PUTリクエスト: データ更新時のエラー時
      expect(put: "/404").to route_to("errors#not_found")

      # DELETEリクエスト: データ削除時のエラー時
      expect(delete: "/404").to route_to("errors#not_found")

      # 全てのHTTPメソッドでアクセス可能にすることで、
      # どんな操作中にエラーが発生してもエラーページが表示される
    end

    # テスト2: /500パスが正しくErrorsController#internal_server_errorにルーティングされるか
    it "/500パスがerrors#internal_server_errorにルーティングされること" do
      # GETリクエスト: ブラウザで直接エラーページにアクセス
      expect(get: "/500").to route_to("errors#internal_server_error")

      # POSTリクエスト: フォーム送信処理中のサーバーエラー
      expect(post: "/500").to route_to("errors#internal_server_error")

      # PUTリクエスト: データ更新処理中のサーバーエラー
      expect(put: "/500").to route_to("errors#internal_server_error")

      # DELETEリクエスト: データ削除処理中のサーバーエラー
      expect(delete: "/500").to route_to("errors#internal_server_error")

      # config/application.rbのconfig.exceptions_app = self.routes設定により、
      # Railsが内部的にこれらのルートを使用してエラーページを表示する
    end
  end
end
