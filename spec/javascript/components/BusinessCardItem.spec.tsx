import { render, screen, fireEvent } from '@testing-library/react';
  import { BusinessCardItem } from '@/components/BusinessCardItem';
  import { BusinessCard } from '@/types//BusinessCard';

  // テスト用のモックデータ - 実際の名刺データの構造を反映
  const mockBusinessCard: BusinessCard = {
    id: 1,
    name: '田中太郎',
    company_name: 'テスト株式会社',
    job_title: 'シニアエンジニア',
    email: 'tanaka@test.com',
    phone: '03-1234-5678',
    user_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  describe('BusinessCardItem', () => {
    // モック関数 - 削除処理が呼ばれたかをテストするため
    const mockOnDelete = jest.fn();

    beforeEach(() => {
      // 各テスト前にモック関数をクリア
      mockOnDelete.mockClear();
    });

    describe('名刺情報の表示', () => {
      it('名前、会社名、役職が正しく表示される', () => {
        // コンポーネントをレンダリング
        render(
          <BusinessCardItem
            businessCard={mockBusinessCard}
            onDelete={mockOnDelete}
          />
        );

        // 各フィールドが画面に表示されていることを確認
        expect(screen.getByText('田中太郎')).toBeInTheDocument();
        expect(screen.getByText('テスト株式会社')).toBeInTheDocument();
        expect(screen.getByText('シニアエンジニア')).toBeInTheDocument();
      });
    });

    describe('操作ボタン', () => {
      it('詳細、編集、削除ボタンが表示される', () => {
        render(
          <BusinessCardItem
            businessCard={mockBusinessCard}
            onDelete={mockOnDelete}
          />
        );

        // 各ボタンの存在確認
        expect(screen.getByText('詳細')).toBeInTheDocument();
        expect(screen.getByText('編集')).toBeInTheDocument();
        expect(screen.getByText('削除')).toBeInTheDocument();
      });
    });

    describe('削除機能', () => {
      it('削除ボタンクリック時にonDelete関数が正しいIDで呼ばれる', () => {
        render(
          <BusinessCardItem
            businessCard={mockBusinessCard}
            onDelete={mockOnDelete}
          />
        );

        // 削除ボタンをクリック
        fireEvent.click(screen.getByRole('button', { name: '削除' }));

        // onDelete関数が正しいIDで呼ばれたか確認
        expect(mockOnDelete).toHaveBeenCalledWith(1);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
      });
    });
  });
