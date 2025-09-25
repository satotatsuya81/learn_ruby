import { renderHook, act, waitFor } from '@testing-library/react';
  import { useOptimisticUpdate } from '@/hooks/useOptimisticUpdate';

  // モックデータの準備
  const mockItems = [
    { id: 1, name: '山田太郎', company: 'A会社' },
    { id: 2, name: '田中花子', company: 'B会社' },
    { id: 3, name: '佐藤次郎', company: 'C会社' }
  ];

  describe('useOptimisticUpdate', () => {
    it('初期状態では元のデータがそのまま返されること', () => {
      const { result } = renderHook(() =>
        useOptimisticUpdate(mockItems)
      );

      expect(result.current.data).toEqual(mockItems);
      expect(result.current.isPending).toBe(false);
    });

    it('楽観的削除が即座にUIに反映されること', async () => {
      const mockDeleteFn = jest.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useOptimisticUpdate(mockItems)
      );

      // 楽観的削除を実行（ID: 2の項目を削除）
      act(() => {
        result.current.optimisticDelete(2, mockDeleteFn);
      });

      // 即座にデータから削除されていることを確認
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data.find((item: any) => item.id === 2)).toBeUndefined();
      expect(result.current.isPending).toBe(true);

      // サーバー処理完了後
      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      // mockDeleteFnが正しい引数で呼び出されたことを確認
      expect(mockDeleteFn).toHaveBeenCalledWith(2);
    });

    it('サーバーエラー時にロールバックされること', async () => {
      const mockDeleteFn = jest.fn().mockRejectedValue(new Error('削除に失敗しました'));
      const { result } = renderHook(() =>
        useOptimisticUpdate(mockItems)
      );

      // 楽観的削除を実行（エラーを適切にキャッチ）
      await act(async () => {
        try {
          await result.current.optimisticDelete(2, mockDeleteFn);
        } catch (error) {
          // エラーは期待される動作なので、ここでキャッチして無視
          expect(error).toBeInstanceOf(Error);
        }
      });

      // サーバーエラー後、元の状態に戻ることを確認
      expect(result.current.data).toHaveLength(3);
      expect(result.current.data.find((item: any) => item.id === 2)).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });

    it('楽観的更新が即座にUIに反映されること', async () => {
      const updatedItem = { id: 2, name: '田中花子（更新済み）', company: 'B会社（更新）' };
      const mockUpdateFn = jest.fn().mockResolvedValue(updatedItem);

      const { result } = renderHook(() =>
        useOptimisticUpdate(mockItems)
      );

      // 楽観的更新を実行
      act(() => {
        result.current.optimisticUpdate(2, updatedItem, mockUpdateFn);
      });

      // 即座に更新されていることを確認
      const updatedData = result.current.data;
      expect(updatedData.find((item: any) => item.id === 2)).toEqual(updatedItem);
      expect(result.current.isPending).toBe(true);

      // サーバー処理完了後
      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(mockUpdateFn).toHaveBeenCalledWith(2, updatedItem);
    });

    it('同時に複数の楽観的操作を実行した場合に正しく管理されること', async () => {
      const mockDeleteFn = jest.fn().mockResolvedValue(true);
      const mockUpdateFn = jest.fn().mockResolvedValue({ id: 3, name: '佐藤次郎（更新）', company: 'C会社' });

      const { result } = renderHook(() =>
        useOptimisticUpdate(mockItems)
      );

      // 同時に削除と更新を実行
      act(() => {
        result.current.optimisticDelete(1, mockDeleteFn);
        result.current.optimisticUpdate(3, { id: 3, name: '佐藤次郎（更新）', company: 'C会社' }, mockUpdateFn);
      });

      // 両方の操作が即座に反映されていることを確認
      const updatedData = result.current.data;
      expect(updatedData).toHaveLength(2); // 1つ削除されている
      expect(updatedData.find((item: any) => item.id === 1)).toBeUndefined(); // ID:1が削除
      expect(updatedData.find((item: any) => item.id === 3)?.name).toBe('佐藤次郎（更新）'); // ID:3が更新
      expect(result.current.isPending).toBe(true);

      // 全操作完了まで待機
      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });
  });
