  import { render, screen, fireEvent } from '@testing-library/react';
  import { BusinessCardList } from '@/components/BusinessCardList';
  import * as api from '@/utils/api';
  // ファクトリー関数をインポート
  import { createBusinessCards } from '../factories/businessCardFactory';

  jest.mock('@/utils/api');
  const mockApi = api as jest.Mocked<typeof api>;

  describe('BusinessCardList', () => {
    // ファクトリー関数を使用してモックデータを生成
    const mockBusinessCards = createBusinessCards(3);

    beforeEach(() => {
      mockApi.deleteBusinessCard.mockClear();
    });

    it('名刺一覧を表示する', () => {
      render(<BusinessCardList businessCards={mockBusinessCards} />);

      expect(screen.getByText('テストユーザー1')).toBeInTheDocument();
      expect(screen.getByText('テスト会社1')).toBeInTheDocument();
    });

    it('削除ボタンクリックで削除確認モーダルを表示する', () => {
      render(<BusinessCardList businessCards={mockBusinessCards} />);

      fireEvent.click(screen.getAllByRole('button', { name: '削除' })[0]);

      expect(screen.getByText('削除確認')).toBeInTheDocument();
      expect(screen.getByText('以下の名刺を削除してもよろしいですか？')).toBeInTheDocument();
    });
  });
