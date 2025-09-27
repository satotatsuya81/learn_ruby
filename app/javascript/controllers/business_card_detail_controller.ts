import { Controller } from "@hotwired/stimulus";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { BusinessCardDetail } from "@/components/BusinessCardDetail";
import { SimilarCards } from "@/components/SimilarCards";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BusinessCard } from "@/types/BusinessCard";

export default class extends Controller {
  static values = {
    card: Object,
    similarCards: Array
  };

  declare readonly cardValue: BusinessCard;
  declare readonly similarCardsValue: BusinessCard[];
  private root?: Root;

  connect(): void {
    console.log("BusinessCardDetailController connected");
    this.showLoadingSpinner();
    this.render();
  }

  disconnect(): void {
    if (this.root) {
      this.root.unmount();
    }
  }

  render(): void {
    const businessCard = this.cardValue;
    const similarCards = this.similarCardsValue;

    const handleEdit = (id: number): void => {
      window.location.href = `/business_cards/${id}/edit`;
    };

    const handleDelete = async (id: number): Promise<void> => {
      if (confirm(`${businessCard.name}を削除してもよろしいですか？`)) {
        try {
          const { deleteBusinessCard } = await import('@/utils/api');
          await deleteBusinessCard(id);
          window.location.href = '/business_cards';
        } catch (error) {
          console.error('Error:', error);
          alert('削除に失敗しました');
        }
      }
    };

    // コンテナをクリア
    this.element.innerHTML = '';

    // Reactコンポーネントをレンダー（ErrorBoundaryでラップ）
    this.root = createRoot(this.element);
    this.root.render(
      React.createElement(ErrorBoundary, {
        children: React.createElement('div', null,
          React.createElement(BusinessCardDetail, {
            businessCard,
            onEdit: handleEdit,
            onDelete: handleDelete
          }),
          React.createElement(SimilarCards, {
            similarCards,
            currentCardId: businessCard.id
          })
        )
      })
    );
  }

  // ローディングスピナーを表示
  private showLoadingSpinner(): void {
    const loadingContainer = document.getElementById('business-card-detail-loading');
    if (loadingContainer) {
      const spinnerRoot = createRoot(loadingContainer);
      spinnerRoot.render(
        React.createElement(LoadingSpinner, {
          message: '名刺詳細を読み込み中...',
          centered: true
        })
      );
    }
  }
}
