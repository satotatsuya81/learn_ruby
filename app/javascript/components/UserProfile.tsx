import React, { useState } from 'react';
import { User, UserUpdateData } from '@/types/user';

interface UserProfileProps {
  user: User;
  editable: boolean;
  onUpdate: (data: UserUpdateData) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  editable,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  // 編集モードの切り替え
  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email
    });
    setErrors({});
  };

  // 編集キャンセル
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email
    });
    setErrors({});
  };

  // 入力フィールドの変更処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // メールフィールドのBlurバリデーション
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors: Record<string, string> = {};

    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  };

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdate(formData);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      setErrors({ general: '更新に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">ユーザープロフィール</h5>
        {editable && !isEditing && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleEditClick}
          >
            編集
          </button>
        )}
      </div>
      <div className="card-body">
        {/* エラーメッセージ表示 */}
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        {!isEditing ? (
          // 表示モード
          <div>
            <div className="row mb-3">
              <div className="col-sm-3">
                <strong>名前:</strong>
              </div>
              <div className="col-sm-9">
                {user.name}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3">
                <strong>メールアドレス:</strong>
              </div>
              <div className="col-sm-9">
                {user.email}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3">
                <strong>アクティベーション:</strong>
              </div>
              <div className="col-sm-9">
                <span className={`badge ${user.activated ? 'bg-success' : 'bg-warning'}`}>
                  {user.activated ? 'アクティベート済み' : '未アクティベート'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // 編集モード
          <div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">名前</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">メールアドレス</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? '保存中...' : '保存'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
