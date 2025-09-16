require 'rails_helper'

# ApplicationController のテストクラス
# アプリケーション全体に共通する機能（認証、エラーハンドリング等）
RSpec.describe ApplicationController, type: :controller do
  # テスト用の匿名コントローラーを定義
  controller do
    # 通常のアクション（正常系テスト用）
    def index
      # シンプルなテキストレスポンスを返す
      render plain: 'test'
    end

    # ActiveRecord::RecordNotFound例外を意図的に発生させるアクション
    # データベースで該当レコードが見つからない場合のエラーハンドリングをテスト
    def trigger_record_not_found
      raise ActiveRecord::RecordNotFound
    end

    # ActionController::RoutingError例外を意図的に発生させるアクション
    # 存在しないルートにアクセスした場合のエラーハンドリングをテスト
    def trigger_routing_error
      raise ActionController::RoutingError, 'No route matches'
    end
  end

  # テスト実行前にルーティングを設定
  # RSpecでは実際のroutes.rbを使わず、テスト用のルーティングを定義
  before do
    routes.draw do
      # 匿名コントローラーのアクションにルーティングを設定
      get :index, to: 'anonymous#index'
      get :trigger_record_not_found, to: 'anonymous#trigger_record_not_found'
      get :trigger_routing_error, to: 'anonymous#trigger_routing_error'
      # エラーページ用のルーティングも設定
      match "/404", to: "errors#not_found", via: :all
    end
  end

  # 例外処理機能のテスト
  # ApplicationControllerに設定されたrescue_fromが正しく動作するかを確認
  describe "例外処理機能" do
    context "ActiveRecord::RoutingErrorが発生した場合" do
      it "404ページにリダイレクトすること" do
        # 例外を発生させるアクションを実行
        get :trigger_routing_error

        # 404エラーページ（/404）にリダイレクトされることを確認
        expect(response).to redirect_to("/404")
      end
    end

    context "ActiveRecord::RecordNotFoundが発生した場合" do
      it "500ページにリダイレクトすること" do
        # 例外を発生させるアクションを実行
        get :trigger_record_not_found

        # 500エラーページ（/500）にリダイレクトされることを確認
        expect(response).to redirect_to("/500")
      end
    end
  end

  # CSRF（Cross-Site Request Forgery）攻撃対策のテスト
  # セキュリティ機能が適切に有効化されているかを確認
  describe "CSRF攻撃対策" do
    it "CSRF保護が有効になっていること" do
      # forgery_protection_strategyでCSRF保護設定を確認
      expect(ApplicationController.forgery_protection_strategy).to eq(ActionController::RequestForgeryProtection::ProtectionMethods::Exception)
    end
  end

  describe "基本機能" do
    it "正常なGETリクエストが成功すること" do
      get :index
      expect(response).to have_http_status(:success)
      expect(response.body).to eq('test')
    end
  end
end
