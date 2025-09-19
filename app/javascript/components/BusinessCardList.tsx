import React, { useState } from 'react';
  import { BusinessCard } from '../types/BusinessCard';
  import { BusinessCardItem } from './BusinessCardItem';
  import { DeleteConfirmModal } from './DeleteConfirmModal';
  import { deleteBusinessCard } from '../utils/api';

  interface BusinessCardListProps {
    businessCards: BusinessCard[];
  }

  export const BusinessCardList: React.FC<BusinessCardListProps> = ({
    businessCards
  }) => {
    // 削除確認モーダルの状態管理
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [businessCardToDelete, setBusinessCardToDelete] = useState<BusinessCard | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 削除ボタンがクリックされた時の処理
    const handleDeleteClick = (id: number) => {
      const card = businessCards.find(bc => bc.id === id);
      if (card) {
        setBusinessCardToDelete(card);
        setIsModalOpen(true);
      }
    };

    // 削除確認モーダルでキャンセルが選択された時の処理
    const handleDeleteCancel = () => {
      setIsModalOpen(false);
      setBusinessCardToDelete(null);
    };

    // 削除確認モーダルで削除が確定された時の処理
    const handleDeleteConfirm = async () => {
      if (businessCardToDelete) {
        try {
          await deleteBusinessCard(businessCardToDelete.id);
          setIsModalOpen(false);
          setBusinessCardToDelete(null);
          setError(null);
          // 実際のアプリケーションでは親コンポーネントに削除完了を通知し、
          // リストを更新します。今は最小限の実装でモーダルを閉じるだけ
        } catch (error) {
          console.error('削除に失敗しました:', error);
          const errorMessage = error instanceof Error ? error.message : '削除に失敗しました';
          setError(errorMessage);
          setIsModalOpen(false);
          setBusinessCardToDelete(null);
        }
      }
    };

    return (
      <div className="business-card-list" data-testid="business-card-list">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {businessCards.length === 0 ? (
          <p>名刺がありません。</p>
        ) : (
          businessCards.map(businessCard => (
            <BusinessCardItem
              key={businessCard.id}
              businessCard={businessCard}
              onDelete={handleDeleteClick}
            />
          ))
        )}

        <DeleteConfirmModal
          businessCard={businessCardToDelete}
          isOpen={isModalOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    );
  };
