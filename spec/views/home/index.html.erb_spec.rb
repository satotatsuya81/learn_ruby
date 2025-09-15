require 'rails_helper'

# home/index.html.erb（トップページのビューテンプレート）のテスト
# View Test は、ERBテンプレートがレンダリングされて生成されるHTMLが正しいかをテストします
# Controller Test との違い: HTMLの見た目や構造を詳細にテストできる
RSpec.describe 'home/index.html.erb', type: :view do
  before do
    # テスト前の準備: コントローラーからビューに渡されるインスタンス変数を設定
    # assign() は、@page_title のようなインスタンス変数をテスト環境で設定するメソッド
    assign(:page_title, 'Home')
  end

  # ページ構造のテストグループ
  describe 'Page structure' do

    # テスト1: HTML構造が期待通りに生成されるかをチェック
    # 目的: デザインの基本構造が正しく、必要な要素がすべて含まれていることを確認
    it 'renders proper HTML structure' do
      render  # ERBテンプレートをレンダリング（HTMLに変換）

      # Jumbotron（メイン見出し）セクションの確認
      expect(rendered).to have_css('.jumbotron')    # Bootstrap の大きな見出し領域
      expect(rendered).to have_css('h1.display-4')  # Bootstrap の大きな見出しクラス
      expect(rendered).to have_css('p.lead')        # Bootstrap の強調段落クラス
      expect(rendered).to have_css('hr.my-4')       # Bootstrap の区切り線クラス

      # メインコンテンツのグリッドシステムの確認
      expect(rendered).to have_css('.row')          # Bootstrap の行（横一列のコンテナ）
      expect(rendered).to have_css('.col-md-4', count: 3)  # Bootstrap の列（3つの列が存在）

      # セクション見出しの確認
      expect(rendered).to have_css('h3', count: 3)  # h3見出しが3つ存在（主な機能、今後の予定、技術スタック）

      # 機能リストの確認
      expect(rendered).to have_css('ul.list-unstyled', count: 3)  # Bootstrap のリストスタイル（3つのリスト）
    end

    # テスト2: Bootstrap CSSクラスが正しく適用されているかをチェック
    # 目的: 見た目（色、余白、角丸など）が期待通りになるクラスが設定されていることを確認
    it 'has proper Bootstrap classes' do
      render

      # Bootstrap のスタイルクラスの確認
      expect(rendered).to have_css('.bg-light')    # 薄いグレー背景
      expect(rendered).to have_css('.p-5')         # 大きなパディング（内側余白）
      expect(rendered).to have_css('.rounded-lg')  # 大きな角丸
      expect(rendered).to have_css('.mb-4')        # 下マージン（外側余白）
    end
  end

  # コンテンツ表示のテストグループ
  describe 'Content rendering' do

    # 日本語ロケールでのテスト
    context 'when locale is Japanese' do
      before { I18n.locale = :ja }    # テスト前に日本語ロケールに設定
      after { I18n.locale = I18n.default_locale }  # テスト後にデフォルトロケールに戻す

      # テスト3: アプリケーション名と説明が日本語で表示されるかをチェック
      # 目的: 基本的なアプリケーション情報が正しく翻訳されて表示されることを確認
      it 'renders application name and description' do
        render

        # 国際化（i18n）された文字列が正しく表示されることを確認
        expect(rendered).to include(I18n.t('application.name'))        # アプリケーション名
        expect(rendered).to include(I18n.t('application.description')) # アプリケーション説明
        expect(rendered).to include(I18n.t('messages.welcome'))        # 歓迎メッセージ
      end

      # テスト4: セクション見出しが日本語で表示されるかをチェック
      # 目的: 各セクションのタイトルが適切に翻訳されていることを確認
      it 'renders all section headings in Japanese' do
        render

        # 各セクション見出しの翻訳確認
        expect(rendered).to include(I18n.t('sections.main_features'))  # "主な機能"
        expect(rendered).to include(I18n.t('sections.future_plans'))   # "今後の予定"
        expect(rendered).to include(I18n.t('sections.tech_stack'))     # "技術スタック"
      end

      # テスト5: 機能一覧が日本語で表示されるかをチェック
      # 目的: すべての機能説明が適切に翻訳されていることを確認
      it 'renders feature items in Japanese' do
        render

        # 主な機能の翻訳確認
        expect(rendered).to include(I18n.t('features.card_management'))  # "名刺の管理"
        expect(rendered).to include(I18n.t('features.tagging'))          # "タグ付けと分類"
        expect(rendered).to include(I18n.t('features.search'))           # "高速検索"
        expect(rendered).to include(I18n.t('features.analytics'))        # "統計・分析"

        # 今後の予定の翻訳確認
        expect(rendered).to include(I18n.t('future_plans.authentication'))  # "ユーザー認証"
        expect(rendered).to include(I18n.t('future_plans.responsive'))      # "レスポンシブ対応"
        expect(rendered).to include(I18n.t('future_plans.ocr'))             # "OCR機能"
        expect(rendered).to include(I18n.t('future_plans.dashboard'))       # "ダッシュボード"

        # 技術スタックの翻訳確認
        expect(rendered).to include(I18n.t('tech_stack.rails'))      # "Ruby on Rails"
        expect(rendered).to include(I18n.t('tech_stack.bootstrap'))  # "Bootstrap 5"
        expect(rendered).to include(I18n.t('tech_stack.mysql'))      # "MySQL"
        expect(rendered).to include(I18n.t('tech_stack.react'))      # "React (予定)"
      end

      # テスト6: 絵文字アイコンが正しく表示されるかをチェック
      # 目的: 視覚的な要素（絵文字）が適切に配置されていることを確認
      it 'includes emoji icons' do
        render

        # 各機能に対応する絵文字の存在確認
        expect(rendered).to include('📇')  # 名刺管理
        expect(rendered).to include('🏷️')  # タグ付け
        expect(rendered).to include('🔍')  # 検索
        expect(rendered).to include('📊')  # 統計
        expect(rendered).to include('🔐')  # 認証
        expect(rendered).to include('📱')  # レスポンシブ
        expect(rendered).to include('🤖')  # OCR
        expect(rendered).to include('📈')  # ダッシュボード
        expect(rendered).to include('💎')  # Ruby
        expect(rendered).to include('🅱️')  # Bootstrap
        expect(rendered).to include('🗄️')  # MySQL
        expect(rendered).to include('⚛️')  # React
      end
    end

    # 英語ロケールでのテスト
    context 'when locale is English' do
      before { I18n.locale = :en }    # テスト前に英語ロケールに設定
      after { I18n.locale = I18n.default_locale }  # テスト後にデフォルトロケールに戻す

      # テスト7: アプリケーション名と説明が英語で表示されるかをチェック
      # 目的: 英語ユーザー向けに適切な翻訳がされていることを確認
      it 'renders application name and description in English' do
        render

        # 英語での翻訳確認
        expect(rendered).to include(I18n.t('application.name'))        # "Business Card Manager"
        expect(rendered).to include(I18n.t('application.description')) # "Efficient business card management system"
        expect(rendered).to include(I18n.t('messages.welcome'))        # "Welcome to Business Card Management System"
      end

      # テスト8: セクション見出しが英語で表示されるかをチェック
      # 目的: 英語でのナビゲーションが適切に機能することを確認
      it 'renders all section headings in English' do
        render

        # 英語でのセクション見出し確認
        expect(rendered).to include(I18n.t('sections.main_features'))  # "Main Features"
        expect(rendered).to include(I18n.t('sections.future_plans'))   # "Future Plans"
        expect(rendered).to include(I18n.t('sections.tech_stack'))     # "Tech Stack"
      end

      # テスト9: 機能一覧が英語で表示されるかをチェック
      # 目的: すべての機能説明が英語ユーザーにも理解できる形で表示されることを確認
      it 'renders feature items in English' do
        render

        # 主な機能の英語翻訳確認
        expect(rendered).to include(I18n.t('features.card_management'))  # "Business card management"
        expect(rendered).to include(I18n.t('features.tagging'))          # "Tagging and classification"
        expect(rendered).to include(I18n.t('features.search'))           # "Fast search"
        expect(rendered).to include(I18n.t('features.analytics'))        # "Statistics and analytics"

        # 今後の予定の英語翻訳確認
        expect(rendered).to include(I18n.t('future_plans.authentication'))  # "User authentication"
        expect(rendered).to include(I18n.t('future_plans.responsive'))      # "Responsive design"
        expect(rendered).to include(I18n.t('future_plans.ocr'))             # "OCR functionality"
        expect(rendered).to include(I18n.t('future_plans.dashboard'))       # "Dashboard"

        # 技術スタックの英語翻訳確認
        expect(rendered).to include(I18n.t('tech_stack.rails'))      # "Ruby on Rails"
        expect(rendered).to include(I18n.t('tech_stack.bootstrap'))  # "Bootstrap 5"
        expect(rendered).to include(I18n.t('tech_stack.mysql'))      # "MySQL"
        expect(rendered).to include(I18n.t('tech_stack.react'))      # "React (planned)"
      end
    end

    # テスト10: 翻訳が見つからない場合の処理をチェック
    # 目的: 翻訳ファイルに不備があってもアプリケーションがクラッシュしないことを確認
    it 'handles missing translations gracefully' do
      # 翻訳が見つからない状況をシミュレート
      allow(I18n).to receive(:t).and_return('translation missing')

      # エラーが発生せずにレンダリングできることを確認
      expect { render }.not_to raise_error
    end
  end


  # アクセシビリティ（障害者対応）のテストグループ
  describe 'Accessibility' do

    # テスト11: 見出しの階層構造が正しいかをチェック
    # 目的: スクリーンリーダー使用者が内容を理解しやすいよう、見出しが適切に構造化されていることを確認
    it 'has proper heading hierarchy' do
      render

      # メイン見出し（h1）が1つだけ存在することを確認（SEOとアクセシビリティの基本）
      expect(rendered).to have_css('h1', count: 1)

      # セクション見出し（h3）が3つ存在することを確認（h2をスキップしているが階層は維持）
      expect(rendered).to have_css('h3', count: 3)
    end

    # テスト12: セマンティックHTML（意味のあるHTML）構造が使われているかをチェック
    # 目的: 支援技術（スクリーンリーダーなど）が内容を正しく解釈できることを確認
    it 'has semantic HTML structure' do
      render

      # リスト要素が適切にマークアップされていることを確認
      expect(rendered).to have_css('ul')  # 順序なしリスト
      expect(rendered).to have_css('li')  # リストアイテム

      # 段落構造が適切に使われていることを確認
      expect(rendered).to have_css('p')   # 段落要素
    end
  end

  # レスポンシブデザイン（様々な画面サイズ対応）のテストグループ
  describe 'Responsive design' do

    # テスト13: Bootstrap グリッドシステムが正しく使われているかをチェック
    # 目的: スマホ・タブレット・PCで適切にレイアウトが調整されることを確認
    it 'includes responsive grid classes' do
      render

      # Bootstrap のグリッドシステムクラスの確認
      expect(rendered).to have_css('.col-md-4')  # 中画面以上で4/12幅の列
      expect(rendered).to have_css('.row')       # グリッドの行
    end

    # テスト14: レスポンシブユーティリティクラスが適用されているかをチェック
    # 目的: 異なる画面サイズで適切な余白や間隔が確保されることを確認
    it 'has responsive utility classes' do
      render

      # Bootstrap のユーティリティクラスの確認
      expect(rendered).to have_css('.mb-4')  # Margin bottom（下余白）
      expect(rendered).to have_css('.p-5')   # Padding（内側余白）
      expect(rendered).to have_css('.my-4')  # Margin y-axis（上下余白）
    end
  end
end
