  import { render, screen, fireEvent } from '@testing-library/react';
  import { DeleteConfirmModal } from '../../../app/javascript/components/DeleteConfirmModal';
  import { BusinessCard } from '../../../app/javascript/types/BusinessCard'; // パス修正

  describe('DeleteConfirmModal', () => {
    const mockBusinessCard: BusinessCard = {
      id: 1,
      name: '田中太郎',
      company_name: 'テスト株式会社', // フィールド名をcompany_nameに修正
      job_title: 'エンジニア', // positionからjob_titleに修正
      email: 'tanaka@test.com',
      phone: '03-1234-5678',
      address: '東京都渋谷区',
      created_at: '2023-01-01T00:00:00.000Z', // 必須フィールド追加
      updated_at: '2023-01-01T00:00:00.000Z', // 必須フィールド追加
      user_id: 1 // 必須フィールド追加
    };

    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
      // 各テスト前にモック関数をクリア
      jest.clearAllMocks();
    });

    describe('モーダルの表示制御', () => {
      it('isOpenがfalseの場合はモーダルが表示されない', () => {
        render(
          <DeleteConfirmModal
            businessCard={mockBusinessCard}
            isOpen={false}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // モーダルが表示されていないことを確認
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
      });

      it('businessCardがnullの場合はモーダルが表示されない', () => {
        render(
          <DeleteConfirmModal
            businessCard={null}
            isOpen={true}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // モーダルが表示されていないことを確認
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
      });

      it('isOpenがtrueかつbusinessCardが存在する場合はモーダルが表示される', () => {
        render(
          <DeleteConfirmModal
            businessCard={mockBusinessCard}
            isOpen={true}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // モーダルが表示されていることを確認
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
        expect(screen.getByText('削除確認')).toBeInTheDocument();
      });
    });

    describe('名刺情報の表示', () => {
      it('削除対象の名刺情報を正しく表示する', () => {
        render(
          <DeleteConfirmModal
            businessCard={mockBusinessCard}
            isOpen={true}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // 削除確認メッセージが表示されることを確認
        expect(screen.getByText('以下の名刺を削除してもよろしいですか？')).toBeInTheDocument();

        // 名刺の名前と会社名が表示されることを確認
        expect(screen.getByText('田中太郎')).toBeInTheDocument();
        expect(screen.getByText('テスト株式会社')).toBeInTheDocument();
      });
    });

    describe('ボタンのクリック処理', () => {
      it('確認ボタンをクリックするとonConfirmが呼ばれる', () => {
        render(
          <DeleteConfirmModal
            businessCard={mockBusinessCard}
            isOpen={true}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // 確認ボタンをクリック
        fireEvent.click(screen.getByTestId('confirm-button'));

        // onConfirmコールバックが1回呼ばれることを確認
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnCancel).not.toHaveBeenCalled();
      });

      it('キャンセルボタンをクリックするとonCancelが呼ばれる', () => {
        render(
          <DeleteConfirmModal
            businessCard={mockBusinessCard}
            isOpen={true}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // キャンセルボタンをクリック
        fireEvent.click(screen.getByTestId('cancel-button'));

        // onCancelコールバックが1回呼ばれることを確認
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
      });
    });
  });
