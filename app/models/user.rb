class User < ApplicationRecord
  # パスワードのハッシュ化と認証機能を追加
  has_secure_password

  # パスワードの最小文字数制限
  validates :password, length: { minimum: 6 }

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  before_save { self.email = email.downcase }
end
