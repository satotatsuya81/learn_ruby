require 'rails_helper'

RSpec.describe "business_cards/_business_card.html.erb", type: :view do
  let(:business_card) { create(:business_card,
    name: "田中 太郎",
    company_name: "株式会社サンプル",
    department: "営業部",
    job_title: "課長",
    email: "tanaka@sample.co.jp",
    phone: "03-1234-5678",
    mobile: "090-1234-5678",
    website: "https://example.com",
    address: "東京都渋谷区1-2-3",
    notes: "重要な顧客"
  )}

  context "デフォルト表示（基本情報のみ）" do
    before do
      render partial: "business_cards/business_card", locals: { business_card: business_card }
    end

    it "名前が表示される" do
      expect(rendered).to include("田中 太郎")
    end

    it "会社名が表示される" do
      expect(rendered).to include("株式会社サンプル")
    end

    it "部署名が表示される" do
      expect(rendered).to include("営業部")
    end

    it "役職が表示される" do
      expect(rendered).to include("課長")
    end

    it "適切なCSSクラスが設定されている" do
      expect(rendered).to have_css('.card')
      expect(rendered).to have_css('.card-body')
    end

    it "名前にaria-label属性が設定されている" do
      expect(rendered).to have_css('h5[aria-label="名前"]')
    end

    it "会社名にaria-label属性が設定されている" do
      expect(rendered).to have_css('div[aria-label="会社名"]')
    end

    it "詳細情報（メール・電話）が表示されない" do
      expect(rendered).not_to include("tanaka@sample.co.jp")
      expect(rendered).not_to include("03-1234-5678")
    end

    it "アクションボタンが表示される" do
      expect(rendered).to have_link("詳細を見る")
    end

    context "部署名がnilの場合" do
      let(:business_card) { create(:business_card, department: nil) }

      it "部署名の項目が表示されない、またはN/Aが表示される" do
        expect(rendered).not_to include("部署:")
      end
    end

    context "役職がnilの場合" do
      let(:business_card) { create(:business_card, job_title: nil) }

      it "役職の項目が表示されない、またはN/Aが表示される" do
        expect(rendered).not_to include("役職:")
      end
    end
  end

  context "詳細表示モード（show_details: true）" do
    before do
      render partial: "business_cards/business_card", locals: {
        business_card: business_card,
        show_details: true
      }
    end

    it "メールアドレスがmailtoリンクとして表示される" do
      expect(rendered).to have_link("tanaka@sample.co.jp", href: "mailto:tanaka@sample.co.jp")
    end

    it "電話番号がtelリンクとして表示される" do
      expect(rendered).to have_link("03-1234-5678", href: "tel:03-1234-5678")
    end

    it "携帯番号が表示される" do
      expect(rendered).to have_link("090-1234-5678", href: "tel:090-1234-5678")
    end

    it "ウェブサイトがリンクとして表示される" do
      expect(rendered).to have_link("https://example.com", href: "https://example.com")
    end

    it "住所が表示される" do
      expect(rendered).to include("東京都渋谷区1-2-3")
    end

    it "メモが表示される" do
      expect(rendered).to include("重要な顧客")
    end

    it "メールリンクにaria-label属性が設定されている" do
      expect(rendered).to have_css('a[aria-label="メールを送信"]')
    end

    it "電話リンクにaria-label属性が設定されている" do
      expect(rendered).to have_css('a[aria-label="電話をかける"]')
    end
  end

  context "コンパクト表示モード（compact: true）" do
    before do
      render partial: "business_cards/business_card", locals: {
        business_card: business_card,
        compact: true
      }
    end

    it "コンパクトなカードクラスが適用される" do
      expect(rendered).to have_css('.card.border-light')
      expect(rendered).to have_css('.card-body.p-2')
    end

    it "名前がh6タグで表示される" do
      expect(rendered).to have_css('h6[aria-label="名前"]')
    end

    it "役職がコンパクト形式で表示される" do
      expect(rendered).to have_css('.small.text-muted')
    end

    it "部署名が表示されない（コンパクトモード）" do
      expect(rendered).not_to include("部署:")
    end

    it "コンパクトなアクションボタンが表示される" do
      expect(rendered).to have_link("詳細", class: "btn-outline-primary")
    end
  end

  # HTMLエスケープのセキュリティテスト
  context "悪意のあるHTMLが含まれている場合" do
    let(:business_card) { create(:business_card,
      name: "<script>alert('XSS')</script>田中太郎",
      email: "test@example.com",
      phone: "<script>alert('XSS')</script>03-1234-5678"
    )}

    before do
      render partial: "business_cards/business_card", locals: {
        business_card: business_card,
        show_details: true
      }
    end

    it "名前のHTMLがエスケープされて安全に表示される" do
      expect(rendered).to include("&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;田中太郎")
      expect(rendered).not_to include("<script>alert('XSS')</script>")
    end

    it "電話番号のHTMLがエスケープされる" do
      expect(rendered).to include("&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;03-1234-5678")
      expect(rendered).not_to include("<script>alert('XSS')</script>03-1234-5678")
    end
  end
end