import { renderHook, act, waitFor } from '@testing-library/react';
import { useOptimisticUpdate } from '@/hooks/useOptimisticUpdate';

// モックデータの準備
const mockItems = [
  { id: 1, name: '山田太郎', company: 'A会社' },
  { id: 2, name: '田中花子', company: 'B会社' },
  { id: 3, name: '佐藤次郎', company: 'C会社' }
];

describe('useOptimisticUpdate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('基本機能テスト', () => {
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

  describe('失敗ケーステスト', () => {
    describe('楽観的削除の失敗ケース', () => {
      it('API削除失敗時にデータがロールバックされること', async () => {
        const errorMessage = 'サーバーエラー: 削除に失敗しました';
        const mockDeleteFn = jest.fn().mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        // 削除前の状態を確認
        expect(result.current.data).toHaveLength(3);
        expect(result.current.data.find(item => item.id === 2)).toBeDefined();

        let caughtError: Error | null = null;

        // 楽観的削除を実行（エラーが発生）
        await act(async () => {
          try {
            await result.current.optimisticDelete(2, mockDeleteFn);
          } catch (error) {
            caughtError = error as Error;
          }
        });

        // エラーが正しく再スローされること
        expect(caughtError).toBeInstanceOf(Error);
        expect(caughtError!.message).toBe(errorMessage);

        // データが元の状態にロールバックされること
        expect(result.current.data).toHaveLength(3);
        expect(result.current.data.find(item => item.id === 2)).toBeDefined();
        expect(result.current.isPending).toBe(false);

        // APIが正しく呼ばれたこと
        expect(mockDeleteFn).toHaveBeenCalledWith(2);
      });

      it('ネットワーク分断時のエラーハンドリング', async () => {
        const networkError = new Error('Network Error');
        networkError.name = 'NetworkError';
        const mockDeleteFn = jest.fn().mockRejectedValue(networkError);

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let caughtError: Error | null = null;

        await act(async () => {
          try {
            await result.current.optimisticDelete(1, mockDeleteFn);
          } catch (error) {
            caughtError = error as Error;
          }
        });

        // ネットワークエラーが正しく処理されること
        expect(caughtError!.name).toBe('NetworkError');

        // データがロールバックされること
        expect(result.current.data).toEqual(mockItems);
        expect(result.current.isPending).toBe(false);
      });

      it('タイムアウト時のロールバック処理', async () => {
        const timeoutError = new Error('Request timeout');
        timeoutError.name = 'TimeoutError';
        const mockDeleteFn = jest.fn().mockRejectedValue(timeoutError);

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let caughtError: Error | null = null;

        await act(async () => {
          try {
            await result.current.optimisticDelete(3, mockDeleteFn);
          } catch (error) {
            caughtError = error as Error;
          }
        });

        // タイムアウトエラーが正しく処理されること
        expect(caughtError!.name).toBe('TimeoutError');

        // 元のデータが保持されること
        expect(result.current.data).toEqual(mockItems);
        expect(result.current.isPending).toBe(false);
      });
    });

    describe('楽観的更新の失敗ケース', () => {
      it('API更新失敗時にデータがロールバックされること', async () => {
        const errorMessage = 'バリデーションエラー: 名前は必須です';
        const mockUpdateFn = jest.fn().mockRejectedValue(new Error(errorMessage));
        const updatedItem = { id: 2, name: '', company: 'B会社（更新）' };

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let caughtError: Error | null = null;

        // 楽観的更新を実行（エラーが発生）
        await act(async () => {
          try {
            await result.current.optimisticUpdate(2, updatedItem, mockUpdateFn);
          } catch (error) {
            caughtError = error as Error;
          }
        });

        // エラーが正しく再スローされること
        expect(caughtError).toBeInstanceOf(Error);
        expect(caughtError!.message).toBe(errorMessage);

        // データが元の状態にロールバックされること
        expect(result.current.data).toEqual(mockItems);
        expect(result.current.isPending).toBe(false);

        // APIが正しく呼ばれたこと
        expect(mockUpdateFn).toHaveBeenCalledWith(2, updatedItem);
      });

      it('サーバー側バリデーションエラー時の処理', async () => {
        const validationError = new Error('Validation failed: Email format is invalid');
        validationError.name = 'ValidationError';
        const mockUpdateFn = jest.fn().mockRejectedValue(validationError);
        const invalidItem = { id: 1, name: '山田太郎', company: 'A会社', email: 'invalid-email' };

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let caughtError: Error | null = null;

        await act(async () => {
          try {
            await result.current.optimisticUpdate(1, invalidItem, mockUpdateFn);
          } catch (error) {
            caughtError = error as Error;
          }
        });

        // バリデーションエラーが正しく処理されること
        expect(caughtError!.name).toBe('ValidationError');

        // 元のデータが復元されること
        expect(result.current.data).toEqual(mockItems);
        expect(result.current.isPending).toBe(false);
      });

      it('部分的な更新失敗の処理', async () => {
        const partialUpdateError = new Error('Partial update failed: Company not found');
        const mockUpdateFn = jest.fn().mockRejectedValue(partialUpdateError);
        const updatedItem = { id: 3, name: '佐藤次郎（更新）', company: '存在しない会社' };

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let caughtError: Error | null = null;

        await act(async () => {
          try {
            await result.current.optimisticUpdate(3, updatedItem, mockUpdateFn);
          } catch (error) {
            caughtError = error as Error;
          }
        });

        // エラーが正しく処理されること
        expect(caughtError!.message).toContain('Partial update failed');

        // 変更が元に戻されること
        expect(result.current.data.find(item => item.id === 3)).toEqual(mockItems[2]);
        expect(result.current.isPending).toBe(false);
      });
    });

    describe('競合する更新操作の処理', () => {
      it('同一アイテムに対する競合操作時の処理', async () => {
        const firstUpdateError = new Error('First update failed');
        const secondUpdateSuccess = { id: 2, name: '田中花子（第二更新）', company: 'B会社' };

        const mockUpdateFn1 = jest.fn().mockRejectedValue(firstUpdateError);
        const mockUpdateFn2 = jest.fn().mockResolvedValue(secondUpdateSuccess);

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        const firstUpdate = { id: 2, name: '田中花子（第一更新）', company: 'B会社' };
        const secondUpdate = { id: 2, name: '田中花子（第二更新）', company: 'B会社' };

        let firstError: Error | null = null;

        // 同時に2つの更新を実行
        await act(async () => {
          const promises = [
            result.current.optimisticUpdate(2, firstUpdate, mockUpdateFn1).catch(error => {
              firstError = error;
            }),
            result.current.optimisticUpdate(2, secondUpdate, mockUpdateFn2)
          ];

          await Promise.allSettled(promises);
        });

        // 第一更新がエラーで失敗したこと
        expect(firstError).toBeInstanceOf(Error);

        // 最終的な状態確認（競合処理後）
        expect(result.current.isPending).toBe(false);

        // 両方のAPIが呼ばれたこと
        expect(mockUpdateFn1).toHaveBeenCalled();
        expect(mockUpdateFn2).toHaveBeenCalled();
      });

      it('削除と更新の競合操作時の処理', async () => {
        const deleteError = new Error('Delete operation failed');
        const updateSuccess = { id: 1, name: '山田太郎（更新）', company: 'A会社' };

        const mockDeleteFn = jest.fn().mockRejectedValue(deleteError);
        const mockUpdateFn = jest.fn().mockResolvedValue(updateSuccess);

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let deleteError_caught: Error | null = null;

        // 同一アイテムに対して削除と更新を同時実行
        await act(async () => {
          const promises = [
            result.current.optimisticDelete(1, mockDeleteFn).catch(error => {
              deleteError_caught = error;
            }),
            result.current.optimisticUpdate(1, updateSuccess, mockUpdateFn)
          ];

          await Promise.allSettled(promises);
        });

        // 削除がエラーで失敗したこと
        expect(deleteError_caught).toBeInstanceOf(Error);

        // 最終的な状態確認
        expect(result.current.isPending).toBe(false);
      });
    });

    describe('エラー状態通知', () => {
      it('複数の失敗操作後もpending状態が正しく管理されること', async () => {
        const error1 = new Error('First operation failed');
        const error2 = new Error('Second operation failed');

        const mockDeleteFn1 = jest.fn().mockRejectedValue(error1);
        const mockDeleteFn2 = jest.fn().mockRejectedValue(error2);

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let errors: Error[] = [];

        // 複数の失敗操作を同時実行
        await act(async () => {
          const promises = [
            result.current.optimisticDelete(1, mockDeleteFn1).catch(error => {
              errors.push(error);
            }),
            result.current.optimisticDelete(2, mockDeleteFn2).catch(error => {
              errors.push(error);
            })
          ];

          await Promise.allSettled(promises);
        });

        // 両方のエラーがキャッチされること
        expect(errors).toHaveLength(2);
        expect(errors[0].message).toBe('First operation failed');
        expect(errors[1].message).toBe('Second operation failed');

        // pending状態が正しく終了すること
        expect(result.current.isPending).toBe(false);

        // データが元の状態に戻ること
        expect(result.current.data).toEqual(mockItems);
      });

      it('成功と失敗が混在する場合の状態管理', async () => {
        const deleteError = new Error('Delete failed');
        const updateSuccess = { id: 3, name: '佐藤次郎（成功更新）', company: 'C会社' };

        const mockDeleteFn = jest.fn().mockRejectedValue(deleteError);
        const mockUpdateFn = jest.fn().mockResolvedValue(updateSuccess);

        const { result } = renderHook(() =>
          useOptimisticUpdate(mockItems)
        );

        let deleteError_caught: Error | null = null;

        // 失敗する削除と成功する更新を同時実行
        await act(async () => {
          const promises = [
            result.current.optimisticDelete(1, mockDeleteFn).catch(error => {
              deleteError_caught = error;
            }),
            result.current.optimisticUpdate(3, updateSuccess, mockUpdateFn)
          ];

          await Promise.allSettled(promises);
        });

        // 削除は失敗したが更新は成功したこと
        expect(deleteError_caught).toBeInstanceOf(Error);

        // pending状態が正しく終了すること
        expect(result.current.isPending).toBe(false);

        // 削除は元に戻り、更新は反映されること
        expect(result.current.data.find(item => item.id === 1)).toBeDefined(); // 削除失敗でロールバック
        expect(result.current.data.find(item => item.id === 3)).toEqual(updateSuccess); // 更新成功
      });
    });
  });
});
