import { useState, useCallback } from 'react';

// ジェネリック型を使用して、様々なデータ型に対応
export interface OptimisticUpdateHook<T> {
  data: T[];
  isPending: boolean;
  optimisticDelete: (id: number, deleteFn: (id: number) => Promise<boolean>) => Promise<void>;
  optimisticUpdate: (id: number, updatedItem: T, updateFn: (id: number, item: T) => Promise<T>) => Promise<void>;
}

// 基本的なアイテムの型（最低限idを持つオブジェクト）
interface BaseItem {
  id: number;
}

export function useOptimisticUpdate<T extends BaseItem>(initialData: T[]): OptimisticUpdateHook<T> {
  // 現在のデータ状態を管理
  const [data, setData] = useState<T[]>(initialData);
  // 処理中状態の管理（複数の処理が同時に実行される可能性を考慮）
  const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set());

  // 現在処理中かどうかを判定
  const isPending = pendingOperations.size > 0;

  // 楽観的削除の実装
  const optimisticDelete = useCallback(async (id: number, deleteFn: (id: number) => Promise<boolean>) => {
    const operationId = `delete-${id}-${Date.now()}`;

    // 元のデータを保存（エラー時のロールバック用）
    const originalData = [...data];

    try {
      // pending状態を開始
      setPendingOperations(prev => new Set(prev).add(operationId));

      // 楽観的更新: 即座にUIからアイテムを削除
      setData(prevData => prevData.filter(item => item.id !== id));

      // サーバー側の削除処理を実行
      await deleteFn(id);

    } catch (error) {
      // エラー発生時：元のデータに戻す（ロールバック）
      setData(originalData);
      // エラーを再スローしてコンポーネント側でハンドリングできるように
      throw error;
    } finally {
      // pending状態を終了
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [data]);

  // 楽観的更新の実装
  const optimisticUpdate = useCallback(async (id: number, updatedItem: T, updateFn: (id: number, item: T) => Promise<T>) => {
    const operationId = `update-${id}-${Date.now()}`;

    // 元のデータを保存（エラー時のロールバック用）
    const originalData = [...data];

    try {
      // pending状態を開始
      setPendingOperations(prev => new Set(prev).add(operationId));

      // 楽観的更新: 即座にUIのアイテムを更新
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? updatedItem : item
        )
      );

      // サーバー側の更新処理を実行
      const result = await updateFn(id, updatedItem);

      // サーバーからの結果でデータを最終的に更新
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? result : item
        )
      );

    } catch (error) {
      // エラー発生時：元のデータに戻す（ロールバック）
      setData(originalData);
      // エラーを再スローしてコンポーネント側でハンドリングできるように
      throw error;
    } finally {
      // pending状態を終了
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [data]);

  return {
    data,
    isPending,
    optimisticDelete,
    optimisticUpdate,
  };
}
