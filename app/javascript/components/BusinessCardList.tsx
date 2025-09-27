import React, { useEffect } from 'react';
import { BusinessCard } from '@/types/BusinessCard';
import { BusinessCardItem } from '@/components/BusinessCardItem';
import { SearchFilter } from '@/components/SearchFilter';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useModal } from '@/hooks/useModal';
import { useBusinessCardFilter } from '@/hooks/useBusinessCardFilter';
import { useAppSelector, useAppDispatch } from '@/hooks';
import type { RootState } from '@/store';
import {
  fetchBusinessCards,
  deleteBusinessCard as deleteBusinessCardAction,
  clearSuccessMessage,
  clearError
} from '@/store/slices/businessCardsSlice';
import { addToast } from '@/store/slices/uiSlice';

interface BusinessCardListProps {}

export const BusinessCardList: React.FC<BusinessCardListProps> = () => {
  const dispatch = useAppDispatch();
  const {
    cards,
    loading,
    error,
    successMessage
  } = useAppSelector((state: RootState) => state.businessCards);

  // useBusinessCardFilterフックを使用して詳細フィルタリング機能を追加
  const {
    filter,
    filteredCards,
    updateFilter,
    clearFilter,
    hasActiveFilters
  } = useBusinessCardFilter(cards || []);

  const {
    isOpen: isModalOpen,
    data: businessCardToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal
  } = useModal<BusinessCard>();

  // エラーメッセージをトースト通知として表示し、状態をクリア
  useEffect(() => {
    if (error) {
      dispatch(addToast({
        message: error,
        type: 'error',
        duration: 5000
      }));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 成功メッセージをトースト通知として表示し、状態をクリア
  useEffect(() => {
    if (successMessage) {
      dispatch(addToast({
        message: successMessage,
        type: 'success',
        duration: 3000
      }));
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (cards && cards.length === 0 && !loading) {
      dispatch(fetchBusinessCards());
    }
  }, [dispatch, cards?.length, loading]);

  const handleDeleteClick = (id: number) => {
    const card = filteredCards?.find((bc: BusinessCard) => bc.id === id);
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
        await dispatch(deleteBusinessCardAction(businessCardToDelete.id)).unwrap();
        closeDeleteModal();
      } catch (error) {
        console.error('名刺の削除に失敗しました:', error);
        dispatch(addToast({
          message: '名刺の削除に失敗しました。しばらくしてからお試しください。',
          type: 'error',
          duration: 5000
        }));
        closeDeleteModal();
      }
    }
  };

  // 詳細フィルタリング機能はuseBusinessCardFilterフックで管理
  // 従来のシンプル検索機能は削除し、詳細フィルタリングに統一

  if (loading) {
    return (
      <div className="business-card-list-container">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">名刺を読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-card-list-container">
      {/* 詳細フィルタリング機能を提供するSearchFilterコンポーネント */}
      <SearchFilter
        filter={filter}
        onFilterChange={updateFilter}
        onClearFilter={clearFilter}
        hasActiveFilters={hasActiveFilters}
        totalCount={cards?.length || 0}
        filteredCount={filteredCards.length}
      />

      <div className="business-card-list">
        {!filteredCards || filteredCards.length === 0 ? (
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
            {filteredCards?.map((businessCard: BusinessCard) => (
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