# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# 開発用テストユーザーを作成
if Rails.env.development?
  # example@example.com ユーザーが存在する場合は有効化
  user = User.find_by(email: 'example@example.com')
  if user
    user.activated = true
    user.activated_at = Time.zone.now
    user.save!
    puts "✅ example@example.com ユーザーを有効化しました"
  end

  # テスト用ユーザーを作成（既に存在しない場合）
  unless User.exists?(email: 'test@example.com')
    test_user = User.new(
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password',
      password_confirmation: 'password',
      activated: true,
      activated_at: Time.zone.now
    )

    if test_user.save
      puts "✅ テストユーザー (test@example.com) を作成しました"

      # テスト用名刺を作成
      test_user.business_cards.create!(
        name: '田中太郎',
        job_title: '営業部長',
        company_name: '株式会社サンプル',
        email: 'tanaka@sample.co.jp',
        phone: '03-1234-5678',
        address: '東京都渋谷区サンプル1-2-3'
      )
      puts "✅ テスト用名刺を作成しました"
    else
      puts "❌ テストユーザーの作成に失敗しました: #{test_user.errors.full_messages}"
    end
  else
    puts "ℹ️ テストユーザーは既に存在します"
  end
end
