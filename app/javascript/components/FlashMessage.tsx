import React, { useEffect } from 'react';

interface FlashMessageProps {
  message: string | string[];
  type: 'success' | 'danger' | 'warning' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  type,
  onClose,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  // 自動クリア機能
  useEffect(() => {
    if (!autoClose || !message) return;

    const timer = setTimeout(onClose, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDelay, onClose]);

  if (!message) return null;

  const messages = Array.isArray(message) ? message : [message];

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Close"
      ></button>
    </div>
  );
};