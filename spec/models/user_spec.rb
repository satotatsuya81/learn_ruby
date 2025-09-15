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
end
