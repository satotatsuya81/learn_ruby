require 'rails_helper'

RSpec.describe "business_cards/index", type: :view do
  let(:user) { create(:user, :activated) }

  # テスト用の名刺データを準備
  let(:business_card1) do
    create(:business_card,
            user: user,
            name: "田中太郎",
            company_name: "テスト株式会社",
            job_title: "営業部長",
            department: "営業部")
  end

  let(:business_card2) do
    create(:business_card,
            user: user,
            name: "佐藤花子",
            company_name: "サンプル商事",
            job_title: "",  # 空の役職でテスト
            department: "")  # 空の部署でテスト
  end

  context "名刺が存在する場合" do
    before do
      # ビューに渡すインスタンス変数を設定
      assign(:business_cards, [ business_card1, business_card2 ])
      render
    end

    it "ページタイトルが正しく表示されること" do
      expect(rendered).to match(/#{I18n.t('business_cards.index.title')}/)
    end

    it "各名刺がカード形式で表示されること" do
      # Bootstrap cardクラスの存在確認
      expect(rendered).to have_css('.card', count: 2)
      expect(rendered).to have_css('.card-body', count: 2)
      expect(rendered).to have_css('.card-title', count: 2)
    end

    it "名刺の基本情報（名前・会社名）が表示されること" do
      # 1つ目の名刺の情報
      expect(rendered).to include("田中太郎")
      expect(rendered).to include("テスト株式会社")

      # 2つ目の名刺の情報
      expect(rendered).to include("佐藤花子")
      expect(rendered).to include("サンプル商事")
    end

    it "役職と部署が存在する場合に表示されること" do
      expect(rendered).to include("営業部長")
      expect(rendered).to include("営業部")
    end

    it "各名刺に詳細ページへのリンクが存在すること" do
      expect(rendered).to have_link(I18n.t('business_cards.card.view_details'), count: 2)
      # 具体的なリンクパスもチェック
      expect(rendered).to have_link(I18n.t('business_cards.card.view_details'), href: business_card_path(business_card1))
      expect(rendered).to have_link(I18n.t('business_cards.card.view_details'), href: business_card_path(business_card2))
    end

    it "レスポンシブ対応のCSSクラスが適用されていること" do
      # Bootstrap グリッドシステムの確認
      expect(rendered).to have_css('.col-md-4')
      expect(rendered).to have_css('.mb-3')
    end
  end

  context "名刺が存在しない場合" do
    before do
      # 空の配列を設定
      assign(:business_cards, [])
      render
    end

    it "空状態のメッセージが表示されること" do
      expect(rendered).to include(I18n.t('business_cards.index.no_business_cards'))
    end

    it "カードが表示されないこと" do
      expect(rendered).not_to have_css('.card')
    end
  end
end
