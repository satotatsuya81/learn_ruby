import { useState, useCallback, useMemo } from 'react';
import { BusinessCard } from '../types/BusinessCard';

export interface FilterBase {
  name: string;
  company_name: string;
  department: string;
  job_title: string;
}

export interface UseBusinessCardFilterResult {
  filter: FilterBase;
  filteredCards: BusinessCard[];
  updateFilter: <K extends keyof FilterBase>(key: K, value: FilterBase[K]) => void;
  clearFilter: () => void;
  hasActiveFilters: boolean;
}

/**
 * 動的プロパティ管理パターン
 * 記事で言及されている動的フィルタリング機能
 */
export const useBusinessCardFilter = (
  businessCards: BusinessCard[]
): UseBusinessCardFilterResult => {
  const [filter, setFilter] = useState<FilterBase>({
    name: '',
    company_name: '',
    department: '',
    job_title: ''
  });

  // Eight記事の動的プロパティ管理パターン
  const updateFilter = useCallback(<K extends keyof FilterBase>(
    key: K,
    value: FilterBase[K]
  ) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilter({
      name: '',
      company_name: '',
      department: '',
      job_title: ''
    });
  }, []);

  // フィルタリング処理 (パフォーマンス重視でuseMemo使用)
  const filteredCards = useMemo(() => {
    return businessCards.filter(card => {
      const nameMatch = !filter.name ||
        card.name.toLowerCase().includes(filter.name.toLowerCase());

      const companyMatch = !filter.company_name ||
        card.company_name.toLowerCase().includes(filter.company_name.toLowerCase());

      const departmentMatch = !filter.department ||
        (card.department !== null && card.department !== undefined && card.department.toLowerCase().includes(filter.department.toLowerCase()));

      const jobTitleMatch = !filter.job_title ||
        (card.job_title !== null && card.job_title !== undefined && card.job_title.toLowerCase().includes(filter.job_title.toLowerCase()));

      return nameMatch && companyMatch && departmentMatch && jobTitleMatch;
    });
  }, [businessCards, filter]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filter).some((value: string) => value.trim() !== '');
  }, [filter]);

  return {
    filter,
    filteredCards,
    updateFilter,
    clearFilter,
    hasActiveFilters
  };
};
