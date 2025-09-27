import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from '@/components/SearchFilter';
import { FilterBase } from '@/hooks/useBusinessCardFilter';

// シンプルなデバウンス機能のモック
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value: string, _delay: number) => value) // 常に即座に値を返す
}));

  const mockFilter: FilterBase = {
    name: '',
    company_name: '',
    department: '',
    job_title: ''
  };

  const mockProps = {
    filter: mockFilter,
    onFilterChange: jest.fn(),
    onClearFilter: jest.fn(),
    hasActiveFilters: false,
    totalCount: 100,
    filteredCount: 100
  };

describe('SearchFilter デバウンス統合', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('デバウンスフックが適切な遅延時間で呼び出されること', () => {
    const { useDebounce } = require('@/hooks/useDebounce');

    render(<SearchFilter {...mockProps} />);

    // 4つのフィールドそれぞれで300msのデバウンスが設定されていることを確認
    expect(useDebounce).toHaveBeenCalledWith('', 300); // name
    expect(useDebounce).toHaveBeenCalledWith('', 300); // company_name
    expect(useDebounce).toHaveBeenCalledWith('', 300); // department
    expect(useDebounce).toHaveBeenCalledWith('', 300); // job_title
  });

  it('入力値がローカル状態で管理されること', async () => {
    render(<SearchFilter {...mockProps} />);

    const nameInput = screen.getByLabelText('名前');
    const user = userEvent.setup();

    // 入力操作
    await user.type(nameInput, 'テスト');

    // 入力値が即座に反映されることを確認（デバウンス前）
    expect(nameInput).toHaveValue('テスト');
  });
});
