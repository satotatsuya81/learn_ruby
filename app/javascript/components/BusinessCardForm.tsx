import React, { useState } from 'react';
import { BusinessCard, BusinessCardFormData } from '@/types/BusinessCard';
import { FlashMessage } from '@/components/FlashMessage';

interface BusinessCardFormProps {
  mode: 'create' | 'edit';
  businessCard?: BusinessCard;
  onSubmit: (formData: BusinessCardFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const BusinessCardForm: React.FC<BusinessCardFormProps> = ({
  mode,
  businessCard,
  onSubmit,
  onCancel,
  loading = false
}) => {

  // フォームデータの初期値設定
  const [formData, setFormData] = useState<BusinessCardFormData>({
    name: businessCard?.name || '',
    company_name: businessCard?.company_name || '',
    job_title: businessCard?.job_title || '',
    department: businessCard?.department || '',
    email: businessCard?.email || '',
    phone: businessCard?.phone || '',
    mobile: businessCard?.mobile || '',
    website: businessCard?.website || '',
    address: businessCard?.address || '',
    notes: businessCard?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 入力フィールドの変更処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // フィールド個別のBlurバリデーション
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      newErrors.name = '名前を入力してください';
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = '会社名を入力してください';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'フォームの送信に失敗しました' });
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* エラーメッセージ表示 */}
        {errors.general && (
          <FlashMessage
            message={errors.general}
            type="danger"
            onClose={() => setErrors(prev => ({ ...prev, general: '' }))}
            autoClose={false}
          />
        )}

        {/* バリデーションエラーがある場合の全体エラーメッセージ */}
        {Object.keys(errors).filter(key => key !== 'general').length > 0 && (
          <FlashMessage
            message={[
              '入力エラーが発生しました:',
              ...Object.entries(errors)
                .filter(([key]) => key !== 'general')
                .map(([, message]) => `• ${message}`)
            ]}
            type="danger"
            onClose={() => setErrors({ general: '' })}
            autoClose={false}
          />
        )}

        {/* 必須項目 */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">名前</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="山田太郎"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="company_name" className="form-label">会社名</label>
            <input
              type="text"
              className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="株式会社サンプル"
            />
            {errors.company_name && (
              <div className="invalid-feedback">{errors.company_name}</div>
            )}
          </div>
        </div>

        {/* オプション項目 */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="job_title" className="form-label">役職</label>
            <input
              type="text"
              className="form-control"
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              placeholder="営業部長"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="department" className="form-label">部署</label>
            <input
              type="text"
              className="form-control"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="営業部"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">メール</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="yamada@example.com"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="phone" className="form-label">電話番号</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="03-1234-5678"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="mobile" className="form-label">携帯電話</label>
            <input
              type="text"
              className="form-control"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="090-1234-5678"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="website" className="form-label">ウェブサイト</label>
            <input
              type="url"
              className="form-control"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">住所</label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleInputChange}
            placeholder="東京都千代田区1-1-1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">メモ</label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="その他メモ"
          />
        </div>

        {/* 送信ボタン */}
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={loading}
          >
            {loading ? '送信中...' : (mode === 'create' ? '名刺を作成' : '名刺を更新')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};
