require 'rails_helper'

# ApplicationRecord のテストクラス
# ApplicationRecordは全てのモデルの基底クラスで、
# Active Recordの共通機能やカスタマイズを担当します
RSpec.describe ApplicationRecord, type: :model do
  # 基本設定の確認
  describe "基本設定" do
    # テスト1: ActiveRecord::Baseを継承していること
    it "ActiveRecord::Baseを継承していること" do
      # ApplicationRecordがActiveRecord::Baseの子クラスであることを確認
      # これにより、データベース操作の基本機能が利用可能になる
      expect(ApplicationRecord.superclass).to eq(ActiveRecord::Base)
    end

    # テスト2: 抽象クラスとして設定されていること
    it "抽象クラスとして設定されていること" do
      # ApplicationRecordは直接テーブルにマッピングされない抽象クラス
      # 他のモデルクラスの基底クラスとしてのみ使用される
      expect(ApplicationRecord.abstract_class).to be true
    end

    # テスト3: ApplicationRecordから継承したクラスが正しく動作すること
    it "継承したクラスが正しく動作すること" do
      # テスト用のモデルクラスを動的に作成
      test_model = Class.new(ApplicationRecord) do
        # テストのためのクラス名を設定
        def self.name
          'TestModel'
        end
      end

      # 作成したテストモデルがApplicationRecordを継承していることを確認
      expect(test_model.superclass).to eq(ApplicationRecord)

      # テストモデルもActiveRecord::Baseの機能を利用できることを確認
      expect(test_model.ancestors).to include(ActiveRecord::Base)
    end
  end
end
