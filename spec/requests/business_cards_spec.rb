require 'rails_helper'

RSpec.describe "BusinessCards", type: :request do
  # テスト用ユーザー作成、名刺のテストデータ作成
  let(:user) { create(:user, :activated) }
  let(:other_user) { create(:user, email: 'other@example.com') }
  let!(:user_business_card) { create(:business_card, user: user, name: "田中太郎") }
  let!(:other_user_business_card) { create(:business_card, user: other_user, name: "佐藤花子") }

   describe 'GET /business_cards' do
    context 'ログインしている場合' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end
      it 'レスポンスが成功し、ユーザーの名刺が表示されること' do
        get business_cards_path
        expect(response).to have_http_status(200)
        expect(response.body).to include(user_business_card.name)
        expect(response.body).not_to include(other_user_business_card.name)
      end

      it "インデックスページに正しいタイトルが表示されること" do
        get business_cards_path
        expect(response).to render_template(:index)
      end
    end

    context 'ログインしていない場合' do
      it 'ログインページにリダイレクトされること' do
        get business_cards_path
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
   end

   describe 'GET /business_cards/:id' do
    context 'ログインしている場合' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end

      it '自分の名刺の詳細ページが表示されること' do
        get business_card_path(user_business_card)
        expect(response).to have_http_status(200)
        expect(response.body).to include(user_business_card.name)
        expect(response.body).to include(user_business_card.company_name)
      end

      it '他人の名刺の詳細ページにアクセスするとトップページにリダイレクトされること' do
        get business_card_path(other_user_business_card)
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)
      end

      it "詳細ページに正しいタイトルが表示されること" do
        get business_card_path(user_business_card)
        expect(response).to render_template(:show)
      end

      it "他のユーザーの名刺詳細ページにアクセスするとエラーが発生すること" do
        expect {
          get business_card_path(other_user_business_card)
        }.not_to raise_error
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)
      end

      it "存在しない名刺IDにアクセスするとトップページにリダイレクトされること" do
        get business_card_path(id: 'nonexistent')
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(root_path)
      end

      it '類似名刺が正しく取得されること' do
        # 同じ会社の他の名刺を作成
        similar_card = create(:business_card,
                            user: user,
                            company_name: user_business_card.company_name,
                            name: "同僚太郎")

        get business_card_path(user_business_card)
        expect(assigns(:similar_cards)).to include(similar_card)
        expect(assigns(:similar_cards)).not_to include(user_business_card)
      end

      it '類似名刺は最大3件まで表示されること' do
        # 同じ会社の名刺を4件作成
        4.times do |i|
          create(:business_card,
                user: user,
                company_name: user_business_card.company_name,
                name: "同僚#{i}")
        end

        get business_card_path(user_business_card)
        expect(assigns(:similar_cards).count).to eq(3)
      end
    end

    context 'ログインしていない場合' do
      it 'ログインページにリダイレクトされること' do
        get business_card_path(user_business_card)
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
   end
end
