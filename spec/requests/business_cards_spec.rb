require 'rails_helper'
require 'json'
require 'cgi'

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
        # HTML形式
        get business_cards_path
        expect(response).to have_http_status(200)
        expect(response.content_type).to include('text/html')
        expect(response.body).to include(user_business_card.name)
        expect(response.body).not_to include(other_user_business_card.name)

        # JSON形式
        get business_cards_path, headers: { 'Accept' => 'application/json' }
        expect(response).to have_http_status(200)
        expect(response.content_type).to eq('application/json; charset=utf-8')

        json_response = JSON.parse(response.body)
        names = json_response['data'].map { |card| card['name'] }
        expect(names).to include(user_business_card.name)
        expect(names).not_to include(other_user_business_card.name)
      end

      it "インデックスページに正しいタイトルが表示されること" do
        get business_cards_path
        expect(response).to render_template(:index)
      end
    end

    context 'ログインしていない場合' do
      it 'ログインページにリダイレクトされること' do
        # HTML形式
        get business_cards_path
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)

        # JSON形式でも同様にリダイレクト
        get business_cards_path, headers: { 'Accept' => 'application/json' }
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
        # HTML形式
        get business_card_path(user_business_card)
        expect(response).to have_http_status(200)
        expect(response.body).to include(user_business_card.name)
        expect(response.body).to include(user_business_card.company_name)

        # JSON形式
        get business_card_path(user_business_card), headers: { 'Accept' => 'application/json' }
        expect(response).to have_http_status(200)
        expect(response.content_type).to eq('application/json; charset=utf-8')

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']['id']).to eq(user_business_card.id)
        expect(json_response['data']['name']).to eq(user_business_card.name)
        expect(json_response['data']['company_name']).to eq(user_business_card.company_name)
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
        # レスポンスが成功すること
        expect(response).to have_http_status(:ok)

        # React BusinessCardDetailコンポーネントのdata属性が存在すること
        expect(response.body).to include('data-controller="business-card-detail"')
        expect(response.body).to include('data-business-card-detail-similar-cards-value')

        # 類似名刺のデータがdata属性に含まれること
        expect(response.body).to include(similar_card.name)
        expect(response.body).to include(similar_card.company_name)
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

   describe "GET /business_cards/new" do
    context "ログインしている場合" do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end
      it "レスポンスが成功し、名刺作成フォームが表示されること" do
        get new_business_card_path
        expect(response).to have_http_status(200)
        expect(assigns(:business_card)).to be_a_new(BusinessCard)
        expect(assigns(:business_card).user).to eq(user)
        expect(response.body).to include('名刺新規作成')
      end
    end
    context "ログインしていない場合" do
      it "ログインページにリダイレクトされること" do
        get new_business_card_path
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
  end

  describe "POST /business_cards" do
    context "ログインしている場合" do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end

      context "有効なパラメータの場合" do
        let(:valid_params) do
          {
            business_card: {
              name: "新規太郎",
              company_name: "新規株式会社",
              job_title: "営業部長",
              department: "営業部",
              email: "shin@new.com"
            }
          }
        end

        it "名刺が作成されること" do
          expect {
            post business_cards_path, params: valid_params
          }.to change(BusinessCard, :count).by(1)
        end

        it "作成後に名刺の一覧ページにリダイレクトされること" do
          post business_cards_path, params: valid_params
          expect(response).to redirect_to(business_cards_path)
        end

        it "作成した名刺が正しく保存されること" do
          post business_cards_path, params: valid_params
          new_card = BusinessCard.last
          expect(new_card.name).to eq("新規太郎")
          expect(new_card.company_name).to eq("新規株式会社")
          expect(new_card.user).to eq(user)
        end

        it "成功メッセージが表示されること" do
          post business_cards_path, params: valid_params
          expect(flash[:success]).to eq("名刺が正常に作成されました。")
        end
      end

      context "無効なパラメータの場合" do
        # 必須項目が欠落
        let(:invalid_params) do
          {
            business_card: {
              name: "",
              company_name: ""
            }
          }
        end

        it "名刺が作成されないこと" do
          expect {
            post business_cards_path, params: invalid_params
          }.not_to change(BusinessCard, :count)
        end

        it "新規作成フォームが再表示されること" do
          post business_cards_path, params: invalid_params
          expect(response).to have_http_status(:unprocessable_content)
          expect(response).to render_template(:new)

          # React BusinessCardFormコンポーネントのdata属性が存在すること
          expect(response.body).to include('data-controller="business-card-form"')
          expect(response.body).to include('data-business-card-form-errors-value')

          # バリデーションエラーメッセージがdata属性に含まれること
          expect(response.body).to include('名前を入力してください')
          expect(response.body).to include('会社名を入力してください')
        end

        it "エラーメッセージの詳細内容が正しく設定されること" do
          post business_cards_path, params: invalid_params

          # data属性からエラーメッセージのJSONを抽出・検証
          errors_match = response.body.match(/data-business-card-form-errors-value="(\[[^\]]*\])"/m)
          expect(errors_match).not_to be_nil

          errors_json = CGI.unescapeHTML(errors_match[1])
          errors_array = JSON.parse(errors_json)

          # エラーメッセージの内容を詳細に検証
          expect(errors_array).to be_an(Array)
          expect(errors_array.size).to eq(2)
          expect(errors_array).to include('名前 名前を入力してください')
          expect(errors_array).to include('会社名 会社名を入力してください')
        end
      end
    end

    context "ログインしていない場合" do
      let(:valid_params) do
        {
          business_card: {
            name: "新規太郎",
            company_name: "新規株式会社",
            job_title: "営業部長",
            department: "営業部",
            email: "shin@new.com"
          }
        }
      end
      it "ログインページにリダイレクトされること" do
        post business_cards_path, params: valid_params
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
  end
  describe "DELETE /business_cards/:id" do
    context "自分の名刺を削除しようとする場合" do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end

      it "名刺が削除され、一覧にリダイレクトすること" do
        card = create(:business_card, user: user, name: "削除太郎")

        # HTML形式での削除
        expect {
          delete business_card_path(card)
        }.to change(BusinessCard, :count).by(-1)

        # 削除後は名刺一覧ページにリダイレクトされることを確認
        expect(response).to redirect_to(business_cards_path)

        # 削除成功のフラッシュメッセージが設定されることを確認
        expect(flash[:success]).to eq("名刺が正常に削除されました。")

        # JSON形式での削除
        card2 = create(:business_card, user: user, name: "JSON削除太郎")
        expect {
          delete business_card_path(card2), headers: { 'Accept' => 'application/json' }
        }.to change(BusinessCard, :count).by(-1)

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to eq('application/json; charset=utf-8')

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to be_present
      end
    end

    context "他人の名刺を削除しようとする場合" do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end
      it "削除されず、エラーメッセージが表示される" do
        other_user = create(:user)
        other_card = create(:business_card, user: other_user, name: "他人太郎")

        # HTML形式
        expect {
          delete business_card_path(other_card)
        }.not_to change(BusinessCard, :count)

        expect(response).to redirect_to(root_path)
        expect(flash[:error]).to eq("指定されたページは存在しません。")

        # JSON形式でも同様に削除できない
        expect {
          delete business_card_path(other_card), headers: { 'Accept' => 'application/json' }
        }.not_to change(BusinessCard, :count)

        expect(response).to redirect_to(root_path)
      end
    end

    context "存在しない名刺を削除しようとする場合" do
      before do
        post login_path, params: { session: { email: user.email, password: user.password } }
      end
      it "エラーメッセージが表示され、ルートページにリダイレクトされる" do
        non_existent_id = 99999

        expect {
          delete business_card_path(non_existent_id)
        }.not_to change(BusinessCard, :count)

        expect(response).to redirect_to(root_path)
        expect(flash[:error]).to eq("指定されたページは存在しません。")
      end
    end

    context "ログインしていない場合" do
      it "ログインページにリダイレクトされること" do
        card = create(:business_card, user: user, name: "削除太郎")

        delete business_card_path(card)
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
  end
end
