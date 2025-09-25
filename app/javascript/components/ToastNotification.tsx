import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { removeToast } from '@/store/slices/uiSlice';

// 個別のトーストコンポーネントのプロパティ定義
interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// 個別トーストコンポーネント: 自動消去とクリック消去機能を持つ
export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000 }) => {
  const dispatch = useAppDispatch();

  // 自動消去タイマーの設定
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(id));
      }, duration);

      // コンポーネントアンマウント時にタイマーをクリア（メモリリーク防止）
      return () => clearTimeout(timer);
    }
    // duration が 0 以下の場合は何も返さない（クリーンアップ不要）
    return undefined;
  }, [id, duration, dispatch]);

  // 手動でトーストを閉じる処理
  const handleClose = () => {
    dispatch(removeToast(id));
  };

  // Bootstrap 5のトーストスタイルを使用
  return (
    <div className={`toast align-items-center text-bg-${type} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={handleClose}
          aria-label="Close"
        />
      </div>
    </div>
  );
};

// トーストコンテナー: 複数のトーストを管理・表示
export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map((toast: ToastProps) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
