import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from '@/components/LoginForm';

// API mock
const mockLoginUser = jest.fn();
jest.mock('@/utils/api', () => ({
  __esModule: true,
  loginUser: (...args: any[]) => mockLoginUser(...args)
}));

// window.location.href mock
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true
});

describe('LoginForm', () => {
  const defaultProps = {
    loginPath: '/sessions',
    newPasswordResetPath: '/password_resets/new'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  describe('基本レンダリング', () => {
    it('ログインフォームが正しく表示される', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
      expect(screen.getByLabelText('ログイン情報を保持する')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
    });

    it('パスワードリセットリンクが表示される', () => {
      render(<LoginForm {...defaultProps} />);

      const resetLink = screen.getByRole('link', { name: 'パスワードを忘れた方はこちら' });
      expect(resetLink).toBeInTheDocument();
      expect(resetLink).toHaveAttribute('href', '/password_resets/new');
    });
  });

  describe('フォーム入力', () => {
    it('メールアドレス入力が正しく動作する', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...defaultProps} />);

      const emailInput = screen.getByLabelText('メールアドレス');
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('パスワード入力が正しく動作する', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText('パスワード');
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('ログイン状態保持チェックボックスが正しく動作する', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...defaultProps} />);

      const checkbox = screen.getByLabelText('ログイン情報を保持する');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('フォーム送信', () => {
    it('正常なログインが成功する', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ログイン' }));

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          remember_me: false
        });
      });

     expect(window.location.href).toBe('/');
    });

    it('remember_meがtrueの場合に正しく送信される', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.click(screen.getByLabelText('ログイン情報を保持する'));
      await user.click(screen.getByRole('button', { name: 'ログイン' }));

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          remember_me: true
        });
      });
    });

    it('送信中にボタンが無効化される', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      mockLoginUser.mockReturnValueOnce(new Promise(resolve => {
        resolvePromise = resolve;
      }));

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');

      const submitButton = screen.getByRole('button', { name: 'ログイン' });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: 'ログイン中...' })).toBeDisabled();
      expect(screen.getByLabelText('メールアドレス')).toBeDisabled();
      expect(screen.getByLabelText('パスワード')).toBeDisabled();

      // Promise解決
      resolvePromise!({ id: 1 });
    });
  });

  describe('エラーハンドリング', () => {
    it('ログインエラーが表示される', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockRejectedValueOnce(new Error('ログインに失敗しました'));

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'ログイン' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('ログインに失敗しました')).toBeInTheDocument();
      });
    });

    it('JSONエラーレスポンスが正しく処理される', async () => {
      const user = userEvent.setup();
      const errorResponse = JSON.stringify({ errors: '認証に失敗しました' });
      mockLoginUser.mockRejectedValueOnce(new Error(errorResponse));

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'ログイン' }));

      await waitFor(() => {
        expect(screen.getByText('認証に失敗しました')).toBeInTheDocument();
      });
    });

    it('ネットワークエラーが表示される', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockRejectedValueOnce('Network error');

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ログイン' }));

      await waitFor(() => {
        expect(screen.getByText('ネットワークエラーが発生しました。')).toBeInTheDocument();
      });
    });

    it('エラーメッセージを閉じることができる', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockRejectedValueOnce(new Error('ログインエラー'));

      render(<LoginForm {...defaultProps} />);

      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'ログイン' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Close'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
