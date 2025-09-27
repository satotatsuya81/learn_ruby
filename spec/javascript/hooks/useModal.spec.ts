import { renderHook, act } from '@testing-library/react';
import { useModal } from '@/hooks/useModal';
import { BusinessCard } from '@/types//BusinessCard';

const mockBusinessCard: BusinessCard = {
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
};

describe('useModal', () => {
  describe('Modal状態管理パターン', () => {
    it('初期状態でモーダルが閉じている', () => {
      const { result } = renderHook(() => useModal<BusinessCard>());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it('openModalでモーダルが開く', () => {
      const { result } = renderHook(() => useModal<BusinessCard>());

      act(() => {
        result.current.openModal(mockBusinessCard);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toEqual(mockBusinessCard);
    });

    it('closeModalでモーダルが閉じる', () => {
      const { result } = renderHook(() => useModal<BusinessCard>());

      // まずモーダルを開く
      act(() => {
        result.current.openModal(mockBusinessCard);
      });

      expect(result.current.isOpen).toBe(true);

      // モーダルを閉じる
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it('データなしでモーダルを開くことができる', () => {
      const { result } = renderHook(() => useModal<BusinessCard>());

      act(() => {
        result.current.openModal();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toBeNull();
    });

    it('異なるデータでモーダルを開き直すことができる', () => {
      const { result } = renderHook(() => useModal<BusinessCard>());

      const anotherCard = { ...mockBusinessCard, id: 2, name: '佐藤花子' };

      // 最初のデータでモーダルを開く
      act(() => {
        result.current.openModal(mockBusinessCard);
      });

      expect(result.current.data?.name).toBe('田中太郎');

      // 別のデータでモーダルを開き直す
      act(() => {
        result.current.openModal(anotherCard);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data?.name).toBe('佐藤花子');
    });
  });
});
