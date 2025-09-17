class CreateBusinessCards < ActiveRecord::Migration[8.0]
  def change
    create_table :business_cards do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :company_name, null: false
      t.string :department
      t.string :job_title
      t.string :email
      t.string :phone
      t.string :mobile
      t.text :address
      t.string :website
      t.text :notes

      t.timestamps
    end

    # 検索パフォーマンス向上のためのインデックス追加
    add_index :business_cards, [ :user_id, :name ]
    add_index :business_cards, [ :user_id, :company_name ]
    add_index :business_cards, :email
  end
end
