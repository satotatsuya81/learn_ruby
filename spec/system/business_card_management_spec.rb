require 'rails_helper'

RSpec.describe "Business Card Management", type: :system, js: true do
  let(:user) { create(:user, :activated) }
  let!(:other_user) { create(:user, email: 'other@example.com') }

  describe "名刺作成機能" do
    context "ログインしている場合" do
      before do
        login(user)
      end

      it "名刺作成ページにアクセスできること" do
        visit new_business_card_path
        expect(page).to have_current_path(new_business_card_path)
        expect(page).to have_content("名刺新規作成")
      end

      it "有効な情報で名刺を作成できること" do
        visit new_business_card_path
        fill_in "名前", with: "田中太郎"
        fill_in "会社名", with: "テスト株式会社"
        fill_in "役職", with: "営業部長"
        fill_in "部署", with: "営業部"
        fill_in "メール", with: "tanaka@example.com"
        fill_in "電話番号", with: "090-1234-5678"
        fill_in "住所", with: "東京都千代田区1-1-1"
        fill_in "メモ", with: "テスト用の名刺です。"
        click_button "名刺を作成"
        expect(page).to have_current_path(business_cards_path)
        expect(page).to have_content("名刺が正常に作成されました。")
        expect(page).to have_content("田中太郎")  # 作成した名刺が一覧に表示されることを確認
      end

      it "無効な情報では名刺を作成できず、エラーメッセージが表示されること" do
        visit new_business_card_path
        fill_in "会社名", with: "テスト株式会社"
        click_button "名刺を作成"
        expect(page).to have_content("入力エラーが発生しました:")
        expect(page).to have_content("名前を入力してください")
        expect(page).to have_current_path(new_business_card_path)  # 再表示される
        expect(page).to have_field("会社名", with: "テスト株式会社")  # 入力値が保持されている
      end
    end
  end

  describe "名刺編集機能" do
    context "ログインしている場合" do
      before do
        login(user)
      end
      it "既存の名刺を編集できること" do
        business_card = create(:business_card, user: user, name: "田中太郎", company_name: "テスト株式会社")
        visit edit_business_card_path(business_card)
        expect(page).to have_current_path(edit_business_card_path(business_card))
        expect(page).to have_field("名前", with: "田中太郎")
        expect(page).to have_field("会社名", with: "テスト株式会社")
        fill_in "名前", with: "田中次郎"
        fill_in "会社名", with: "サンプル株式会社"
        click_button "名刺を更新"
        expect(page).to have_current_path(business_card_path(business_card))
        expect(page).to have_content("名刺が正常に更新されました。")
        expect(page).to have_content("田中次郎")
        expect(page).to have_content("サンプル株式会社")
      end

      it "編集時にバリデーションエラーが発生した場合、エラーメッセージが表示されること" do
        business_card = create(:business_card, user: user, name: "田中太郎", company_name: "テスト株式会社")
        visit edit_business_card_path(business_card)
        fill_in "メール", with: "test.com"  # 会社名は必須
        click_button "名刺を更新"
        expect(page).to have_content("入力エラーが発生しました:")
        expect(page).to have_content("正しいメールアドレスを入力してください")
        expect(page).to have_current_path(edit_business_card_path(business_card))  # 再表示される
        expect(page).to have_field("メール", with: "test.com")  # 入力値が保持されている
      end
    end

    context "他のユーザーの名刺を編集しようとした場合" do
      before do
        login(user)
      end
      it "アクセスが拒否されること" do
        business_card = create(:business_card, user: other_user, name: "山田花子", company_name: "他社株式会社")
        visit edit_business_card_path(business_card)
        expect(page).to have_current_path(root_path)
        expect(page).to have_content("指定されたページは存在しません。")
      end
    end
  end

  describe "名刺削除機能" do
    context "削除ダイアログ" do
      before do
        login(user)
        @business_card = create(:business_card, user: user, name: "田中太郎", company_name: "テスト株式会社")
        visit business_card_path(@business_card)
      end

      it "削除ボタンが確認ダイアログ付きで表示されること" do
        expect(page).to have_button("削除")
        delete_button = page.find_button("削除")
        # DELETEメソッドで実装されていることを確認
        expect(delete_button).to be_visible
      end

      it "削除ボタンをクリックすると名刺が削除されること" do
        expect(page).to have_button("削除")
        accept_alert do
          click_button "削除"
        end
        expect(page).to have_current_path(business_cards_path)
        expect(page).to have_content(I18n.t('business_cards.messages.deleted_successfully'))
        expect(page).not_to have_content("田中太郎")  # 名刺が一覧から消えていることを確認
      end

      it "他のユーザーの名刺削除を試みるとアクセスが拒否されること" do
        other_business_card = create(:business_card, user: other_user, name: "山田花子", company_name: "他社株式会社")
        visit business_card_path(other_business_card)
        expect(page).not_to have_link("名刺を削除")
        expect(page).to have_content(I18n.t('business_cards.messages.not_found'))
      end
    end
  end
end
