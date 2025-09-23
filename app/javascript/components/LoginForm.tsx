import React, { useState } from 'react';
import { UserLoginData } from '@/types/user';

interface LoginFormProps {
  loginPath: string;
  newPasswordResetPath: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ newPasswordResetPath }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const { loginUser } = await import('@/utils/api');

      const loginData: UserLoginData = {
        email: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe
      };

      await loginUser(loginData);

      // ログイン成功時はリダイレクト
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            setErrors([errorData.errors]);
          } else {
            setErrors(['ログインに失敗しました。メールアドレスとパスワードを確認してください。']);
          }
        } catch {
          setErrors([error.message || 'ログインに失敗しました。メールアドレスとパスワードを確認してください。']);
        }
      } else {
        setErrors(['ネットワークエラーが発生しました。']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">ログイン</h3>
            </div>
            <div className="card-body">

              {/* エラーメッセージ表示 */}
              {errors.length > 0 && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setErrors([])}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="needs-validation" noValidate>

                {/* メールアドレス入力 */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">メールアドレス</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* パスワード入力 */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">パスワード</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* ログイン状態を保持チェックボックス */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    ログイン情報を保持する
                  </label>
                </div>

                {/* ログインボタン */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        ログイン中...
                      </>
                    ) : (
                      'ログイン'
                    )}
                  </button>
                </div>
              </form>

              {/* パスワードリセットリンク */}
              <div className="text-center mt-3">
                <a href={newPasswordResetPath} className="text-decoration-none">
                  パスワードを忘れた方はこちら
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
