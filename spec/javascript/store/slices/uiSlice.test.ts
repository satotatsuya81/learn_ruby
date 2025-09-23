import uiReducer, {
    setLoading,
    setError,
    clearError,
    openDeleteConfirm,
    closeDeleteConfirm
  } from '@/store/slices/uiSlice'

  describe('UI状態管理Slice', () => {
    const initialState = {
      sidebarOpen: false,
      modalOpen: false,
      theme: 'light' as const,
      loading: false,
      error: null,
      deleteConfirm: {
        isOpen: false,
        cardId: null,
        cardName: ''
      }
    }

    // ローディング状態のテスト
    describe('ローディング状態の管理', () => {
      it('setLoadingでtrueを渡すとローディング状態がtrueになること', () => {
        const action = setLoading(true)
        const state = uiReducer(initialState, action)

        expect(state.loading).toBe(true)
      })

      it('setLoadingでfalseを渡すとローディング状態がfalseになること', () => {
        const currentState = { ...initialState, loading: true }
        const action = setLoading(false)
        const state = uiReducer(currentState, action)

        expect(state.loading).toBe(false)
      })
    })

    // エラー状態のテスト
    describe('エラー状態の管理', () => {
      it('setErrorでエラーメッセージを設定できること', () => {
        const errorMessage = '何かエラーが発生しました'
        const action = setError(errorMessage)
        const state = uiReducer(initialState, action)

        expect(state.error).toBe(errorMessage)
      })

      it('clearErrorでエラー状態をクリアできること', () => {
        const currentState = { ...initialState, error: '前回のエラー' }
        const action = clearError()
        const state = uiReducer(currentState, action)

        expect(state.error).toBe(null)
      })
    })

    // 削除確認モーダルのテスト
    describe('削除確認モーダルの管理', () => {
      it('openDeleteConfirmで削除確認モーダルの情報を設定できること', () => {
        const modalData = {
          cardId: 123,
          cardName: '山田太郎'
        }
        const action = openDeleteConfirm(modalData)
        const state = uiReducer(initialState, action)

        expect(state.deleteConfirm.isOpen).toBe(true)
        expect(state.deleteConfirm.cardId).toBe(123)
        expect(state.deleteConfirm.cardName).toBe('山田太郎')
      })

      it('closeDeleteConfirmで削除確認モーダルの情報をクリアできること', () => {
        const currentState = {
          ...initialState,
          deleteConfirm: {
            isOpen: true,
            cardId: 123,
            cardName: '山田太郎'
          }
        }
        const action = closeDeleteConfirm()
        const state = uiReducer(currentState, action)

        expect(state.deleteConfirm.isOpen).toBe(false)
        expect(state.deleteConfirm.cardId).toBe(null)
        expect(state.deleteConfirm.cardName).toBe('')
      })
    })
  })
