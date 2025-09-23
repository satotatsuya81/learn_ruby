import { renderHook, act, waitFor } from '@testing-library/react';
import { useBusinessCards } from '../../../app/javascript/hooks/useBusinessCards';
import { BusinessCard } from '../../../app/javascript/types/BusinessCard';

// API mock
const mockGetBusinessCards = jest.fn();
const mockDeleteBusinessCard = jest.fn();
jest.mock('../../../app/javascript/utils/api', () => ({
  getBusinessCards: (...args: any[]) => mockGetBusinessCards(...args),
  deleteBusinessCard: (...args: any[]) => mockDeleteBusinessCard(...args)
}));

describe('useBusinessCards', () => {
  const mockBusinessCards: BusinessCard[] = [
    {
      id: 1,
      name: '田中太郎',
      company_name: 'テスト会社',
      job_title: 'エンジニア',
      email: 'tanaka@test.com',
      phone: '090-1234-5678',
      address: '東京都',
      notes: 'テストノート',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      user_id: 1
    },
    {
      id: 2,
      name: '佐藤花子',
      company_name: 'デザイン会社',
      job_title: 'デザイナー',
      email: 'sato@design.com',
      phone: '090-9876-5432',
      address: '大阪府',
      notes: 'デザインの専門家',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      user_id: 2
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初期化', () => {
    it('初期状態が正しく設定される', () => {
      mockGetBusinessCards.mockResolvedValueOnce(mockBusinessCards);

      const { result } = renderHook(() => useBusinessCards());

      expect(result.current.businessCards).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.refreshBusinessCards).toBe('function');
      expect(typeof result.current.deleteCard).toBe('function');
    });

    it('マウント時にAPIが呼び出される', async () => {
      mockGetBusinessCards.mockResolvedValueOnce(mockBusinessCards);

      renderHook(() => useBusinessCards());

      await waitFor(() => {
        expect(mockGetBusinessCards).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('データ取得', () => {
    it('正常にデータが取得される', async () => {
      mockGetBusinessCards.mockResolvedValueOnce(mockBusinessCards);

      const { result } = renderHook(() => useBusinessCards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.businessCards).toEqual(mockBusinessCards);
      expect(result.current.error).toBe(null);
    });

    it('データ取得中はローディング状態になる', async () => {
      let resolvePromise: (value: BusinessCard[]) => void;
      mockGetBusinessCards.mockReturnValueOnce(
        new Promise(resolve => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useBusinessCards());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.businessCards).toEqual([]);

      act(() => {
        resolvePromise!(mockBusinessCards);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.businessCards).toEqual(mockBusinessCards);
    });

    it('データ取得エラーが正しくハンドリングされる', async () => {
      const errorMessage = 'API取得エラー';
      mockGetBusinessCards.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useBusinessCards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.businessCards).toEqual([]);
    });

    it('Error以外のエラーも正しくハンドリングされる', async () => {
      mockGetBusinessCards.mockRejectedValueOnce('ネットワークエラー');

      const { result } = renderHook(() => useBusinessCards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('名刺の取得に失敗しました');
    });
  });

  describe('refreshBusinessCards', () => {
    it('手動でデータを再取得できる', async () => {
      mockGetBusinessCards
        .mockResolvedValueOnce(mockBusinessCards)
        .mockResolvedValueOnce([mockBusinessCards[0]]); // 2回目は1件のみ

      const { result } = renderHook(() => useBusinessCards());

      // 初回読み込み完了まで待機
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.businessCards).toHaveLength(2);

      // 手動リフレッシュ
      await act(async () => {
        await result.current.refreshBusinessCards();
      });

      expect(result.current.businessCards).toHaveLength(1);
      expect(mockGetBusinessCards).toHaveBeenCalledTimes(2);
    });

    it('リフレッシュ中はローディング状態になる', async () => {
      mockGetBusinessCards.mockResolvedValueOnce(mockBusinessCards);

      const { result } = renderHook(() => useBusinessCards());

      // 初回読み込み完了まで待機
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let resolveSecondCall: (value: BusinessCard[]) => void;
      mockGetBusinessCards.mockReturnValueOnce(
        new Promise(resolve => {
          resolveSecondCall = resolve;
        })
      );

      act(() => {
        result.current.refreshBusinessCards();
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        resolveSecondCall!(mockBusinessCards);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('リフレッシュエラー時にエラー状態が更新される', async () => {
      mockGetBusinessCards.mockResolvedValueOnce(mockBusinessCards);

      const { result } = renderHook(() => useBusinessCards());

      // 初回読み込み完了まで待機
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockGetBusinessCards.mockRejectedValueOnce(new Error('リフレッシュエラー'));

      await act(async () => {
        await result.current.refreshBusinessCards();
      });

      expect(result.current.error).toBe('リフレッシュエラー');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('deleteCard', () => {
    beforeEach(async () => {
      mockGetBusinessCards.mockResolvedValueOnce(mockBusinessCards);
    });

    it('正常に削除できる', async () => {
      mockDeleteBusinessCard.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useBusinessCards());

      // 初回読み込み完了まで待機
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.businessCards).toHaveLength(2);

      await act(async () => {
        await result.current.deleteCard(1);
      });

      expect(mockDeleteBusinessCard).toHaveBeenCalledWith(1);
      expect(result.current.businessCards).toHaveLength(1);
      expect(result.current.businessCards[0].id).toBe(2);
      expect(result.current.error).toBe(null);
    });

    it('削除エラーが正しくハンドリングされる', async () => {
      const errorMessage = '削除権限がありません';
      mockDeleteBusinessCard.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useBusinessCards());

      // 初回読み込み完了まで待機
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          try {
            await result.current.deleteCard(1);
          } catch (error) {
            // エラーが発生した時点で状態更新を待機
            await waitFor(() => {
              expect(result.current.error).toBe(errorMessage);
            });
            throw error;
          }
        })
      ).rejects.toThrow(errorMessage);
      expect(result.current.businessCards).toHaveLength(2); // リストは変更されない
    });
  });
});
