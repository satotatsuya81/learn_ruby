import { FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  message?: string;
  showMessage?: boolean;
  centered?: boolean;
  overlay?: boolean;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  message = '読み込み中...',
  showMessage = true,
  centered = false,
  overlay = false
}) => {
  // サイズに応じたクラスとスタイルを決定
  const getSpinnerClasses = () => {
    const baseClass = 'spinner-border';
    const sizeClass = size === 'small' ? 'spinner-border-sm' : '';
    const colorClass = `text-${color}`;

    return [baseClass, sizeClass, colorClass].filter(Boolean).join(' ');
  };

  // サイズに応じたインラインスタイル
  const getSpinnerStyle = () => {
    if (size === 'large') {
      return { width: '3rem', height: '3rem' };
    }
    return {};
  };

  // コンテナのクラスを決定
  const getContainerClasses = () => {
    const classes = [];

    if (centered) {
      classes.push('d-flex', 'justify-content-center', 'align-items-center');
    }

    if (overlay) {
      classes.push('position-fixed');
    }

    return classes.join(' ');
  };

  // オーバーレイモードの場合のスタイル
  const getContainerStyle = () => {
    if (overlay) {
      return {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      };
    }
    return {};
  };

  const spinnerElement = (
    <div
      className={getSpinnerClasses()}
      role="status"
      aria-hidden="true"
      data-testid="loading-spinner"
      style={getSpinnerStyle()}
    >
      <span className="visually-hidden">{message}</span>
    </div>
  );

  const content = (
    <div className="d-flex flex-column align-items-center">
      {spinnerElement}
      {showMessage && (
        <div className="mt-2 text-muted" data-testid="loading-message">
          {message}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={getContainerClasses()}
      style={getContainerStyle()}
      data-testid="loading-container"
    >
      {content}
    </div>
  );
};