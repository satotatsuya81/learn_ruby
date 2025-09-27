// Jest用のモックデータファクトリー
  // 名刺データの様々なパターンを生成するヘルパー関数

  import { BusinessCard } from '@/types//BusinessCard';

  // 基本的な名刺データを生成するファクトリー関数
  export const createBusinessCard = (overrides: Partial<BusinessCard> = {}): BusinessCard => {
    const defaultData: BusinessCard = {
      id: 1,
      name: '田中太郎',
      company_name: 'テスト株式会社',
      job_title: 'ソフトウェアエンジニア',
      email: 'tanaka@test.com',
      phone: '090-1234-5678',
      address: '東京都新宿区テスト町1-2-3',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
      user_id: 0
    };

    // overridesで指定された値で既定値を上書き
    return { ...defaultData, ...overrides };
  };

  // 複数の名刺データを生成するファクトリー関数
  export const createBusinessCards = (count: number = 3): BusinessCard[] => {
    const businessCards: BusinessCard[] = [];

    for (let i = 0; i < count; i++) {
      businessCards.push(createBusinessCard({
        id: i + 1,
        name: `テストユーザー${i + 1}`,
        company_name: `テスト会社${i + 1}`,
        email: `test${i + 1}@example.com`
      }));
    }

    return businessCards;
  };

  // 長いテキストを含む名刺データを生成
  export const createBusinessCardWithLongText = (): BusinessCard => {
    return createBusinessCard({
      id: 998,
      name: 'とても長い名前の田中太郎さん'.repeat(3),
      company_name: '非常に長い会社名のテスト株式会社'.repeat(5),
      job_title: '上級主任エキスパートソフトウェアアーキテクトエンジニア'
    });
  };
