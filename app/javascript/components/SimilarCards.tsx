import React from 'react';
import { BusinessCard } from '@/types/BusinessCard';

interface SimilarCardsProps {
  similarCards: BusinessCard[];
  currentCardId: number;
}

export const SimilarCards: React.FC<SimilarCardsProps> = ({
  similarCards,
  currentCardId
}) => {
  // 現在の名刺IDを除外してフィルタリング
  const filteredCards = similarCards.filter(card => card.id !== currentCardId);

  // 類似名刺がない場合は何も表示しない
  if (filteredCards.length === 0) {
    return null;
  }

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5>類似名刺</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {filteredCards.map(card => (
            <div key={card.id} className="col-md-4 mb-2">
              <a
                href={`/business_cards/${card.id}`}
                className="text-decoration-none"
              >
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">{card.name}</h6>
                    <p className="card-subtitle mb-2 text-muted">{card.company_name}</p>
                    {card.job_title && (
                      <p className="card-text small">{card.job_title}</p>
                    )}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
