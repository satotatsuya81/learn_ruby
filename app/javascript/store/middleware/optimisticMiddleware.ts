import { Middleware } from '@reduxjs/toolkit';

// 楽観的更新ミドルウェア
// Redux Toolkitのミドルウェア仕様に従って実装
export const optimisticMiddleware: Middleware = (_storeApi) => (next) => (action) => {
  // 全てのアクションを通常通り次のミドルウェアに渡す
  // この段階では基本的な通過処理のみを実装（テストを通すための最小限）
  const result = next(action);

  // 将来的な楽観的更新ロジックのプレースホルダー
  // JIT設計: 今の段階では特別な処理は行わず、テストが通る最小限を実装

  return result;
};
