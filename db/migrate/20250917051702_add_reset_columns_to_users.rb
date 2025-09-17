class AddResetColumnsToUsers < ActiveRecord::Migration[8.0]
  def change
    # パスワードリセット用のカラムを追加
    add_column :users, :reset_digest, :string
    add_column :users, :reset_sent_at, :datetime
  end
end
