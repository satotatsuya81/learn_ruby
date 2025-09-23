import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// UI状態管理用のSlice
// ローディング状態、エラー状態、モーダル状態を管理

// 削除確認モーダルの状態を表す型
interface DeleteConfirmState {
  isOpen: boolean
  cardId: number | null
  cardName: string
}

// UI全体の状態を表す型
interface UiState {
  loading: boolean
  error: string | null
  deleteConfirm: DeleteConfirmState
}

// 初期状態の定義（テストの期待値と完全一致）
const initialState: UiState = {
  loading: false,
  error: null,
  deleteConfirm: {
    isOpen: false,
    cardId: null,
    cardName: ''
  }
}

// UI Slice の定義
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ローディング状態の設定
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    // エラーメッセージの設定
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    // エラー状態のクリア
    clearError: (state) => {
      state.error = null
    },
    // 削除確認モーダルの情報設定
    setDeleteConfirmModal: (state, action: PayloadAction<DeleteConfirmState>) => {
      state.deleteConfirm = action.payload
    },
    // 削除確認モーダルの情報クリア
    clearDeleteConfirmModal: (state) => {
      state.deleteConfirm = {
        isOpen: false,
        cardId: null,
        cardName: ''
      }
    },
  },
})

// アクションとリデューサーをエクスポート
export const {
  setLoading,
  setError,
  clearError,
  setDeleteConfirmModal,
  clearDeleteConfirmModal
} = uiSlice.actions

export default uiSlice.reducer