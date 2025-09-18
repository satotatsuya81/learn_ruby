import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import { BusinessCardList } from '../../../app/javascript/components/BusinessCardList';
  import * as api from '../../../app/javascript/utils/api';

  // API関数をモック化 - 実際のHTTP通信を行わずにテスト用の動作を定義
  jest.mock('../../../app/javascript/utils/api');
  const mockApi = api as jest.Mocked<typeof api>;

  describe('BusinessCardList', () => {
    // テスト用のモックデータ - 複数の名刺を含むリアルなデータ構造
    const mockBusinessCards = [
      {
        id: 1,
        name: '田中太郎',
        company_name: 'テスト株式会社',
        job_title: 'エンジニア',
        email: 'tanaka@test.com',
        phone: '03-1234-5678',
        address: '東京都渋谷区',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_id: 1
      },
      {
        id: 2,
        name: '佐藤花子',
        company_name: 'サンプル有限会社',
        job_title: 'デザイナー',
        email: 'sato@sample.co.jp',
        phone: '03-8765-4321',
        address: '東京都新宿区',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        user_id: 1
      }
    ];

    beforeEach(() => {
      // 各テスト前にモック関数をリセット - テスト間の影響を排除
      mockApi.deleteBusinessCard.mockClear();
    });

    describe('基本表示機能', () => {
      it('複数の名刺を一覧表示できる', () => {
        render(<BusinessCardList businessCards={mockBusinessCards} />);

        // 各名刺の基本情報が表示されることを確認
        expect(screen.getByText('田中太郎')).toBeInTheDocument();
        expect(screen.getByText('テスト株式会社')).toBeInTheDocument();
        expect(screen.getByText('佐藤花子')).toBeInTheDocument();
        expect(screen.getByText('サンプル有限会社')).toBeInTheDocument();
      });

      it('名刺が0件の場合、適切なメッセージを表示する', () => {
        render(<BusinessCardList businessCards={[]} />);

        expect(screen.getByText('名刺がありません。')).toBeInTheDocument();
      });

      it('各名刺に削除ボタンが表示される', () => {
        render(<BusinessCardList businessCards={mockBusinessCards} />);

        const deleteButtons = screen.getAllByTestId('delete-button');
        expect(deleteButtons).toHaveLength(2);
      });
    });

    describe('削除機能の統合テスト', () => {
      it('削除ボタンクリックで削除確認モーダルが表示される', () => {
        render(<BusinessCardList businessCards={mockBusinessCards} />);

        // 最初はモーダルが表示されていないことを確認
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();

        // 1つ目の名刺の削除ボタンをクリック
        const deleteButtons = screen.getAllByTestId('delete-button');
        fireEvent.click(deleteButtons[0]);

        // モーダルが表示されることを確認
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
        expect(screen.getByText('以下の名刺を削除してもよろしいですか？')).toBeInTheDocument();
        // モーダル内で名前と会社名が表示されることを確認
        const modal = screen.getByTestId('delete-modal');
        expect(modal).toHaveTextContent('田中太郎');
        expect(modal).toHaveTextContent('テスト株式会社');
      });

      it('モーダルのキャンセルボタンでモーダルが閉じる', () => {
        render(<BusinessCardList businessCards={mockBusinessCards} />);

        // 削除ボタンをクリックしてモーダルを表示
        const deleteButtons = screen.getAllByTestId('delete-button');
        fireEvent.click(deleteButtons[0]);

        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

        // キャンセルボタンをクリック
        fireEvent.click(screen.getByTestId('cancel-button'));

        // モーダルが閉じることを確認
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
      });

      it('モーダルの削除実行で名刺が削除される', async () => {
        // API呼び出しの成功をモック
        mockApi.deleteBusinessCard.mockResolvedValueOnce(undefined);

        render(<BusinessCardList businessCards={mockBusinessCards} />);

        // 削除ボタンをクリックしてモーダルを表示
        const deleteButtons = screen.getAllByTestId('delete-button');
        fireEvent.click(deleteButtons[0]);

        // 削除実行ボタンをクリック
        fireEvent.click(screen.getByTestId('confirm-button'));

        // API関数が正しいIDで呼び出されることを確認
        expect(mockApi.deleteBusinessCard).toHaveBeenCalledWith(1);

        // モーダルが閉じることを確認
        await waitFor(() => {
          expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
        });
      });

      it('削除処理中にエラーが発生した場合、適切に処理される', async () => {
        // API呼び出しの失敗をモック
        const errorMessage = 'サーバーエラーが発生しました';
        mockApi.deleteBusinessCard.mockRejectedValueOnce(new Error(errorMessage));

        render(<BusinessCardList businessCards={mockBusinessCards} />);

        // 削除ボタンをクリックしてモーダルを表示
        const deleteButtons = screen.getAllByTestId('delete-button');
        fireEvent.click(deleteButtons[0]);

        // 削除実行ボタンをクリック
        fireEvent.click(screen.getByTestId('confirm-button'));

        // エラーメッセージが表示されることを確認
        await waitFor(() => {
          expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
      });
    });
  });
