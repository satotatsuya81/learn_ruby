class BusinessCard < ApplicationRecord
  belongs_to :user

  # 必須項目のバリデーション
  validates :name, presence: { message: "名前を入力してください" }, length: { maximum: 100 }
  validates :company_name, presence: { message: "会社名を入力してください" }, length: { maximum: 100 }

  # オプション項目のバリデーション
  validates :department, length: { maximum: 100 }, allow_blank: true
  validates :job_title, length: { maximum: 100 }, allow_blank: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :phone, length: { maximum: 50 }, allow_blank: true
  validates :mobile, length: { maximum: 50 }, allow_blank: true
  validates :address, length: { maximum: 500 }, allow_blank: true
  validates :website, format: {
      with: /\A#{URI.regexp}\z/,
      message: "は有効なURL形式で入力してください"
  }, allow_blank: true

  # 検索用スコープメソッド
  scope :by_company, ->(company) { where(company_name: company) }
  scope :recent, -> { order(created_at: :desc) }

  # 名前と会社名を組み合わせた表示用メソッド
  def full_name_with_company
    "#{name} (#{company_name})"
  end

  # 連絡手段が利用可能かチェックするメソッド
  def contact_available?
    email.present? || phone.present? || mobile.present?
  end
end
