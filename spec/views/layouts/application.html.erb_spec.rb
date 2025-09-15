require 'rails_helper'

# レイアウトテンプレート（app/views/layouts/application.html.erb）のテスト
# Layout Test は、アプリケーション全体で共通して使われるHTMLの枠組みが正しいかをテストします
# すべてのページで表示される共通要素（ヘッダー、フッター、メタタグなど）のテストを行います
RSpec.describe 'layouts/application.html.erb', type: :view do
  before do
    # テスト前の準備: Railsのヘルパーメソッドの動作をモック（偽の動作）で設定
    # これにより、テスト環境で予測可能な結果を得ることができます
    allow(view).to receive(:content_for?).and_return(false)    # content_for?ヘルパーは常にfalseを返す
    allow(view).to receive(:content_for).and_return("")        # content_forヘルパーは空文字を返す
    allow(view).to receive(:notice).and_return(nil)            # フラッシュメッセージ（成功通知）はなし
    allow(view).to receive(:alert).and_return(nil)             # フラッシュメッセージ（エラー通知）はなし
  end

  # テスト1: HTMLの基本構造が正しく生成されるかをチェック
  # 目的: ブラウザが正しく解釈できるHTML5文書として適切な要素が含まれていることを確認
  it 'renders the basic HTML structure' do
    render  # レイアウトテンプレートをレンダリング（HTMLに変換）

    # HTML5文書の基本要素の確認
    expect(rendered).to have_css('html[lang="ja"]')        # 日本語設定のhtml要素
    expect(rendered).to have_css('title', visible: false)  # titleタグ（SEOで重要、画面には非表示）
    expect(rendered).to have_css('body')                   # bodyタグ（ページの本文）

    # HTMLの必須構造要素が含まれていることを確認
    expect(rendered).to include('<!DOCTYPE html>')  # HTML5宣言（ブラウザにHTML5として解釈させる）
    expect(rendered).to include('<html lang="ja">') # 日本語言語設定（スクリーンリーダーや検索エンジン用）
    expect(rendered).to include('<head>')           # ヘッド部分（メタ情報、CSS、JSのリンク）
    expect(rendered).to include('<body>')           # ボディ部分（実際に表示される内容）
    expect(rendered).to include('</html>')          # HTML終了タグ
  end

  # テスト2: 必要なメタタグが含まれているかをチェック
  # 目的: モバイル対応（レスポンシブデザイン）に必要なviewportメタタグが設定されていることを確認
  it 'includes required meta tags' do
    render  # レイアウトテンプレートをレンダリング

    # viewportメタタグの確認（スマホ・タブレット表示で重要）
    expect(rendered).to include('<meta name="viewport"')                          # viewportメタタグの存在
    expect(rendered).to include('content="width=device-width,initial-scale=1"')   # デバイス幅に合わせて表示、初期倍率1倍
  end

  # テスト3: Bootstrap CSS と JavaScript が読み込まれているかをチェック
  # 目的: レスポンシブデザインとモダンなUI要素のためのBootstrap5が正しく読み込まれることを確認
  it 'includes Bootstrap CSS and JS' do
    render  # レイアウトテンプレートをレンダリング

    # Bootstrap CSSの読み込み確認（デザイン・レイアウト用）
    expect(rendered).to include('bootstrap@5.3.0/dist/css/bootstrap.min.css')    # CDNからのCSS読み込み

    # Bootstrap JavaScriptの読み込み確認（ドロップダウン、モーダルなどの動的機能用）
    expect(rendered).to include('bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js')  # CDNからのJS読み込み
  end

  # テスト4: ヘッダーとフッターのパーシャル（部分テンプレート）が正しく表示されるかをチェック
  # 目的: 共通要素（ナビゲーション・コピーライト表示）が全ページで統一して表示されることを確認
  it 'renders header and footer partials' do
    render  # レイアウトテンプレートをレンダリング

    # パーシャルテンプレートの読み込み確認
    expect(view).to render_template(partial: 'shared/_header')  # ヘッダー部分テンプレートが使われているか
    expect(view).to render_template(partial: 'shared/_footer')  # フッター部分テンプレートが使われているか
  end

  # テスト5: メインコンテンツエリアが適切なCSSクラスで構成されているかをチェック
  # 目的: 中央寄せレイアウトと適切な上マージンでコンテンツが配置されることを確認
  it 'has main content area with proper classes' do
    render  # レイアウトテンプレートをレンダリング

    # メインコンテンツエリアのBootstrapクラス確認
    expect(rendered).to have_css('main.container.mt-4')  # main要素 + containerクラス（中央寄せ）+ mt-4クラス（上マージン）
  end

  # テスト6: HTML文書の構造が適切かを包括的にチェック
  # 目的: SEO・アクセシビリティ・多言語対応の基本要件が満たされていることを確認
  it 'has proper HTML document structure' do
    render  # レイアウトテンプレートをレンダリング

    # DOCTYPE宣言の確認（HTML5標準準拠のため）
    expect(rendered).to start_with('<!DOCTYPE html>')  # 文書がHTML5宣言で始まっているか

    # 言語属性の確認（SEOと支援技術のため）
    expect(rendered).to include('lang="ja"')  # 日本語言語設定がされているか

    # viewport meta tagの確認（モバイル対応のため）
    expect(rendered).to include('viewport')  # viewport設定が含まれているか
  end

  # フラッシュメッセージ（一時的な通知）表示のテストグループ
  # フラッシュメッセージは、ユーザーのアクション（保存成功、エラーなど）を一時的に表示する機能
  describe 'Flash messages' do
    # テスト7: 成功メッセージ（notice）が表示される場合のテスト
    # 目的: データ保存成功時などに緑色の成功メッセージが適切に表示されることを確認
    it 'renders success flash when notice is present' do
      # テスト用のフラッシュメッセージを設定
      assign(:notice, 'Success message')                          # コントローラーから渡される変数を設定
      allow(view).to receive(:notice).and_return('Success message')  # ビューヘルパーの戻り値を設定

      render  # レイアウトテンプレートをレンダリング

      # 成功メッセージの表示確認
      expect(rendered).to include('alert-success')   # Bootstrap の成功メッセージクラス（緑色背景）
      expect(rendered).to include('Success message')  # 実際のメッセージ内容
    end

    # テスト8: エラーメッセージ（alert）が表示される場合のテスト
    # 目的: データ保存失敗時などに赤色のエラーメッセージが適切に表示されることを確認
    it 'renders error flash when alert is present' do
      # テスト用のエラーメッセージを設定
      assign(:alert, 'Error message')                          # コントローラーから渡されるエラー変数を設定
      allow(view).to receive(:alert).and_return('Error message')  # ビューヘルパーの戻り値を設定

      render  # レイアウトテンプレートをレンダリング

      # エラーメッセージの表示確認
      expect(rendered).to include('alert-danger')   # Bootstrap のエラーメッセージクラス（赤色背景）
      expect(rendered).to include('Error message')  # 実際のエラーメッセージ内容
    end

    # テスト9: フラッシュメッセージがない場合にメッセージ用の要素が表示されないことをテスト
    # 目的: 不要な空白や枠が表示されず、すっきりしたレイアウトが維持されることを確認
    it 'does not render flash containers when no flash messages' do
      render  # レイアウトテンプレートをレンダリング（フラッシュメッセージはない状態）

      # フラッシュメッセージ用のコンテナが表示されないことを確認
      expect(rendered).not_to include('alert-success')  # 成功メッセージの枠が表示されていないか
      expect(rendered).not_to include('alert-danger')   # エラーメッセージの枠が表示されていないか
    end
  end
end
