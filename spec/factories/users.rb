FactoryBot.define do
  factory :user do
    # sequences: 重複を避けるために連番を使用して一意の値を生成
    sequence(:name) { |n| "Test User #{n}" }
    sequence(:email) { |n| "test_user_#{n}@example.com" }

    # has_secure_passwordで必要なpassword属性
    password { 'password123' }
    password_confirmation { 'password123' }

    # 有効化フラグ
    activated { false }
    activated_at { nil }

    # 有効化済みユーザ用のtrait
    trait :activated do
      activated { true }
      activated_at { Time.zone.now }
    end
  end
end
