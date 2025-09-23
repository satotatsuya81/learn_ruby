import { useState, useEffect, useCallback } from 'react';
import { BusinessCard } from '@/types/BusinessCard';
import { getBusinessCards, deleteBusinessCard } from '@/utils/api';

export interface UseBusinessCardsResult {
  businessCards: BusinessCard[];
  isLoading: boolean;
  error: string | null;
  refreshBusinessCards: () => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
}

/**
 * ビジネスロジック分離パターン
 * 名刺データの取得・管理・操作を担当するカスタムhook
 */
export const useBusinessCards = (): UseBusinessCardsResult => {
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBusinessCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cards = await getBusinessCards();
      setBusinessCards(cards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '名刺の取得に失敗しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCard = useCallback(async (id: number) => {
    try {
      setError(null);
      await deleteBusinessCard(id);
      // 削除後にリストを更新
      setBusinessCards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '削除に失敗しました';
      setError(errorMessage);
      throw err; // 呼び出し元でエラーハンドリングできるように再投
    }
  }, []);

  useEffect(() => {
    refreshBusinessCards();
  }, [refreshBusinessCards]);

  return {
    businessCards,
    isLoading,
    error,
    refreshBusinessCards,
    deleteCard
  };
};
