import uiReducer, {
    setLoading,
    setError,
    clearError,
    openDeleteConfirm,
    closeDeleteConfirm,
    addToast,
    removeToast,
  } from '@/store/slices/uiSlice'

  describe('UI状態管理Slice', () => {
    const initialState = {
      sidebarOpen: false,
      modalOpen: false,
      theme: 'light' as const,
      loading: false,
      error: null,
      toasts: [],
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
    // トースト通知のテスト
    describe('トースト通知の管理', () => {
      it('addToastでトースト通知を追加できること', () => {
        const toastData = {
          message: '名刺が正常に保存されました',
          type: 'success' as const,
          duration: 3000
        }
        const action = addToast(toastData)
        const state = uiReducer(initialState, action)

        expect(state.toasts).toHaveLength(1)
        expect(state.toasts[0]).toMatchObject({
          message: '名刺が正常に保存されました',
          type: 'success',
          duration: 3000
        })
        // IDが自動生成されていることを確認
        expect(state.toasts[0]).toHaveProperty('id')
        expect(typeof state.toasts[0].id).toBe('string')
      })

      it('複数のトースト通知を順次追加できること', () => {
        const firstToast = {
          message: '1つ目のメッセージ',
          type: 'info' as const
        }
        const secondToast = {
          message: '2つ目のメッセージ',
          type: 'warning' as const
        }

        let state = uiReducer(initialState, addToast(firstToast))
        state = uiReducer(state, addToast(secondToast))

        expect(state.toasts).toHaveLength(2)
        expect(state.toasts[0].message).toBe('1つ目のメッセージ')
        expect(state.toasts[1].message).toBe('2つ目のメッセージ')
      })

      it('removeToastで指定されたIDのトースト通知を削除できること', () => {
        const currentState = {
          ...initialState,
          toasts: [
            { id: 'toast-1', message: 'メッセージ1', type: 'success' as const },
            { id: 'toast-2', message: 'メッセージ2', type: 'error' as const },
            { id: 'toast-3', message: 'メッセージ3', type: 'info' as const }
          ]
        }

        const action = removeToast('toast-2')
        const state = uiReducer(currentState, action)

        expect(state.toasts).toHaveLength(2)
        expect(state.toasts.find(toast => toast.id === 'toast-2')).toBeUndefined()
        expect(state.toasts[0].id).toBe('toast-1')
        expect(state.toasts[1].id).toBe('toast-3')
      })

      it('存在しないIDでremoveToastを実行しても他のトースト通知に影響がないこと', () => {
        const currentState = {
          ...initialState,
          toasts: [
            { id: 'toast-1', message: 'メッセージ1', type: 'success' as const }
          ]
        }

        const action = removeToast('non-existent-id')
        const state = uiReducer(currentState, action)

        expect(state.toasts).toHaveLength(1)
        expect(state.toasts[0].id).toBe('toast-1')
      })
    })
  })
