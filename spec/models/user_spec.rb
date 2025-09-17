require 'rails_helper'

RSpec.describe User, type: :model do
  # ファクトリを使用してテスト用ユーザのオブジェクトを生成
  let(:user) { build(:user) }

  describe 'バリデーションのテスト' do
    it '有効なユーザの場合はバリデーションが通ること' do
      expect(user).to be_valid
    end

    it '無効なユーザ(nameが空)の場合はバリデーションが通らないこと' do
      user.name = nil
      expect(user).not_to be_valid
      expect(user.errors[:name]).to be_present
    end

    it '無効なユーザ(nameが51文字以上)の場合はバリデーションが通らないこと' do
      user.name = 'a' * 51
      expect(user).not_to be_valid
      expect(user.errors[:name]).to be_present
    end

    it '無効なユーザ(emailが空)の場合はバリデーションが通らないこと' do
      user.email = nil
      expect(user).not_to be_valid
      expect(user.errors[:email]).to be_present
    end

    it '無効なユーザ(emailが形式不正)の場合はバリデーションが通らないこと' do
      invalid_emails = %w[user@foo,com user_at_foo.org user.name@example.
                          foo@bar_baz.com foo@bar+baz.com foo@bar..com]
      invalid_emails.each do |invalid_email|
        user.email = invalid_email
        expect(user).not_to be_valid
        expect(user.errors[:email]).to be_present
      end
    end

    it '無効なユーザ(emailが重複)の場合はバリデーションが通らないこと' do
      create(:user, email: 'duplicate@example.com')
      user.email = 'duplicate@example.com'
      expect(user).not_to be_valid
      expect(user.errors[:email]).to be_present
    end

    it '有効なメールアドレスの形式の場合はバリデーションが通ること' do
      valid_emails = %w[user@example.com USER@foo.COM a.us-er@foo.bar.org first.last@foo.jp]
      valid_emails.each do |valid_email|
        user.email = valid_email
        expect(user).to be_valid
      end
    end
  end
  describe 'コールバックのテスト' do
    it 'メールアドレスは保存前に小文字化されること' do
      mixed_case_email = 'USER@EXAMPLE.COM'
      user.email = mixed_case_email
      user.save
      expect(user.email).to eq(mixed_case_email.downcase)
    end
  end

  describe 'パスワードのテスト' do
    it 'パスワード認証が正しく機能すること' do
      user.password = 'securepassword'
      user.password_confirmation = 'securepassword'
      user.save

      # has_secure_passwordのauthenticateメソッドでパスワード認証をテスト
      expect(user.authenticate('securepassword')).to eq(user)
    end

    it '誤ったパスワード認証の場合、認証が失敗すること' do
      user.password = 'securepassword'
      user.password_confirmation = 'securepassword'
      user.save

      # has_secure_passwordのauthenticateメソッドでパスワード認証をテスト
      expect(user.authenticate('incorrectpassword')).to be_falsey
    end

    it 'パスワード確認がパスワードと一致しない場合は無効であること' do
      user.password = 'securepassword'
      user.password_confirmation = 'differentpassword'
      expect(user).not_to be_valid
      expect(user.errors[:password_confirmation]).to be_present
    end

    it 'パスワードが6文字未満の場合は無効であること' do
      user.password = 'short'
      user.password_confirmation = 'short'
      expect(user).not_to be_valid
      expect(user.errors[:password]).to be_present
    end
  end

  describe 'remember_tokenのテスト' do
    let(:user) { create(:user) }
    describe '#remember' do
      it 'remember_tokenが生成され、remember_digestが保存されること' do
        expect(user.remember_token).to be_nil
        expect(user.remember_digest).to be_nil

        user.remember

        expect(user.remember_token).not_to be_nil
        expect(user.remember_digest).not_to be_nil
      end

      it '複数回呼び出しても異なるremember_tokenが生成されること' do
        user.remember
        first_token = user.remember_token
        first_digest = user.remember_digest

        user.remember
        second_token = user.remember_token
        second_digest = user.remember_digest

        expect(first_token).not_to eq(second_token)
        expect(first_digest).not_to eq(second_digest)
      end
    end
    describe '#forget' do
      it 'remember_digestがnilに設定されること' do
        user.remember
        expect(user.remember_digest).not_to be_nil

        user.forget
        expect(user.remember_digest).to be_nil
      end

      it 'foget後、認証が失敗すること' do
        user.remember
        expect(user.authenticated?(user.remember_token)).to be_truthy

        user.forget
        expect(user.authenticated?(user.remember_token)).to be_falsey
      end
    end
  end
  describe "アカウント有効化機能" do
    let(:user) { create(:user) }

    describe "#activation_email" do
      it "アカウント有効化メールが送信されること" do
        expect {
          user.activation_email
        }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it "有効化トークンとダイジェストが生成されること" do
        user.activation_email
        expect(user.activation_token).not_to be_nil
        expect(user.activation_digest).not_to be_nil
      end
    end

    describe "#authenticate_activation" do
      before { user.activation_email }

      it "正しいトークンで認証が成功すること" do
        token = user.activation_token
        expect(user.authenticated?(:activation, token)).to be_truthy
      end

      it "誤ったトークンで認証が失敗すること" do
        expect(user.authenticated?(:activation, 'wrongtoken')).to be_falsey
      end
    end

    describe "#activate" do
      it "アカウントが有効化されること" do
        expect(user.activated).to be_falsey
        user.activate
        expect(user.activated).to be_truthy
        expect(user.activated_at).not_to be_nil
      end
    end

    describe '#authenticated?' do
      it '正しいremember_tokenで認証が成功すること' do
        user.remember
        expect(user.authenticated?(user.remember_token)).to be_truthy
      end

      it '誤ったremember_tokenで認証が失敗すること' do
        user.remember
        expect(user.authenticated?('wrongtoken')).to be_falsey
      end

      it 'remember_digestがnilの場合、認証が失敗すること' do
        expect(user.authenticated?('anytoken')).to be_falsey
      end
    end
  end
  describe "パスワードリセット機能" do
    it "reset_digestカラムとreset_sent_atカラムが設定されること" do
      expect(User.column_names).to include('reset_digest')
      expect(User.column_names).to include('reset_sent_at')
    end

    it "reset_digestとreset_sent_atにnilが設定できること" do
      user.update(reset_digest: nil, reset_sent_at: nil)
      expect(user.reset_digest).to be_nil
      expect(user.reset_sent_at).to be_nil
    end

    it "reset_digestとreset_sent_atに値が設定できること" do
      time = Time.current
      user.update(reset_digest: 'somedigest', reset_sent_at: time)
      expect(user.reset_digest).to eq('somedigest')
      expect(user.reset_sent_at.to_i).to eq(time.to_i)
    end
  end
end
