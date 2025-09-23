 // Business Cards Slice のテスト
  // Redux Toolkit の Slice の動作を検証する

  import businessCardsReducer, {
    setSearchQuery,
    clearError,
    fetchBusinessCards,
    deleteBusinessCard
  } from '@/store/slices/businessCardsSlice'

  describe('businessCardsSlice', () => {
    // テスト用の初期状態を定義
    const initialState = {
      cards: [],
      filteredCards: [],
      searchQuery: '',
      loading: false,
      error: null,
    }

    // テスト用のモックデータ（BusinessCard型に準拠）
    const mockCards = [
      {
        id: 1,
        name: 'John Doe',
        company_name: 'Company A',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 1
      },
      {
        id: 2,
        name: 'Jane Smith',
        company_name: 'Company B',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 1
      },
      {
        id: 3,
        name: '田中太郎',
        company_name: '株式会社C',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 1
      }
    ]

    describe('初期状態', () => {
      it('正しい初期状態を持つ', () => {
        // Redux Slice の初期状態が正しく設定されているかテスト
        const state = businessCardsReducer(undefined, { type: 'unknown' })
        expect(state).toEqual(initialState)
      })
    })

    describe('setSearchQuery アクション', () => {
      it('検索クエリを設定し、カードをフィルタリングする', () => {
        // 検索機能のテスト：「John」で検索すると1件だけ残る
        const state = {
          ...initialState,
          cards: mockCards,
          filteredCards: mockCards
        }
        const action = setSearchQuery('John')
        const newState = businessCardsReducer(state, action)

        expect(newState.searchQuery).toBe('John')
        expect(newState.filteredCards).toHaveLength(1)
        expect(newState.filteredCards[0].name).toBe('John Doe')
      })

      it('空の検索クエリで全てのカードを表示する', () => {
        // 検索クエリが空の場合、全てのカードが表示されるかテスト
        const state = {
          ...initialState,
          cards: mockCards,
          searchQuery: 'John',
          filteredCards: [mockCards[0]]
        }
        const action = setSearchQuery('')
        const newState = businessCardsReducer(state, action)

        expect(newState.searchQuery).toBe('')
        expect(newState.filteredCards).toHaveLength(3)
      })

      it('会社名でも検索できる', () => {
        // 会社名での検索機能をテスト
        const state = {
          ...initialState,
          cards: mockCards,
          filteredCards: mockCards
        }
        const action = setSearchQuery('Company B')
        const newState = businessCardsReducer(state, action)

        expect(newState.filteredCards).toHaveLength(1)
        expect(newState.filteredCards[0].company_name).toBe('Company B')
      })

      it('大文字小文字を区別しない検索', () => {
        // 大文字小文字を区別しない検索機能をテスト
        const state = {
          ...initialState,
          cards: mockCards,
          filteredCards: mockCards
        }
        const action = setSearchQuery('john')
        const newState = businessCardsReducer(state, action)

        expect(newState.filteredCards).toHaveLength(1)
        expect(newState.filteredCards[0].name).toBe('John Doe')
      })
    })

    describe('clearError アクション', () => {
      it('エラー状態をクリアする', () => {
        // エラー状態のクリア機能をテスト
        const state = {
          ...initialState,
          error: 'Some error occurred'
        }
        const action = clearError()
        const newState = businessCardsReducer(state, action)

        expect(newState.error).toBe(null)
      })
    })

    describe('fetchBusinessCards 非同期アクション', () => {
      it('pending状態でローディングを開始する', () => {
        // 非同期処理のローディング状態をテスト
        const action = { type: fetchBusinessCards.pending.type }
        const state = businessCardsReducer(initialState, action)

        expect(state.loading).toBe(true)
        expect(state.error).toBe(null)
      })

      it('fulfilled状態でデータを設定する', () => {
        // 非同期処理の成功時の状態をテスト
        const action = {
          type: fetchBusinessCards.fulfilled.type,
          payload: mockCards
        }
        const state = businessCardsReducer(
          { ...initialState, loading: true },
          action
        )

        expect(state.loading).toBe(false)
        expect(state.cards).toEqual(mockCards)
        expect(state.filteredCards).toEqual(mockCards)
      })

      it('rejected状態でエラーを設定する', () => {
        // 非同期処理の失敗時の状態をテスト
        const action = {
          type: fetchBusinessCards.rejected.type,
          error: { message: 'Network error' }
        }
        const state = businessCardsReducer(
          { ...initialState, loading: true },
          action
        )

        expect(state.loading).toBe(false)
        expect(state.error).toBe('Network error')
      })
    })

    describe('deleteBusinessCard 非同期アクション', () => {
      it('fulfilled状態で指定されたカードを削除する', () => {
        // 削除機能のテスト
        const state = {
          ...initialState,
          cards: mockCards,
          filteredCards: mockCards
        }
        const action = {
          type: deleteBusinessCard.fulfilled.type,
          payload: 1 // ID: 1 のカードを削除
        }
        const newState = businessCardsReducer(state, action)

        expect(newState.cards).toHaveLength(2)
        expect(newState.filteredCards).toHaveLength(2)
        expect(newState.cards.find((card: any) => card.id === 1)).toBeUndefined()
      })
    })
  })
