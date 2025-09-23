// Redux store の設定と初期化
// 全てのSliceを統合し、ミドルウェアを設定

import { configureStore } from '@reduxjs/toolkit'
import businessCardsReducer from '@/store/slices/businessCardsSlice'
import uiReducer from '@/store/slices/uiSlice'

// Redux store の設定
export const store = configureStore({
  reducer: {
    // Business Cards関連の状態管理
    businessCards: businessCardsReducer,
    // UI関連の状態管理
    ui: uiReducer,
  },
  // 開発環境でのデバッグ支援
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 非シリアライズ可能なアクションを無視（必要に応じて設定）
        ignoredActions: [],
      },
    }),
  // Redux DevTools Extension の有効化（開発環境のみ）
  devTools: process.env.NODE_ENV !== 'production',
})

// store の型を外部で使用するためのエクスポート
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
