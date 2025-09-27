import { renderHook, act } from '@testing-library/react';
import { useBusinessCardFilter } from '@/hooks/useBusinessCardFilter';
import { BusinessCard } from '@/types//BusinessCard';

const mockBusinessCards: BusinessCard[] = [
  {
    id: 1,
    name: '田中太郎',
    company_name: 'テスト株式会社',
    department: '営業部',
    job_title: '部長',
    email: 'tanaka@test.com',
    phone: '03-1234-5678',
    mobile: '090-1234-5678',
    website: 'https://test.com',
    address: '東京都千代田区1-1-1',
    notes: 'テストメモ',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    user_id: 1
  },
  {
    id: 2,
    name: '佐藤花子',
    company_name: 'サンプル企業',
    department: '技術部',
    job_title: 'エンジニア',
    email: 'sato@sample.com',
    phone: '03-5678-9012',
    mobile: '090-5678-9012',
    website: 'https://sample.com',
    address: '東京都渋谷区2-2-2',
    notes: 'サンプルメモ',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    user_id: 1
  }
];

describe('useBusinessCardFilter', () => {
  describe('動的プロパティ管理パターン', () => {
    it('初期状態で全ての名刺が表示される', () => {
      const { result } = renderHook(() => useBusinessCardFilter(mockBusinessCards));

      expect(result.current.filteredCards).toHaveLength(2);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('名前フィルターで動的プロパティ更新が動作する', () => {
      const { result } = renderHook(() => useBusinessCardFilter(mockBusinessCards));

      act(() => {
        result.current.updateFilter('name', '田中');
      });

      expect(result.current.filteredCards).toHaveLength(1);
      expect(result.current.filteredCards[0].name).toBe('田中太郎');
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('会社名フィルターで動的プロパティ更新が動作する', () => {
      const { result } = renderHook(() => useBusinessCardFilter(mockBusinessCards));

      act(() => {
        result.current.updateFilter('company_name', 'テスト');
      });

      expect(result.current.filteredCards).toHaveLength(1);
      expect(result.current.filteredCards[0].company_name).toBe('テスト株式会社');
    });

    it('複数条件でのフィルタリングが動作する', () => {
      const { result } = renderHook(() => useBusinessCardFilter(mockBusinessCards));

      act(() => {
        result.current.updateFilter('department', '営業');
        result.current.updateFilter('job_title', '部長');
      });

      expect(result.current.filteredCards).toHaveLength(1);
      expect(result.current.filteredCards[0].name).toBe('田中太郎');
    });

    it('フィルタークリアで全ての名刺が表示される', () => {
      const { result } = renderHook(() => useBusinessCardFilter(mockBusinessCards));

      // まずフィルターを適用
      act(() => {
        result.current.updateFilter('name', '田中');
      });

      expect(result.current.filteredCards).toHaveLength(1);

      // フィルタークリア
      act(() => {
        result.current.clearFilter();
      });

      expect(result.current.filteredCards).toHaveLength(2);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('部分一致検索が動作する', () => {
      const { result } = renderHook(() => useBusinessCardFilter(mockBusinessCards));

      act(() => {
        result.current.updateFilter('company_name', '株式会社');
      });

      expect(result.current.filteredCards).toHaveLength(1);
      expect(result.current.filteredCards[0].name).toBe('田中太郎');
    });
  });
});
