import React from 'react';
import { BusinessCard } from '../types/BusinessCard';

// BusinessCardItemコンポーネントのProps型定義
interface BusinessCardItemProps {
    businessCard: BusinessCard;
    onDelete: (id: number) => void;
}

// 個別名刺カード表示コンポーネント
export const BusinessCardItem: React.FC<BusinessCardItemProps> = ({
    businessCard,
    onDelete
}) => {
// 削除ボタンクリック時の処理
const handleDeleteClick = () => {
    onDelete(businessCard.id);
};

return (
    <div className="card mb-3">
        <div className="card-body">
            {/* 名前を表示 */}
            <h5 className="card-title">{businessCard.name}</h5>
            {/* 会社名を表示 */}
            <h6 className="card-subtitle mb-2 text-muted">{businessCard.company_name}</h6>
            {/* 役職を表示 */}
            <p className="card-text">{businessCard.job_title}</p>

            {/* 操作ボタン群 */}
            <div className="btn-group">
            <a href={`/business_cards/${businessCard.id}`} className="btn btn-primary btn-sm">
                詳細
            </a>
            <a href={`/business_cards/${businessCard.id}/edit`} className="btn btn-secondary btn-sm">
                編集
            </a>
            <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteClick}
            >
                削除
            </button>
            </div>
        </div>
    </div>
);
};
