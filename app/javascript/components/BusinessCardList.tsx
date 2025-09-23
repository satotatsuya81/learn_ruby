import React, { useState } from 'react';
import { BusinessCard } from '../types/BusinessCard';
import { BusinessCardItem } from './BusinessCardItem';
import { SearchFilter } from './SearchFilter';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { deleteBusinessCard } from '../utils/api';
import { useBusinessCardFilter } from '../hooks/useBusinessCardFilter';
import { useModal } from '../hooks/useModal';

interface BusinessCardListProps {
  businessCards: BusinessCard[];
}

export const BusinessCardList: React.FC<BusinessCardListProps> = ({
  businessCards
}) => {
  // hooks活用パターン
  const {
    filter,
    filteredCards,
    updateFilter,
    clearFilter,
    hasActiveFilters
  } = useBusinessCardFilter(businessCards);

  const {
    isOpen: isModalOpen,
    data: businessCardToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal
  } = useModal<BusinessCard>();

  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (id: number) => {
    const card = businessCards.find(bc => bc.id === id);
    if (card) {
      openDeleteModal(card);
    }
  };

  const handleDeleteCancel = () => {
    closeDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (businessCardToDelete) {
      try {
        await deleteBusinessCard(businessCardToDelete.id);
        closeDeleteModal();
        setError(null);
        window.location.reload();
      } catch (error) {
        console.error('削除に失敗しました:', error);
        const errorMessage = error instanceof Error ? error.message : '削除に失敗しました';
        setError(errorMessage);
        closeDeleteModal();
      }
    }
  };

  return (
    <div className="business-card-list-container">
      {/* Eight記事で重視されているFilter機能 */}
      <SearchFilter
        filter={filter}
        onFilterChange={updateFilter}
        onClearFilter={clearFilter}
        hasActiveFilters={hasActiveFilters}
        totalCount={businessCards.length}
        filteredCount={filteredCards.length}
      />

      <div className="business-card-list">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {filteredCards.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-muted">
              {hasActiveFilters
                ? '🔍 検索条件に合う名刺が見つかりませんでした'
                : '📇 まだ名刺が登録されていません'
              }
            </div>
            {hasActiveFilters && (
              <button
                className="btn btn-link"
                onClick={clearFilter}
              >
                フィルターをクリア
              </button>
            )}
          </div>
        ) : (
          <div className="row">
            {filteredCards.map(businessCard => (
              <div key={businessCard.id} className="col-md-6 col-lg-4 mb-3">
                <BusinessCardItem
                  businessCard={businessCard}
                  onDelete={handleDeleteClick}
                />
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmModal
          businessCard={businessCardToDelete}
          isOpen={isModalOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};
