import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../../../app/javascript/components/UserProfile';
import { User } from '../../../app/javascript/types/User';

describe('UserProfile', () => {
  const mockUser: User = {
    id: 1,
    name: '田中太郎',
    email: 'tanaka@example.com',
    activated: true,
    admin: false,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockOnUpdate = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  describe('基本表示', () => {
    it('ユーザープロフィールが表示される', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('ユーザープロフィール')).toBeInTheDocument();
    });

    it('ユーザー名が表示される', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('田中太郎')).toBeInTheDocument();
    });

    it('メールアドレスが表示される', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('tanaka@example.com')).toBeInTheDocument();
    });

    it('アクティベーション状態が表示される', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('アクティベート済み')).toBeInTheDocument();
    });

    it('非アクティブユーザーの場合は適切に表示される', () => {
      const inactiveUser = { ...mockUser, activated: false };
      render(
        <UserProfile
          user={inactiveUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('未アクティベート')).toBeInTheDocument();
    });
  });

  describe('読み取り専用モード', () => {
    it('編集可能でない場合は編集ボタンが表示されない', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('フォームフィールドが表示されない', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.queryByLabelText('名前')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('メールアドレス')).not.toBeInTheDocument();
    });
  });

  describe('編集可能モード', () => {
    it('編集可能な場合は編集ボタンが表示される', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    });

    it('編集ボタンをクリックすると編集モードになる', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      expect(screen.getByLabelText('名前')).toBeInTheDocument();
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    });

    it('編集モードで保存ボタンとキャンセルボタンが表示される', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });

    it('編集モードで現在の値が入力フィールドに表示される', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      expect(screen.getByDisplayValue('田中太郎')).toBeInTheDocument();
      expect(screen.getByDisplayValue('tanaka@example.com')).toBeInTheDocument();
    });
  });

  describe('編集機能', () => {
    it('フィールドを変更して保存できる', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      // 編集モードに切り替え
      await user.click(screen.getByRole('button', { name: '編集' }));

      // 名前を変更
      const nameInput = screen.getByDisplayValue('田中太郎');
      await user.clear(nameInput);
      await user.type(nameInput, '田中花子');

      // 保存
      await user.click(screen.getByRole('button', { name: '保存' }));

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith({
          name: '田中花子',
          email: 'tanaka@example.com'
        });
      });
    });

    it('キャンセルボタンで編集をキャンセルできる', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      // 編集モードに切り替え
      await user.click(screen.getByRole('button', { name: '編集' }));

      // 名前を変更
      const nameInput = screen.getByDisplayValue('田中太郎');
      await user.clear(nameInput);
      await user.type(nameInput, '田中花子');

      // キャンセル
      await user.click(screen.getByRole('button', { name: 'キャンセル' }));

      // 表示モードに戻る
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.queryByLabelText('名前')).not.toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('バリデーション', () => {
    it('名前が空の場合エラーを表示する', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      const nameInput = screen.getByDisplayValue('田中太郎');
      await user.clear(nameInput);

      await user.click(screen.getByRole('button', { name: '保存' }));

      await waitFor(() => {
        expect(screen.getByText('名前は必須です')).toBeInTheDocument();
      });

      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('メールアドレスが空の場合エラーを表示する', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      const emailInput = screen.getByDisplayValue('tanaka@example.com');
      await user.clear(emailInput);

      await user.click(screen.getByRole('button', { name: '保存' }));

      await waitFor(() => {
        expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument();
      });

      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('無効なメールアドレス形式の場合エラーを表示する', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      const emailInput = screen.getByDisplayValue('tanaka@example.com');
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // blurイベントをトリガー

      await waitFor(() => {
        expect(screen.getByText('正しいメールアドレスを入力してください')).toBeInTheDocument();
      });
    });
  });

  describe('ローディング状態', () => {
    it('保存中はボタンが無効化される', async () => {
      const user = userEvent.setup();
      render(
        <UserProfile
          user={mockUser}
          editable={true}
          onUpdate={mockOnUpdate}
        />
      );

      await user.click(screen.getByRole('button', { name: '編集' }));

      const nameInput = screen.getByDisplayValue('田中太郎');
      await user.clear(nameInput);
      await user.type(nameInput, '田中花子');

      const saveButton = screen.getByRole('button', { name: '保存' });
      await user.click(saveButton);

      // 保存中はボタンが無効化される
      expect(saveButton).toBeDisabled();
    });
  });

  describe('表示スタイル', () => {
    it('カード形式で表示される', () => {
      render(
        <UserProfile
          user={mockUser}
          editable={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('ユーザープロフィール').closest('.card')).toBeInTheDocument();
    });
  });
});