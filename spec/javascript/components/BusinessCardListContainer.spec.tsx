import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BusinessCardListContainer } from '@/components/BusinessCardListContainer';
import { BusinessCard } from '@/types//BusinessCard';

// API mock
const mockDeleteBusinessCard = jest.fn();
jest.mock('@/utils/api', () => ({
  __esModule: true,
  deleteBusinessCard: (...args: any[]) => mockDeleteBusinessCard(...args)
}));

// useBusinessCardFilter mock
const mockUseBusinessCardFilter = jest.fn();
jest.mock('@/hooks/useBusinessCardFilter', () => ({
  useBusinessCardFilter: (...args: any[]) => mockUseBusinessCardFilter(...args)
}));

// useModal mock
const mockUseModal = jest.fn();
jest.mock('@/hooks/useModal', () => ({
  useModal: (...args: any[]) => mockUseModal(...args)
}));

// window.location.reload mock
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true
});

describe('BusinessCardListContainer', () => {
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
      user_id: 1
    }
  ];

  const mockFilterHook = {
    filter: { search: '', tags: [] },
    filteredCards: mockBusinessCards,
    updateFilter: jest.fn(),
    clearFilter: jest.fn(),
    hasActiveFilters: false
  };

  const mockModalHook = {
    isOpen: false,
    data: null,
    openModal: jest.fn(),
    closeModal: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBusinessCardFilter.mockReturnValue(mockFilterHook);
    mockUseModal.mockReturnValue(mockModalHook);
  });

  describe('基本レンダリング', () => {
    it('名刺リストが正しく表示される', () => {
      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.getByText('佐藤花子')).toBeInTheDocument();
      expect(screen.getByText('テスト会社')).toBeInTheDocument();
      expect(screen.getByText('デザイン会社')).toBeInTheDocument();
    });

    it('検索フィルターが表示される', () => {
      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // SearchFilterコンポーネントが存在することを確認（複数のtextboxがある）
      expect(screen.getAllByRole('textbox')).toHaveLength(4);
    });

    it('空の名刺リストで適切なメッセージが表示される', () => {
      mockUseBusinessCardFilter.mockReturnValue({
        ...mockFilterHook,
        filteredCards: []
      });

      render(<BusinessCardListContainer businessCards={[]} />);

      expect(screen.getByText('📇 まだ名刺が登録されていません')).toBeInTheDocument();
    });

    it('フィルター適用時に該当なしメッセージが表示される', () => {
      mockUseBusinessCardFilter.mockReturnValue({
        ...mockFilterHook,
        filteredCards: [],
        hasActiveFilters: true
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      expect(screen.getByText('🔍 検索条件に合う名刺が見つかりませんでした')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'フィルターをクリア' })).toHaveLength(2);
    });
  });

  describe('フィルター機能', () => {
    it('useBusinessCardFilterフックが正しく呼び出される', () => {
      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      expect(mockUseBusinessCardFilter).toHaveBeenCalledWith(mockBusinessCards);
    });

    it('フィルタークリアボタンが動作する', async () => {
      const user = userEvent.setup();
      const mockClearFilter = jest.fn();

      mockUseBusinessCardFilter.mockReturnValue({
        ...mockFilterHook,
        filteredCards: [],
        hasActiveFilters: true,
        clearFilter: mockClearFilter
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      await user.click(screen.getAllByRole('button', { name: 'フィルターをクリア' })[0]);
      expect(mockClearFilter).toHaveBeenCalled();
    });
  });

  describe('削除機能', () => {
    it('削除ボタンクリックでモーダルが開く', async () => {
      const user = userEvent.setup();
      const mockOpenModal = jest.fn();

      mockUseModal.mockReturnValue({
        ...mockModalHook,
        openModal: mockOpenModal
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // 最初の名刺の削除ボタンをクリック
      const deleteButtons = screen.getAllByText('削除');
      await user.click(deleteButtons[0]);

      expect(mockOpenModal).toHaveBeenCalledWith(mockBusinessCards[0]);
    });

    it('削除確認でAPI呼び出しとページリロードが実行される', async () => {
      const user = userEvent.setup();
      mockDeleteBusinessCard.mockResolvedValueOnce(undefined);
      const mockCloseModal = jest.fn();

      mockUseModal.mockReturnValue({
        ...mockModalHook,
        isOpen: true,
        data: mockBusinessCards[0],
        closeModal: mockCloseModal
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // モーダル内の削除確認ボタンをクリック
      const modal = screen.getByRole('dialog');
      const deleteButton = modal.querySelector('button.btn-danger');
      expect(deleteButton).toBeInTheDocument();
      await user.click(deleteButton!);

      await waitFor(() => {
        expect(mockDeleteBusinessCard).toHaveBeenCalledWith(1);
        expect(mockCloseModal).toHaveBeenCalled();
        expect(mockReload).toHaveBeenCalled();
      });
    });

    it('削除エラー時にモーダルが閉じられる', async () => {
      const user = userEvent.setup();
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockDeleteBusinessCard.mockRejectedValueOnce(new Error('削除エラー'));
      const mockCloseModal = jest.fn();

      mockUseModal.mockReturnValue({
        ...mockModalHook,
        isOpen: true,
        data: mockBusinessCards[0],
        closeModal: mockCloseModal
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // モーダル内の削除確認ボタンをクリック
      const modal = screen.getByRole('dialog');
      const deleteButton = modal.querySelector('button.btn-danger');
      await user.click(deleteButton!);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('削除に失敗しました:', expect.any(Error));
        expect(mockCloseModal).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });

    it('削除キャンセルでモーダルが閉じる', async () => {
      const user = userEvent.setup();
      const mockCloseModal = jest.fn();

      mockUseModal.mockReturnValue({
        ...mockModalHook,
        isOpen: true,
        data: mockBusinessCards[0],
        closeModal: mockCloseModal
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      await user.click(screen.getByRole('button', { name: 'キャンセル' }));
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  describe('Container/Presentational分離', () => {
    it('ビジネスロジック（削除処理）が正しく実装される', async () => {
      const user = userEvent.setup();
      mockDeleteBusinessCard.mockResolvedValueOnce(undefined);

      mockUseModal.mockReturnValue({
        ...mockModalHook,
        isOpen: true,
        data: mockBusinessCards[1] // 2番目のカード
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // モーダル内の削除確認ボタンをクリック
      const modal = screen.getByRole('dialog');
      const deleteButton = modal.querySelector('button.btn-danger');
      await user.click(deleteButton!);

      await waitFor(() => {
        expect(mockDeleteBusinessCard).toHaveBeenCalledWith(2); // 正しいIDが渡される
      });
    });

    it('プレゼンテーション層に正しいpropsが渡される', () => {
      const customFilterHook = {
        ...mockFilterHook,
        filteredCards: [mockBusinessCards[0]], // 1件のみフィルタリング
        hasActiveFilters: true
      };

      mockUseBusinessCardFilter.mockReturnValue(customFilterHook);

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // フィルタリングされた結果が表示される
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.queryByText('佐藤花子')).not.toBeInTheDocument();
    });
  });

  describe('hooksとの統合', () => {
    it('useBusinessCardFilterの戻り値が正しく使用される', () => {
      const mockFilter = { search: 'テスト', tags: ['React'] };
      const mockUpdateFilter = jest.fn();

      mockUseBusinessCardFilter.mockReturnValue({
        filter: mockFilter,
        filteredCards: [mockBusinessCards[0]],
        updateFilter: mockUpdateFilter,
        clearFilter: jest.fn(),
        hasActiveFilters: true
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // SearchFilterコンポーネントに正しいpropsが渡されることを間接的に確認
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.queryByText('佐藤花子')).not.toBeInTheDocument();
    });

    it('useModalの戻り値が正しく使用される', () => {
      const mockData = mockBusinessCards[0];

      mockUseModal.mockReturnValue({
        isOpen: true,
        data: mockData,
        openModal: jest.fn(),
        closeModal: jest.fn()
      });

      render(<BusinessCardListContainer businessCards={mockBusinessCards} />);

      // モーダルが開いている状態でコンポーネントがレンダリングされる
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
