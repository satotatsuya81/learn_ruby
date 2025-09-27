  import { render, screen, waitFor } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { SearchInput } from '@/components/SearchInput';

  // モックタイマーを使用してデバウンス処理をテスト
  jest.useFakeTimers();

  describe('SearchInput', () => {
    // デバウンス処理のテスト - 連続入力時に最後の値のみ処理される
    it('debounces search input and calls onSearch with the latest value', async () => {
      const mockOnSearch = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <SearchInput
          value=""
          onSearch={mockOnSearch}
          placeholder="名刺を検索..."
          debounceMs={300}
        />
      );

      const input = screen.getByPlaceholderText('名刺を検索...');

      // 連続して文字を入力（実際のユーザータイピングを模擬）
      await user.type(input, 'テスト');

      // デバウンス時間経過前は呼び出されない
      expect(mockOnSearch).not.toHaveBeenCalled();

      // デバウンス時間を進める
      jest.advanceTimersByTime(300);

      // デバウンス完了後に最終的な値で呼び出される
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('テスト');
      });
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    // 即座に検索をリセットできることをテスト
    it('clears search immediately when clear button is clicked', async () => {
      // このテストではリアルタイマーを使用
      jest.useRealTimers();

      const mockOnSearch = jest.fn();
      const user = userEvent.setup();

      render(
        <SearchInput
          value="既存の検索語"
          onSearch={mockOnSearch}
          showClearButton={true}
        />
      );

      const clearButton = screen.getByRole('button', { name: /クリア|clear/i });
      await user.click(clearButton);

      // クリア操作は即座に実行される（デバウンスなし）
      expect(mockOnSearch).toHaveBeenCalledWith('');

      // フェイクタイマーに戻す
      jest.useFakeTimers();
    });

    // アクセシビリティ要件のテスト
    it('provides proper accessibility attributes', () => {
      render(
        <SearchInput
          value=""
          onSearch={jest.fn()}
          placeholder="名刺を検索..."
          aria-label="名刺検索入力"
        />
      );

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', '名刺検索入力');
      expect(input).toHaveAttribute('type', 'search');
    });
  });
