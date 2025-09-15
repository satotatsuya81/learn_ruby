class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      # 基本的なユーザ情報
      t.string :name, null: false, limit: 50
      t.string :email, null: false, limit: 255, index: { unique: true }

      # has_secure_passwordで必要なカラム
      t.string :password_digest, null: false

      t.timestamps
    end
  end
end
