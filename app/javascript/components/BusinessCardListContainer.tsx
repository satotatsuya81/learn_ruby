import React from 'react';
import { BusinessCard } from '../types/BusinessCard';
import { BusinessCardItem } from './BusinessCardItem';
import { SearchFilter } from './SearchFilter';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useBusinessCardFilter } from '../hooks/useBusinessCardFilter';
import { useModal } from '../hooks/useModal';

interface BusinessCardListProps {
  businessCards: BusinessCard[];
}

/**
 * Container/Presentational分離パターン
 * ビジネスロジックと表示ロジックを分離
 */
export const BusinessCardListContainer: React.FC<BusinessCardListProps> = ({
  businessCards
}) => {
  // Eight記事のhooks活用パターン
  const {
    filter,
    filteredCards,
    updateFilter,
    clearFilter,
    hasActiveFilters
  } = useBusinessCardFilter(businessCards);

  const {
    isOpen: isDeleteModalOpen,
    data: cardToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal
  } = useModal<BusinessCard>();

  const handleDeleteClick = (id: number) => {
    const card = businessCards.find(bc => bc.id === id);
    if (card) {
      openDeleteModal(card);
    }
  };

  const handleDeleteConfirm = async () => {
    if (cardToDelete) {
      try {
        // 削除処理はBusinessCardListにそのまま委譲
        await import('../utils/api').then(({ deleteBusinessCard }) =>
          deleteBusinessCard(cardToDelete.id)
        );
        closeDeleteModal();
        window.location.reload(); // JIT: サーバー側変更なしでページリロード
      } catch (error) {
        console.error('削除に失敗しました:', error);
        closeDeleteModal();
      }
    }
  };

  return (
    <BusinessCardListPresentation
      businessCards={businessCards}
      filteredCards={filteredCards}
      filter={filter}
      onFilterChange={updateFilter}
      onClearFilter={clearFilter}
      hasActiveFilters={hasActiveFilters}
      onDeleteClick={handleDeleteClick}
      isDeleteModalOpen={isDeleteModalOpen}
      cardToDelete={cardToDelete}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteCancel={closeDeleteModal}
    />
  );
};

/**
 * Presentational Component
 * UIの描画のみに集中
 */
interface BusinessCardListPresentationProps {
  businessCards: BusinessCard[];
  filteredCards: BusinessCard[];
  filter: any;
  onFilterChange: any;
  onClearFilter: () => void;
  hasActiveFilters: boolean;
  onDeleteClick: (id: number) => void;
  isDeleteModalOpen: boolean;
  cardToDelete: BusinessCard | null;
  onDeleteConfirm: () => Promise<void>;
  onDeleteCancel: () => void;
}

const BusinessCardListPresentation: React.FC<BusinessCardListPresentationProps> = ({
  businessCards,
  filteredCards,
  filter,
  onFilterChange,
  onClearFilter,
  hasActiveFilters,
  onDeleteClick,
  isDeleteModalOpen,
  cardToDelete,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  return (
    <div className="business-card-list-container">
      {/* Eight記事で重視されているFilter機能 */}
      <SearchFilter
        filter={filter}
        onFilterChange={onFilterChange}
        onClearFilter={onClearFilter}
        hasActiveFilters={hasActiveFilters}
        totalCount={businessCards.length}
        filteredCount={filteredCards.length}
      />

      {/* メインコンテンツ */}
      <div className="business-card-list">
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
                onClick={onClearFilter}
              >
                フィルターをクリア
              </button>
            )}
          </div>
        ) : (
          <div className="row">
            {filteredCards.map((businessCard) => (
              <div key={businessCard.id} className="col-md-6 col-lg-4 mb-3">
                <BusinessCardItem
                  businessCard={businessCard}
                  onDelete={onDeleteClick}
                />
              </div>
            ))}
          </div>
        )}

        {/* Modal状態管理 */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          businessCard={cardToDelete}
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
        />
      </div>
    </div>
  );
};
