require 'rails_helper'

RSpec.describe "BusinessCards i18n", type: :view do
  let(:user) { create(:user, :activated) }
  let(:business_card) { create(:business_card, user: user) }

  describe "日本語ロケール" do
    before { I18n.locale = :ja }
    after { I18n.locale = I18n.default_locale }

    context "index.html.erb" do
      it "日本語のタイトルが表示される" do
        assign(:business_cards, [])
        render template: "business_cards/index"
        expect(rendered).to include("名刺一覧")
      end

      it "空状態メッセージが日本語で表示される" do
        assign(:business_cards, [])
        render template: "business_cards/index"
        expect(rendered).to include("まだ名刺が登録されていません。")
      end
    end

    context "show.html.erb" do
      before do
        assign(:business_card, business_card)
        assign(:similar_cards, [])
        render template: "business_cards/show"
      end

      it "日本語のラベルが表示される" do
        expect(rendered).to include("役職:")
        expect(rendered).to include("部署:")
        expect(rendered).to include("メール:")
        expect(rendered).to include("電話:")
      end

      it "戻るボタンが日本語で表示される" do
        expect(rendered).to include("一覧に戻る")
      end
    end

    context "_business_card.html.erb パーシャル" do
      before do
        render partial: "business_cards/business_card", locals: {
          business_card: business_card,
          show_details: true
        }
      end

      it "詳細表示ボタンが日本語で表示される" do
        expect(rendered).to include("詳細を見る")
      end

      it "aria-labelが日本語で設定される" do
        expect(rendered).to have_css('[aria-label="名前"]')
        expect(rendered).to have_css('[aria-label="会社名"]')
      end
    end
  end

  describe "英語ロケール" do
    before { I18n.locale = :en }
    after { I18n.locale = I18n.default_locale }

    context "index.html.erb" do
      it "英語のタイトルが表示される" do
        assign(:business_cards, [])
        render template: "business_cards/index"
        expect(rendered).to include("Business Cards")
      end

      it "空状態メッセージが英語で表示される" do
        assign(:business_cards, [])
        render template: "business_cards/index"
        expect(rendered).to include("No business cards have been registered yet.")
      end
    end

    context "show.html.erb" do
      before do
        assign(:business_card, business_card)
        assign(:similar_cards, [])
        render template: "business_cards/show"
      end

      it "英語のラベルが表示される" do
        expect(rendered).to include("Job Title:")
        expect(rendered).to include("Department:")
        expect(rendered).to include("Email:")
        expect(rendered).to include("Phone:")
      end

      it "戻るボタンが英語で表示される" do
        expect(rendered).to include("Back to List")
      end
    end

    context "_business_card.html.erb パーシャル" do
      before do
        render partial: "business_cards/business_card", locals: {
          business_card: business_card,
          show_details: true
        }
      end

      it "詳細表示ボタンが英語で表示される" do
        expect(rendered).to include("View Details")
      end

      it "aria-labelが英語で設定される" do
        expect(rendered).to have_css('[aria-label="Name"]')
        expect(rendered).to have_css('[aria-label="Company"]')
      end
    end
  end

  describe "ロケール切り替え" do
    it "デフォルトロケールが日本語に設定されている" do
      expect(I18n.default_locale).to eq(:ja)
    end

    it "利用可能なロケールに日本語と英語が含まれる" do
      expect(I18n.available_locales).to include(:ja, :en)
    end

    it "翻訳キーが正しく設定されている" do
      I18n.locale = :ja
      expect(I18n.t('business_cards.index.title')).to eq('名刺一覧')

      I18n.locale = :en
      expect(I18n.t('business_cards.index.title')).to eq('Business Cards')
    end
  end
end