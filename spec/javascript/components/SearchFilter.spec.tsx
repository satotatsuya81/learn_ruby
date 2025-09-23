import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from '@/components/SearchFilter';
import { FilterBase } from '@/hooks/useBusinessCardFilter';

describe('SearchFilter', () => {
  const mockFilter: FilterBase = {
    name: '',
    company_name: '',
    department: '',
    job_title: ''
  };

  const mockOnFilterChange = jest.fn();
  const mockOnClearFilter = jest.fn();

  const defaultProps = {
    filter: mockFilter,
    onFilterChange: mockOnFilterChange,
    onClearFilter: mockOnClearFilter,
    hasActiveFilters: false,
    totalCount: 10,
    filteredCount: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示内容', () => {
    it('フィルターコンポーネントが表示される', () => {
      render(<SearchFilter {...defaultProps} />);

      expect(screen.getByText('🔍 名刺検索')).toBeInTheDocument();
    });

    it('全ての入力フィールドが表示される', () => {
      render(<SearchFilter {...defaultProps} />);

      expect(screen.getByLabelText('名前')).toBeInTheDocument();
      expect(screen.getByLabelText('会社名')).toBeInTheDocument();
      expect(screen.getByLabelText('部署')).toBeInTheDocument();
      expect(screen.getByLabelText('役職')).toBeInTheDocument();
    });

    it('フィルター適用時にクリアボタンとバッジが表示される', () => {
      render(<SearchFilter {...defaultProps} hasActiveFilters={true} />);

      expect(screen.getByRole('button', { name: /フィルターをクリア/ })).toBeInTheDocument();
      expect(screen.getByText('フィルター適用中')).toBeInTheDocument();
    });

    it('件数表示が正しく動作する', () => {
      render(<SearchFilter {...defaultProps} totalCount={20} filteredCount={5} hasActiveFilters={true} />);

      expect(screen.getByText('5件 / 20件中')).toBeInTheDocument();
    });
  });

  describe('フィルター操作', () => {
    it('名前フィルターの入力でonFilterChangeが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);

      const nameInput = screen.getByLabelText('名前');
      await user.clear(nameInput);
      await user.type(nameInput, '田中');

      // 2回呼ばれ、最後が完全な文字列であることを確認
      expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, 'name', '田');
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'name', '中');
    });

    it('会社名フィルターの入力でonFilterChangeが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);

      const companyInput = screen.getByLabelText('会社名');
      await user.clear(companyInput);
      await user.type(companyInput, '株式会社');

      // 4回呼ばれることを確認（各文字ごと）
      expect(mockOnFilterChange).toHaveBeenCalledTimes(4);
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(4, 'company_name', '社');
    });

    it('クリアボタンでonClearFilterが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} hasActiveFilters={true} />);

      const clearButton = screen.getByRole('button', { name: /フィルターをクリア/ });
      await user.click(clearButton);

      expect(mockOnClearFilter).toHaveBeenCalled();
    });
  });

  describe('動的プロパティ管理', () => {
    it('部署フィルターで動的プロパティ更新が動作する', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);

      const departmentInput = screen.getByLabelText('部署');
      await user.clear(departmentInput);
      await user.type(departmentInput, '営業部');

      // 3回呼ばれることを確認（各文字ごと）
      expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, 'department', '部');
    });

    it('役職フィルターで動的プロパティ更新が動作する', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);

      const jobTitleInput = screen.getByLabelText('役職');
      await user.clear(jobTitleInput);
      await user.type(jobTitleInput, '部長');

      // 2回呼ばれることを確認（各文字ごと）
      expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'job_title', '長');
    });
  });
});
