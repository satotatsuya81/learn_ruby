import React from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterBase, UseBusinessCardFilterResult } from '@/hooks/useBusinessCardFilter';

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
 * デバウンス機能により、連続入力時のパフォーマンスを最適化
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  filter,
  onFilterChange,
  onClearFilter,
  hasActiveFilters,
  totalCount,
  filteredCount
}) => {
  // 内部状態で入力値を管理（単一のオブジェクトで管理）
  const [localFilter, setLocalFilter] = React.useState<FilterBase>(filter);

  // 各フィールドにデバウンス機能を適用（300ms遅延）
  const debouncedFilter = {
    name: useDebounce(localFilter.name, 300),
    company_name: useDebounce(localFilter.company_name, 300),
    department: useDebounce(localFilter.department, 300),
    job_title: useDebounce(localFilter.job_title, 300)
  };

  // 前回のデバウンス値を記録（初回実行防止用）
  const prevDebouncedRef = React.useRef(debouncedFilter);

  // デバウンスされたフィルターが変更された時のハンドラー（単一のuseEffect）
  React.useEffect(() => {
    const prev = prevDebouncedRef.current;

    // 各フィールドの変更をチェックして、変更されたもののみonFilterChangeを呼ぶ
    if (prev.name !== debouncedFilter.name) {
      onFilterChange('name', debouncedFilter.name);
    }
    if (prev.company_name !== debouncedFilter.company_name) {
      onFilterChange('company_name', debouncedFilter.company_name);
    }
    if (prev.department !== debouncedFilter.department) {
      onFilterChange('department', debouncedFilter.department);
    }
    if (prev.job_title !== debouncedFilter.job_title) {
      onFilterChange('job_title', debouncedFilter.job_title);
    }

    // 現在の値を保存
    prevDebouncedRef.current = debouncedFilter;
  }, [debouncedFilter, onFilterChange]);

  // 外部からの変更を同期（単一のuseEffect）
  React.useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  // 入力フィールドの値更新ハンドラー
  const handleInputChange = React.useCallback((field: keyof FilterBase, value: string) => {
    setLocalFilter(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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
                value={localFilter.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="company-filter" className="form-label">会社名</label>
              <input
                type="text"
                className="form-control"
                id="company-filter"
                placeholder="例: 株式会社"
                value={localFilter.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="department-filter" className="form-label">部署</label>
              <input
                type="text"
                className="form-control"
                id="department-filter"
                placeholder="例: 営業部"
                value={localFilter.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="job-title-filter" className="form-label">役職</label>
              <input
                type="text"
                className="form-control"
                id="job-title-filter"
                placeholder="例: 部長"
                value={localFilter.job_title}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
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
