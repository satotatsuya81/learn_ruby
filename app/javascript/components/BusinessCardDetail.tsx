import React from 'react';
import { BusinessCard } from '@/types/BusinessCard';

interface BusinessCardDetailProps {
  businessCard: BusinessCard;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const BusinessCardDetail: React.FC<BusinessCardDetailProps> = ({
  businessCard,
  onEdit,
  onDelete
}) => {
  const handleEditClick = () => {
    onEdit(businessCard.id);
  };

  const handleDeleteClick = () => {
    onDelete(businessCard.id);
  };

  const handleBackToList = () => {
    window.location.href = '/business_cards';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1>{businessCard.name}</h1>
      </div>
      <div className="card-body">
        <h5 className="text-primary">{businessCard.company_name}</h5>

        {businessCard.job_title && (
          <p><strong>役職:</strong> {businessCard.job_title}</p>
        )}

        {businessCard.department && (
          <p><strong>部署:</strong> {businessCard.department}</p>
        )}

        {businessCard.email && (
          <p><strong>メールアドレス:</strong> {businessCard.email}</p>
        )}

        {businessCard.phone && (
          <p><strong>電話番号:</strong> {businessCard.phone}</p>
        )}

        {businessCard.mobile && (
          <p><strong>携帯電話:</strong> {businessCard.mobile}</p>
        )}

        {businessCard.website && (
          <p><strong>ウェブサイト:</strong> {businessCard.website}</p>
        )}

        {businessCard.address && (
          <p><strong>住所:</strong><br />{businessCard.address}</p>
        )}

        {businessCard.notes && (
          <p><strong>メモ:</strong><br />{businessCard.notes}</p>
        )}
      </div>
      <div className="card-footer d-flex justify-content-between">
        <div>
          <button
            className="btn btn-secondary"
            onClick={handleBackToList}
          >
            名刺一覧に戻る
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={handleEditClick}
          >
            編集
          </button>
          <button
            className="btn btn-danger ms-2"
            onClick={handleDeleteClick}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};
