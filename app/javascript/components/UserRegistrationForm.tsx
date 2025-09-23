import React, { useState } from 'react';
import { UserRegistrationData } from '@/types/user';
import { validateUserRegistration } from '@/utils/validation';

interface UserRegistrationFormProps {
  signupPath: string;
  loginPath: string;
}

interface ValidationErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  passwordConfirmation?: string[];
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ signupPath, loginPath }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 入力時にそのフィールドのエラーをクリア
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const validation = validateUserRegistration(formData);

    // FormValidationResultのerrorsを ValidationErrors 形式に変換
    const newErrors: ValidationErrors = {};
    Object.entries(validation.errors).forEach(([key, message]) => {
      newErrors[key as keyof ValidationErrors] = [message];
    });

    setErrors(newErrors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    try {
      const { createUser } = await import('@/utils/api');

      const userData: UserRegistrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation
      };

      await createUser(userData);

      // 登録成功時はリダイレクト（signupPathを使用）
      window.location.href = signupPath.replace('/users', '/business_cards');
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        // APIエラーからバリデーションエラーを抽出する場合の処理
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            setErrors(errorData.errors);
          } else {
            setGeneralError('ユーザー登録に失敗しました。');
          }
        } catch {
          setGeneralError(error.message || 'ユーザー登録に失敗しました。');
        }
      } else {
        setGeneralError('ネットワークエラーが発生しました。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldErrors?: string[]) => {
    if (!fieldErrors || fieldErrors.length === 0) return null;

    return (
      <div className="invalid-feedback d-block">
        {fieldErrors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">ユーザー登録</h3>
            </div>
            <div className="card-body">

              {/* 全般エラーメッセージ */}
              {generalError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {generalError}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setGeneralError('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="needs-validation" noValidate>

                {/* 名前入力 */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">名前</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {renderFieldError(errors.name)}
                </div>

                {/* メールアドレス入力 */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">メールアドレス</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {renderFieldError(errors.email)}
                </div>

                {/* パスワード入力 */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">パスワード</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {renderFieldError(errors.password)}
                  <div className="form-text">6文字以上で入力してください</div>
                </div>

                {/* パスワード（確認）入力 */}
                <div className="mb-3">
                  <label htmlFor="passwordConfirmation" className="form-label">パスワード（確認）</label>
                  <input
                    type="password"
                    className={`form-control ${errors.passwordConfirmation ? 'is-invalid' : ''}`}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {renderFieldError(errors.passwordConfirmation)}
                </div>

                {/* 登録ボタン */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        登録中...
                      </>
                    ) : (
                      'ユーザー登録'
                    )}
                  </button>
                </div>
              </form>

              {/* ログインリンク */}
              <div className="text-center mt-3">
                <span>既にアカウントをお持ちですか？ </span>
                <a href={loginPath} className="text-decoration-none">
                  ログインはこちら
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;
