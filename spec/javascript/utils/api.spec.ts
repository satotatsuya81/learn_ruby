import { apiClient } from '@/utils/api';
import { BusinessCard, BusinessCardFormData } from '@/types/BusinessCard';

// テスト用のモック設定
describe('ApiClient', () => {
  // 各テストの前にfetchをモック化
  beforeEach(() => {
    // fetchのグローバルモック
    global.fetch = jest.fn();

    // CSRFトークンのモック
    const mockMetaElement = document.createElement('meta');
    mockMetaElement.name = 'csrf-token';
    mockMetaElement.content = 'test-csrf-token';
    document.head.appendChild(mockMetaElement);
  });

  afterEach(() => {
    jest.resetAllMocks();
    // DOMをクリーンアップ
    document.head.innerHTML = '';
  });

  describe('getBusinessCards', () => {
    it('正常なレスポンスでBusinessCard配列を返す', async () => {
      // テスト用のBusinessCardデータ
      const mockBusinessCards: BusinessCard[] = [
        {
          id: 1,
          name: '田中太郎',
          company_name: '株式会社テスト',
          job_title: 'エンジニア',
          email: 'tanaka@test.com',
          phone: '090-1234-5678',
          website: 'https://test.com',
          notes: 'テストノート',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          user_id: 1
        }
      ];

      // fetchのレスポンスをモック
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockBusinessCards)
      });

      // APIクライアントのメソッドを呼び出し
      const result = await apiClient.getBusinessCards();

      // 期待する結果の検証
      expect(result).toEqual(mockBusinessCards);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/business_cards',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'test-csrf-token'
          })
        })
      );
    });

    it('検索パラメータ付きでAPIを呼び出す', async () => {
      const mockBusinessCards: BusinessCard[] = [];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockBusinessCards)
      });

      const searchParams = {
        query: '田中',
        company_name: 'テスト'
      };

      await apiClient.getBusinessCards(searchParams);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/business_cards?query=%E7%94%B0%E4%B8%AD&company_name=%E3%83%86%E3%82%B9%E3%83%88',
        expect.any(Object)
      );
    });
  });

  describe('createBusinessCard', () => {
    it('FormDataを使用してPOSTリクエストを送信する', async () => {
      const mockFormData: BusinessCardFormData = {
        name: '佐藤花子',
        company_name: '株式会社新規',
        job_title: 'デザイナー',
        email: 'sato@new.com'
      };

      const mockCreatedCard: BusinessCard = {
        id: 2,
        name: '佐藤花子',
        company_name: '株式会社新規',
        job_title: 'デザイナー',
        email: 'sato@new.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        user_id: 1
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCreatedCard)
      });

      const result = await apiClient.createBusinessCard(mockFormData);

      expect(result).toEqual(mockCreatedCard);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/business_cards',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          headers: expect.objectContaining({
            'X-CSRF-Token': 'test-csrf-token'
          })
        })
      );
    });
  });

  describe('エラーハンドリング', () => {
    it('HTTPエラーレスポンスで適切なエラーを投げる', async () => {
      // テスト中のconsole.errorを一時的に抑制
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({
          error: 'バリデーションエラー',
          details: { name: ['名前は必須です'] }
        })
      });

      await expect(apiClient.getBusinessCards()).rejects.toThrow('バリデーションエラー');

      // console.errorのモックを復元
      consoleSpy.mockRestore();
    });

    it('ネットワークエラーで適切なエラーを投げる', async () => {
      // テスト中のconsole.errorを一時的に抑制
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ネットワークエラー'));

      await expect(apiClient.getBusinessCards()).rejects.toThrow('ネットワークエラー');

      // console.errorのモックを復元
      consoleSpy.mockRestore();
    });
  });
});
