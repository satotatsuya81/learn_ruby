require 'rails_helper'

RSpec.describe BusinessCard, type: :model do
  describe "アソシエーションのテスト" do
    it "Userモデルと関連付けられていること" do
      should belong_to(:user)
    end
  end
  describe "バリデーション機能" do
    it "名前の必須チェック" do
      should validate_presence_of(:name)
    end

    it "会社名の必須チェック" do
      should validate_presence_of(:company_name)
    end

    it "名前の文字数制限" do
      should validate_length_of(:name).is_at_most(100)
    end

    it "会社名の文字数制限" do
      should validate_length_of(:company_name).is_at_most(100)
    end

    it "Eメールのフォーマットチェック" do
      should allow_value("test@example.com").for(:email)
      should_not allow_value("invalid_email").for(:email)
    end
  end

  describe "スコープメソッドのテスト" do
    let(:user) { create(:user) }
    let!(:card1) { create(:business_card, user: user, name: "Alice", company_name: "Acme Corp") }
    let!(:card2) { create(:business_card, user: user, name: "Bob", company_name: "Beta Inc") }
    let!(:card3) { create(:business_card, user: user, name: "Charlie", company_name: "Acme Corp") }

    describe ".by_company" do
      it "会社名で検索できること" do
        expect(BusinessCard.by_company("Acme Corp")).to eq([ card1, card3 ])
      end
    end

    describe ".recent" do
      it "作成日時で降順に並び替えられること" do
        expect(BusinessCard.recent).to eq([ card3, card2, card1 ])
      end
    end
  end
  describe "インスタンスメソッドのテスト" do
    let(:user) { create(:user) }
    let(:business_card) { create(:business_card, user: user) }

    describe "#full_name_with_company" do
      it "会社名と名前を組み合わせたフルタイトルを返すこと" do
        expect(business_card.full_name_with_company).to eq("#{business_card.name} (#{business_card.company_name})")
      end
    end

    describe "#contact_available?" do
      it "Eメールが存在する場合、trueを返すこと" do
        business_card.email = "test@example.com"
        expect(business_card.contact_available?).to be_truthy
      end

      it "電話番号が存在する場合、trueを返すこと" do
        business_card.phone = "123-456-7890"
        expect(business_card.contact_available?).to be_truthy
      end

      it "モバイル番号が存在する場合、trueを返すこと" do
        business_card.mobile = "098-765-4321"
        expect(business_card.contact_available?).to be_truthy
      end

      it "連絡手段が一つも存在しない場合、falseを返すこと" do
        business_card.email = nil
        business_card.phone = nil
        business_card.mobile = nil
        expect(business_card.contact_available?).to be_falsey
      end
    end
  end
end
