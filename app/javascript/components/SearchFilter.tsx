import React from 'react';
import { FilterBase, UseBusinessCardFilterResult } from '../hooks/useBusinessCardFilter';

interface SearchFilterProps {
  filter: FilterBase;
  onFilterChange: UseBusinessCardFilterResult['updateFilter'];
  onClearFilter: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  filteredCount: number;
}

/**
 * Filter系コンポーネント
 * 動的プロパティ管理パターンを活用した検索フィルター
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  filter,
  onFilterChange,
  onClearFilter,
  hasActiveFilters,
  totalCount,
  filteredCount
}) => {
  return (
    <div className="search-filter-container mb-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🔍 名刺検索</h5>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onClearFilter}
            >
              フィルターをクリア
            </button>
          )}
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name-filter" className="form-label">名前</label>
              <input
                type="text"
                className="form-control"
                id="name-filter"
                placeholder="例: 田中"
                value={filter.name}
                onChange={(e) => onFilterChange('name', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="company-filter" className="form-label">会社名</label>
              <input
                type="text"
                className="form-control"
                id="company-filter"
                placeholder="例: 株式会社"
                value={filter.company_name}
                onChange={(e) => onFilterChange('company_name', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="department-filter" className="form-label">部署</label>
              <input
                type="text"
                className="form-control"
                id="department-filter"
                placeholder="例: 営業部"
                value={filter.department}
                onChange={(e) => onFilterChange('department', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="job-title-filter" className="form-label">役職</label>
              <input
                type="text"
                className="form-control"
                id="job-title-filter"
                placeholder="例: 部長"
                value={filter.job_title}
                onChange={(e) => onFilterChange('job_title', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-between align-items-center">
            <div className="text-muted">
              <small>
                {hasActiveFilters
                  ? `${filteredCount}件 / ${totalCount}件中`
                  : `${totalCount}件`
                }
              </small>
            </div>
            {hasActiveFilters && (
              <div className="badge bg-primary">
                フィルター適用中
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
