import React from 'react';
  import { BusinessCard } from '../types/business_card';

  // プロパティの型定義
  interface DeleteConfirmModalProps {
    businessCard: BusinessCard | null;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }

  // 削除確認モーダルコンポーネント
  export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    businessCard,
    isOpen,
    onConfirm,
    onCancel
  }) => {
    // モーダルを表示しない条件
    if (!isOpen || !businessCard) return null;

    return (
      <div className="modal fade show" style={{ display: 'block' }} data-testid="delete-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">削除確認</h5>
            </div>
            <div className="modal-body">
              <p>以下の名刺を削除してもよろしいですか？</p>
              <p>
                <strong>{businessCard.name}</strong><br />
                {businessCard.company_name}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                data-testid="cancel-button"
              >
                キャンセル
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                data-testid="confirm-button"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
