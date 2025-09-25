import React, { useEffect } from 'react';
import { BusinessCard } from '@/types/BusinessCard';
import { BusinessCardItem } from '@/components/BusinessCardItem';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useModal } from '@/hooks/useModal';
import { useAppSelector, useAppDispatch } from '@/hooks';
import type { RootState } from '@/store';
import {
  fetchBusinessCards,
  deleteBusinessCard as deleteBusinessCardAction,
  setSearchQuery,
  clearSuccessMessage,
  clearError
} from '@/store/slices/businessCardsSlice';
// トースト通知のアクションをインポート
import { addToast } from '@/store/slices/uiSlice';

// Redux状態管理を使用するため、propsは不要
interface BusinessCardListProps {}

// Redux版をメインのコンポーネントとして使用
export const BusinessCardList: React.FC<BusinessCardListProps> = () => {
  // Redux状態管理を使用した実装
  const dispatch = useAppDispatch();

  const {
    cards,
    filteredCards,
    searchQuery,
    loading,
    error,
    successMessage
  } = useAppSelector((state: RootState) => state.businessCards);

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
        // エラーをトースト通知で表示（alertを削除）
        dispatch(addToast({
          message: '名刺の削除に失敗しました。しばらくしてからお試しください。',
          type: 'error',
          duration: 5000
        }));
        closeDeleteModal();
      }
    }
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleClearFilter = () => {
    dispatch(setSearchQuery(''));
  };


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
      <div className="mb-3">
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="名前や会社名で検索..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-outline-secondary"
              onClick={handleClearFilter}
              disabled={!searchQuery}
            >
              フィルターをクリア
            </button>
          </div>
        </div>
      </div>

      <div className="business-card-list">
        {/* FlashMessageコンポーネントを削除 - トースト通知に完全移行 */}

        {!filteredCards || filteredCards.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-muted">
              {searchQuery
                ? '🔍 検索条件に合う名刺が見つかりませんでした'
                : '📇 まだ名刺が登録されていません'
              }
            </div>
            {searchQuery && (
              <button
                className="btn btn-link"
                onClick={handleClearFilter}
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


