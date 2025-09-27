import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// トーストメッセージの型定義
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// UI状態の型定義を拡張（テストで期待されるプロパティを追加）
interface UiState {
  sidebarOpen: boolean      // サイドバーの開閉状態
  modalOpen: boolean        // モーダルの開閉状態
  theme: 'light' | 'dark'   // テーマ設定
  loading: boolean
  toasts: ToastMessage[];
  error: string | null
  deleteConfirm: {
    isOpen: boolean
    cardId: number | null
    cardName: string
  }
}

const initialState: UiState = {
  sidebarOpen: false,    // 初期状態: サイドバーは閉じている
  modalOpen: false,      // 初期状態: モーダルは閉じている
  theme: 'light',        // 初期状態: ライトテーマ
  loading: false,
  toasts: [],
  error: null,
  deleteConfirm: {
    isOpen: false,
    cardId: null,
    cardName: ''
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // サイドバーの開閉を切り替える
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    // サイドバーを開く
    openSidebar: (state) => {
      state.sidebarOpen = true
    },
    // サイドバーを閉じる
    closeSidebar: (state) => {
      state.sidebarOpen = false
    },
    // モーダルの開閉を切り替える
    toggleModal: (state) => {
      state.modalOpen = !state.modalOpen
    },
    // モーダルを開く
    openModal: (state) => {
      state.modalOpen = true
    },
    // モーダルを閉じる
    closeModal: (state) => {
      state.modalOpen = false
    },
    // テーマを切り替える
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    // ローディング状態を設定
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    // エラーを設定
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    // エラーをクリア
    clearError: (state) => {
      state.error = null
    },
    // 削除確認ダイアログを開く
    openDeleteConfirm: (state, action: PayloadAction<{ cardId: number; cardName: string }>) => {
      state.deleteConfirm = {
        isOpen: true,
        cardId: action.payload.cardId,
        cardName: action.payload.cardName
      }
    },
    // 削除確認ダイアログを閉じる
    closeDeleteConfirm: (state) => {
      state.deleteConfirm = {
        isOpen: false,
        cardId: null,
        cardName: ''
      }
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const toast: ToastMessage = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast: ToastMessage) => toast.id !== action.payload);
    },
  },
})

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleModal,
  openModal,
  closeModal,
  setTheme,
  setLoading,
  setError,
  clearError,
  openDeleteConfirm,
  closeDeleteConfirm,
  addToast,
  removeToast,
} = uiSlice.actions

export default uiSlice.reducer
