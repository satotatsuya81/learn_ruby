require 'rails_helper'

# HomeController（トップページを表示するコントローラー）の単体テスト
# Controller Testは、コントローラーの各アクション（メソッド）が正しく動作するかをテストします
RSpec.describe HomeController, type: :controller do
  # GET #index アクション（トップページ表示処理）のテストグループ
  describe 'GET #index' do
    # テスト1: HTTPリクエストが成功するかをチェック
    # 目的: サーバーエラー（500番台）や見つからないエラー（404）が発生しないことを確認
    it 'returns a successful response' do
      get :index  # HomeController の index アクションに GET リクエストを送信
      expect(response).to have_http_status(:success)  # HTTPステータスコード 200（成功）が返ることを確認
    end

    # テスト2: 正しいビューテンプレートが表示されるかをチェック
    # 目的: index.html.erb ファイルが正しく呼び出されることを確認
    it 'renders the index template' do
      get :index  # HomeController の index アクションを呼び出し
      expect(response).to render_template(:index)  # app/views/home/index.html.erb が使われることを確認
    end

    # テスト3: コントローラーからビューに渡されるデータが正しいかをチェック
    # 目的: @page_title などのインスタンス変数が期待通りの値になることを確認
    it 'assigns instance variables for dashboard data' do
      get :index  # HomeController の index アクションを実行
      # assigns() は、コントローラーで設定されたインスタンス変数（@変数名）の値を取得する
      expect(assigns(:page_title)).to eq("Home")  # @page_title が "Home" に設定されることを確認
    end
  end
end
