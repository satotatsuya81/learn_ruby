import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserRegistrationForm from '../../../app/javascript/components/UserRegistrationForm';

// API mock
const mockCreateUser = jest.fn();
jest.mock('../../../app/javascript/utils/api', () => ({
  __esModule: true,
  createUser: (...args: any[]) => mockCreateUser(...args)
}));

// Validation mock
const mockValidateUserRegistration = jest.fn();
jest.mock('../../../app/javascript/utils/validation', () => ({
  validateUserRegistration: (...args: any[]) => mockValidateUserRegistration(...args)
}));

// window.location.href mock
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true
});

describe('UserRegistrationForm', () => {
  const defaultProps = {
    signupPath: '/users',
    loginPath: '/sessions/new'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
    mockValidateUserRegistration.mockReturnValue({ isValid: true, errors: {} });
  });

  describe('基本レンダリング', () => {
    it('ユーザー登録フォームが正しく表示される', () => {
      render(<UserRegistrationForm {...defaultProps} />);

      expect(screen.getByRole('heading', { name: 'ユーザー登録' })).toBeInTheDocument();
      expect(screen.getByLabelText('名前')).toBeInTheDocument();
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード（確認）')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ユーザー登録' })).toBeInTheDocument();
    });

    it('ログインリンクが表示される', () => {
      render(<UserRegistrationForm {...defaultProps} />);

      const loginLink = screen.getByRole('link', { name: 'ログインはこちら' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/sessions/new');
    });

    it('パスワードのヘルプテキストが表示される', () => {
      render(<UserRegistrationForm {...defaultProps} />);

      expect(screen.getByText('6文字以上で入力してください')).toBeInTheDocument();
    });
  });

  describe('フォーム入力', () => {
    it('名前入力が正しく動作する', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm {...defaultProps} />);

      const nameInput = screen.getByLabelText('名前');
      await user.type(nameInput, '田中太郎');

      expect(nameInput).toHaveValue('田中太郎');
    });

    it('メールアドレス入力が正しく動作する', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm {...defaultProps} />);

      const emailInput = screen.getByLabelText('メールアドレス');
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('パスワード入力が正しく動作する', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText('パスワード');
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('パスワード（確認）入力が正しく動作する', async () => {
      const user = userEvent.setup();
      render(<UserRegistrationForm {...defaultProps} />);

      const passwordConfirmInput = screen.getByLabelText('パスワード（確認）');
      await user.type(passwordConfirmInput, 'password123');

      expect(passwordConfirmInput).toHaveValue('password123');
    });

    it('入力時にフィールドエラーがクリアされる', async () => {
      const user = userEvent.setup();
      mockValidateUserRegistration.mockReturnValue({
        isValid: false,
        errors: { name: '名前は必須です' }
      });

      render(<UserRegistrationForm {...defaultProps} />);

      // エラーを発生させる
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(screen.getByText('名前は必須です')).toBeInTheDocument();
      });

      // 名前を入力してエラーがクリアされることを確認
      const nameInput = screen.getByLabelText('名前');
      await user.type(nameInput, '田中');

      expect(screen.queryByText('名前は必須です')).not.toBeInTheDocument();
    });
  });

  describe('バリデーション', () => {
    it('バリデーションエラーが表示される', async () => {
      const user = userEvent.setup();
      mockValidateUserRegistration.mockReturnValue({
        isValid: false,
        errors: {
          name: '名前は必須です',
          email: '有効なメールアドレスを入力してください',
          password: 'パスワードは6文字以上である必要があります'
        }
      });

      render(<UserRegistrationForm {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(screen.getByText('名前は必須です')).toBeInTheDocument();
        expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
        expect(screen.getByText('パスワードは6文字以上である必要があります')).toBeInTheDocument();
      });

      // API呼び出しされないことを確認
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('バリデーション成功時にAPIが呼び出される', async () => {
      const user = userEvent.setup();
      mockValidateUserRegistration.mockReturnValue({ isValid: true, errors: {} });
      mockCreateUser.mockResolvedValueOnce({ id: 1, name: '田中太郎', email: 'test@example.com' });

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(mockValidateUserRegistration).toHaveBeenCalledWith({
          name: '田中太郎',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123'
        });
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        name: '田中太郎',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      });
    });
  });

  describe('フォーム送信', () => {
    beforeEach(() => {
      mockValidateUserRegistration.mockReturnValue({ isValid: true, errors: {} });
    });

    it('正常な登録が成功する', async () => {
      const user = userEvent.setup();
      mockCreateUser.mockResolvedValueOnce({ id: 1, name: '田中太郎', email: 'test@example.com' });

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith({
          name: '田中太郎',
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        });
      });

      expect(window.location.href).toBe('/business_cards');
    });

    it('送信中にフォームが無効化される', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      mockCreateUser.mockReturnValueOnce(new Promise(resolve => {
        resolvePromise = resolve;
      }));

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');

      const submitButton = screen.getByRole('button', { name: 'ユーザー登録' });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: '登録中...' })).toBeDisabled();
      expect(screen.getByLabelText('名前')).toBeDisabled();
      expect(screen.getByLabelText('メールアドレス')).toBeDisabled();
      expect(screen.getByLabelText('パスワード')).toBeDisabled();
      expect(screen.getByLabelText('パスワード（確認）')).toBeDisabled();

      // Promise解決
      resolvePromise!({ id: 1 });
    });

    it('送信中にスピナーが表示される', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      mockCreateUser.mockReturnValueOnce(new Promise(resolve => {
        resolvePromise = resolve;
      }));

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('登録中...')).toBeInTheDocument();

      // Promise解決
      resolvePromise!({ id: 1 });
    });
  });

  describe('エラーハンドリング', () => {
    beforeEach(() => {
      mockValidateUserRegistration.mockReturnValue({ isValid: true, errors: {} });
    });

    it('APIエラーが表示される', async () => {
      const user = userEvent.setup();
      mockCreateUser.mockRejectedValueOnce(new Error('ユーザー登録に失敗しました'));

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('ユーザー登録に失敗しました')).toBeInTheDocument();
      });
    });

    it('JSONエラーレスポンスが正しく処理される', async () => {
      const user = userEvent.setup();
      const errorResponse = JSON.stringify({
        errors: {
          email: ['既に使用されています'],
          password: ['短すぎます']
        }
      });
      mockCreateUser.mockRejectedValueOnce(new Error(errorResponse));

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'pass');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'pass');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(screen.getByText('既に使用されています')).toBeInTheDocument();
        expect(screen.getByText('短すぎます')).toBeInTheDocument();
      });
    });

    it('ネットワークエラーが表示される', async () => {
      const user = userEvent.setup();
      mockCreateUser.mockRejectedValueOnce('Network error');

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(screen.getByText('ネットワークエラーが発生しました。')).toBeInTheDocument();
      });
    });

    it('一般的なエラーメッセージを閉じることができる', async () => {
      const user = userEvent.setup();
      mockCreateUser.mockRejectedValueOnce(new Error('登録エラー'));

      render(<UserRegistrationForm {...defaultProps} />);

      await user.type(screen.getByLabelText('名前'), '田中太郎');
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'password123');
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
      await user.click(screen.getByRole('button', { name: 'ユーザー登録' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Close'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
