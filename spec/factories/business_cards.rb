# BusinessCardモデル用のテストデータ作成ファクトリ
FactoryBot.define do
  factory :business_card do
    # ユーザーとの関連を自動作成
    association :user

    # 基本的な名刺情報（日本語の典型的なデータ）
    name { '田中太郎' }
    company_name { 'テスト株式会社' }
    department { '営業部' }
    job_title { '営業課長' }
    email { 'tanaka@test-company.co.jp' }
    phone { '03-1234-5678' }
    mobile { '090-1234-5678' }
    address { '東京都渋谷区テスト1-2-3' }
    website { 'https://www.test-company.co.jp' }
    notes { 'テスト用の名刺データです' }

    # 最小限の名刺データ（必須項目のみ）用のトレイト
    trait :minimal do
      department { nil }
      job_title { nil }
      email { nil }
      phone { nil }
      mobile { nil }
      address { nil }
      website { nil }
      notes { nil }
    end

    # メールアドレスのみの連絡先用トレイト
    trait :with_email_only do
      phone { nil }
      mobile { nil }
    end
  end
end
