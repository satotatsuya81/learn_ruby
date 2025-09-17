class User < ApplicationRecord
  # パスワードのハッシュ化と認証機能を追加
  has_secure_password
  # remember_token属性を仮想的に追加
  attr_accessor :remember_token
  # activation_token属性を仮想的に追加
  attr_accessor :activation_token
  # reset_token属性を仮想的に追加
  attr_accessor :reset_token

  before_create :create_activation_digest

  # メールアドレスを小文字に変換して保存
  before_save { self.email = email.downcase }

  # バリデーション設定
  validates :password, length: { minimum: 6 }

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }

  # リメンバートークンとそのダイジェストを生成・管理するメソッド群
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def authenticated?(attribute_or_token, token = nil)
    if token
      # authenticated?(:activation, token)
      digest = send("#{attribute_or_token}_digest")
      return false if digest.nil?
      BCrypt::Password.new(digest).is_password?(token)
    else
      # authenticated?(remember_token)
      return false if remember_digest.nil?
      BCrypt::Password.new(remember_digest).is_password?(attribute_or_token)
    end
  end

  def forget
    update_attribute(:remember_digest, nil)
  end

  class << self
    def new_token
      SecureRandom.urlsafe_base64
    end

    def digest(string)
      cost = if ActiveModel::SecurePassword.min_cost
              BCrypt::Engine::MIN_COST
      else
              BCrypt::Engine.cost
      end
      BCrypt::Password.create(string, cost: cost)
    end
  end

  # アカウント有効化関連のメソッド群
  def activation_email
    UserMailer.activation_email(self).deliver_now
  end

  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  private

  # アカウント有効化トークンとダイジェストを作成・代入する
  def create_activation_digest
      self.activation_token = User.new_token
      self.activation_digest = User.digest(activation_token)
  end
end
