import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BusinessCardForm } from '../../../app/javascript/components/BusinessCardForm';
import { BusinessCard } from '../../../app/javascript/types/BusinessCard';

// APIモックの設定
const mockCreateBusinessCard = jest.fn();
const mockUpdateBusinessCard = jest.fn();

jest.mock('../../../app/javascript/utils/api', () => ({
  createBusinessCard: mockCreateBusinessCard,
  updateBusinessCard: mockUpdateBusinessCard,
}));

describe('BusinessCardForm', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
  const mockOnCancel = jest.fn();

  const existingCard: BusinessCard = {
    id: 1,
    name: '田中太郎',
    company_name: 'テスト株式会社',
    job_title: 'エンジニア',
    department: '開発部',
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

  beforeEach(() => {
    mockCreateBusinessCard.mockClear();
    mockUpdateBusinessCard.mockClear();
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  describe('作成モード', () => {
    it('作成フォームが表示される', () => {
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: '名刺を作成' })).toBeInTheDocument();
    });

    it('必須フィールドが表示される', () => {
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText('名前')).toBeInTheDocument();
      expect(screen.getByLabelText('会社名')).toBeInTheDocument();
    });

    it('オプションフィールドが表示される', () => {
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText('役職')).toBeInTheDocument();
      expect(screen.getByLabelText('部署')).toBeInTheDocument();
      expect(screen.getByLabelText('メール')).toBeInTheDocument();
      expect(screen.getByLabelText('電話番号')).toBeInTheDocument();
      expect(screen.getByLabelText('携帯電話')).toBeInTheDocument();
      expect(screen.getByLabelText('ウェブサイト')).toBeInTheDocument();
      expect(screen.getByLabelText('住所')).toBeInTheDocument();
      expect(screen.getByLabelText('メモ')).toBeInTheDocument();
    });

    it('作成ボタンが表示される', () => {
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: '名刺を作成' })).toBeInTheDocument();
    });

    it('キャンセルボタンが表示される', () => {
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });
  });

  describe('編集モード', () => {
    it('編集フォームが表示される', () => {
      render(
        <BusinessCardForm
          mode="edit"
          businessCard={existingCard}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: '名刺を更新' })).toBeInTheDocument();
    });

    it('既存データが入力フィールドに表示される', () => {
      render(
        <BusinessCardForm
          mode="edit"
          businessCard={existingCard}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('田中太郎')).toBeInTheDocument();
      expect(screen.getByDisplayValue('テスト株式会社')).toBeInTheDocument();
      expect(screen.getByDisplayValue('エンジニア')).toBeInTheDocument();
      expect(screen.getByDisplayValue('開発部')).toBeInTheDocument();
      expect(screen.getByDisplayValue('tanaka@test.com')).toBeInTheDocument();
    });

    it('更新ボタンが表示される', () => {
      render(
        <BusinessCardForm
          mode="edit"
          businessCard={existingCard}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: '名刺を更新' })).toBeInTheDocument();
    });
  });

  describe('バリデーション', () => {
    it('名前が空の場合エラーを表示する', async () => {
      const user = userEvent.setup();
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole('button', { name: /名刺を/ });
      await user.click(submitButton);

      await waitFor(() => {
        const nameInput = screen.getByLabelText('名前');
        const invalidFeedback = nameInput.nextElementSibling;
        expect(invalidFeedback).toHaveTextContent('名前を入力してください');
      });
    });

    it('会社名が空の場合エラーを表示する', async () => {
      const user = userEvent.setup();
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('名前');
      await user.type(nameInput, '田中太郎');

      const submitButton = screen.getByRole('button', { name: /名刺を/ });
      await user.click(submitButton);

      await waitFor(() => {
        const companyNameInput = screen.getByLabelText('会社名');
        const invalidFeedback = companyNameInput.nextElementSibling;
        expect(invalidFeedback).toHaveTextContent('会社名を入力してください');
      });
    });

    it('メールアドレスの形式が正しくない場合エラーを表示する', async () => {
      const user = userEvent.setup();
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const emailInput = screen.getByLabelText('メール');

      await user.type(emailInput, 'invalid-email');
      await user.tab(); // フォーカスを移動してblurイベントをトリガー

      await waitFor(() => {
        const emailInput = screen.getByLabelText('メール');
        const invalidFeedback = emailInput.nextElementSibling;
        expect(invalidFeedback).toHaveTextContent('正しいメールアドレスを入力してください');
      });
    });
  });

  describe('フォーム送信', () => {
    it('有効なデータで送信が成功する', async () => {
      const user = userEvent.setup();
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      // 必須フィールドに入力
      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('会社名'), 'テスト株式会社');

      // フォーム送信
      await user.click(screen.getByRole('button', { name: /名刺を/ }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('編集時にフィールドを変更して送信できる', async () => {
      const user = userEvent.setup();
      render(
        <BusinessCardForm
          mode="edit"
          businessCard={existingCard}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      // フィールドを変更
      const nameInput = screen.getByDisplayValue('田中太郎');
      await user.clear(nameInput);
      await user.type(nameInput, '田中花子');

      // フォーム送信
      await user.click(screen.getByRole('button', { name: /名刺を/ }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('操作ボタン', () => {
    it('キャンセルボタンクリックでonCancel関数が呼ばれる', async () => {
      const user = userEvent.setup();
      render(
        <BusinessCardForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByRole('button', { name: 'キャンセル' }));
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('ローディング状態', () => {
    it('送信中はボタンが無効化される', async () => {
      const user = userEvent.setup();

      // 遅延するmockOnSubmitを作成
      const slowMockOnSubmit = jest.fn(() => new Promise<void>(resolve => setTimeout(resolve, 100)));

      render(
        <BusinessCardForm
          mode="create"
          onSubmit={slowMockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('会社名'), 'テスト株式会社');

      const submitButton = screen.getByRole('button', { name: /名刺を/ });
      await user.click(submitButton);

      // ローディング中の確認
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
