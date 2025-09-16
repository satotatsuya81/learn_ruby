require 'rails_helper'

RSpec.describe SessionsHelper, type: :helper do
  let(:user) { create(:user) }

  describe "#log_in" do
    it "セッションにユーザーIDを設定する" do
      helper.log_in(user)
      expect(session[:user_id]).to eq(user.id)
    end
  end

  describe "#current_user" do
    context "ユーザーがログインしている場合" do
      before do
        session[:user_id] = user.id
      end

      it "現在のユーザーを返す" do
        expect(helper.current_user).to eq(user)
      end
    end

    context "ユーザーがログインしていない場合" do
      it "nilを返す" do
        expect(helper.current_user).to be_nil
      end
    end
  end

  describe "#logged_in?" do
    context "ユーザーがログインしている場合" do
      before do
        session[:user_id] = user.id
      end

      it "trueを返す" do
        expect(helper.logged_in?).to be true
      end
    end

    context "ユーザーがログインしていない場合" do
      it "falseを返す" do
        expect(helper.logged_in?).to be false
      end
    end
  end

  describe "#log_out" do
    context "ユーザーがログインしている場合" do
      before do
        session[:user_id] = user.id
      end

      it "セッションからユーザーIDを削除し、current_userをnilにする" do
        helper.log_out
        expect(session[:user_id]).to be_nil
        expect(helper.current_user).to be_nil
      end
    end

    context "ユーザーがログインしていない場合" do
      it "何もしない" do
        expect(helper.log_out).to be_nil
      end
    end
  end
end
