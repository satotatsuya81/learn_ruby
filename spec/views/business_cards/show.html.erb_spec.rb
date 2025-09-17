require 'rails_helper'

  RSpec.describe "business_cards/show", type: :view do
    let(:user) { create(:user, :activated) }
    let(:business_card) do
      create(:business_card,
             user: user,
             name: "田中太郎",
             company_name: "テスト株式会社",
             job_title: "営業部長",
             department: "営業部",
             email: "tanaka@test.co.jp",
             phone: "03-1234-5678",
             mobile: "090-1234-5678",
             website: "https://www.test.co.jp",
             address: "東京都渋谷区テスト1-2-3",
             notes: "重要な取引先")
    end

    let(:similar_card1) do
      create(:business_card,
             user: user,
             name: "佐藤花子",
             company_name: "テスト株式会社",
             job_title: "営業課長")
    end

    let(:similar_card2) do
      create(:business_card,
             user: user,
             name: "鈴木一郎",
             company_name: "テスト株式会社",
             job_title: "営業担当")
    end

    context "詳細情報の表示" do
      before do
        assign(:business_card, business_card)
        assign(:similar_cards, [])
        render
      end

      it "名刺の基本情報が正しく表示されること" do
        expect(rendered).to include("田中太郎")
        expect(rendered).to include("テスト株式会社")
        expect(rendered).to include("営業部長")
        expect(rendered).to include("営業部")
      end

      it "連絡先情報が正しく表示されること" do
        expect(rendered).to include("tanaka@test.co.jp")
        expect(rendered).to include("03-1234-5678")
        expect(rendered).to include("090-1234-5678")
        expect(rendered).to include("https://www.test.co.jp")
      end

      it "住所とメモが正しく表示されること" do
        expect(rendered).to include("東京都渋谷区テスト1-2-3")
        expect(rendered).to include("重要な取引先")
      end

      it "一覧に戻るリンクが存在すること" do
        expect(rendered).to have_link("一覧に戻る", href: business_cards_path)
      end

      it "ページタイトルが正しく設定されること" do
        expect(view.content_for(:title)).to eq("田中太郎 - 名刺詳細")
      end
    end

    context "類似名刺の表示" do
      context "類似名刺が存在する場合" do
        before do
          assign(:business_card, business_card)
          assign(:similar_cards, [ similar_card1, similar_card2 ])
          render
        end

        it "類似名刺セクションが表示されること" do
          expect(rendered).to include("同じ会社の名刺")
        end

        it "類似名刺の名前と役職が表示されること" do
          expect(rendered).to include("佐藤花子")
          expect(rendered).to include("営業課長")
          expect(rendered).to include("鈴木一郎")
          expect(rendered).to include("営業担当")
        end

        it "各類似名刺に詳細リンクが存在すること" do
          expect(rendered).to have_link("詳細", href: business_card_path(similar_card1))
          expect(rendered).to have_link("詳細", href: business_card_path(similar_card2))
        end

        it "類似名刺がカード形式で表示されること" do
          expect(rendered).to have_css('.card .card-body', minimum: 3) # メイン + 類似名刺2つ
        end
      end

      context "類似名刺が存在しない場合" do
        before do
          assign(:business_card, business_card)
          assign(:similar_cards, [])
          render
        end

        it "類似名刺セクションが表示されないこと" do
          expect(rendered).not_to include("同じ会社の名刺")
        end
      end
    end

    context "空の項目の処理" do
      let(:minimal_card) do
        create(:business_card,
               user: user,
               name: "山田太郎",
               company_name: "ミニマル会社",
               job_title: "",
               department: "",
               email: "",
               phone: "",
               mobile: "",
               website: "",
               address: "",
               notes: "")
      end

      before do
        assign(:business_card, minimal_card)
        assign(:similar_cards, [])
        render
      end

      it "空の項目は表示されないこと" do
        expect(rendered).not_to include("役職:")
        expect(rendered).not_to include("部署:")
        expect(rendered).not_to include("Email:")
        expect(rendered).not_to include("電話番号:")
        expect(rendered).not_to include("携帯番号:")
        expect(rendered).not_to include("ウェブサイト:")
        expect(rendered).not_to include("住所:")
        expect(rendered).not_to include("メモ:")
      end

      it "必須項目は必ず表示されること" do
        expect(rendered).to include("山田太郎")
        expect(rendered).to include("ミニマル会社")
      end
    end
  end
