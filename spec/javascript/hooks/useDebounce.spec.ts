import { renderHook, act } from '@testing-library/react';
  import { useDebounce } from '@/hooks/useDebounce';

  // Jest のフェイクタイマーを使用してタイムアウト処理をテスト環境で制御
  jest.useFakeTimers();

  describe('useDebounce', () => {
    // テスト終了後にタイマーをリセット
    afterEach(() => {
      jest.clearAllTimers();
    });

    it('初期値を即座に返すこと', () => {
      // useDebounce フックを初期値 'initial' と遅延 500ms で実行
      const { result } = renderHook(() => useDebounce('initial', 500));

      // 初期値が即座に返されることを確認
      expect(result.current).toBe('initial');
    });

    it('値の変更をデバウンス処理すること', () => {
      // props を変更可能な形でフックをレンダリング
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // 初期値が返されることを確認
      expect(result.current).toBe('initial');

      // 値を変更してフックを再実行
      rerender({ value: 'changed', delay: 500 });

      // 遅延時間内はまだ古い値が返されることを確認
      expect(result.current).toBe('initial');

      // タイマーを遅延時間分進める
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // 遅延後に新しい値が返されることを確認
      expect(result.current).toBe('changed');
    });

    it('連続した値の変更では最後の値のみが適用されること', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // 短時間で連続して値を変更
      rerender({ value: 'first', delay: 500 });
      rerender({ value: 'second', delay: 500 });
      rerender({ value: 'final', delay: 500 });

      // まだ初期値のまま
      expect(result.current).toBe('initial');

      // タイマーを進める
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // 最後に設定された値が適用されることを確認（中間値は無視される）
      expect(result.current).toBe('final');
    });

    it('遅延時間が0の場合は即座に値が更新されること', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      );

      rerender({ value: 'immediate', delay: 0 });

      // 遅延0の場合は即座に更新
      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('immediate');
    });
  });
