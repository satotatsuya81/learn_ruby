import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
  import { BusinessCard } from '@/types/BusinessCard'
  import { getBusinessCards, deleteBusinessCard as deleteBusinessCardApi } from '@/utils/api'

  // Business Cards の状態を管理するSlice
  // 検索・フィルタリング機能を含む最小限の状態管理を提供

  interface BusinessCardsState {
    cards: BusinessCard[]           // 全ての名刺データ
    filteredCards: BusinessCard[]   // フィルタリング後の名刺データ
    searchQuery: string             // 検索クエリ
    loading: boolean                // ローディング状態
    error: string | null            // エラーメッセージ
  }

  // 初期状態の定義（テストの期待値と完全一致）
  const initialState: BusinessCardsState = {
    cards: [],
    filteredCards: [],
    searchQuery: '',
    loading: false,
    error: null,
  }

  // 非同期アクション: 名刺データの取得
  export const fetchBusinessCards = createAsyncThunk(
    'businessCards/fetchBusinessCards',
    async () => {
      return await getBusinessCards()
    }
  )

  // 非同期アクション: 名刺の削除
  export const deleteBusinessCard = createAsyncThunk(
    'businessCards/deleteBusinessCard',
    async (id: number) => {
      await deleteBusinessCardApi(id)
      return id
    }
  )

  // フィルタリング関数: 検索クエリで名刺をフィルタリング（テスト要求のみ）
  function filterCards(cards: BusinessCard[], searchQuery: string): BusinessCard[] {
    return cards.filter(card => {
      // 検索クエリによるフィルタリング（名前または会社名）
      return searchQuery === '' ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  // Business Cards Slice の定義
  const businessCardsSlice = createSlice({
    name: 'businessCards',
    initialState,
    reducers: {
      // 検索クエリの設定（フィルタリングも同時実行）
      setSearchQuery: (state, action: PayloadAction<string>) => {
        state.searchQuery = action.payload
        state.filteredCards = filterCards(state.cards, state.searchQuery)
      },
      // エラーメッセージのクリア
      clearError: (state) => {
        state.error = null
      },
    },
    extraReducers: (builder) => {
      builder
        // 名刺取得：開始時（ローディング状態にセット）
        .addCase(fetchBusinessCards.pending, (state) => {
          state.loading = true
          state.error = null
        })
        // 名刺取得：成功時（データを状態にセット、フィルタリング実行）
        .addCase(fetchBusinessCards.fulfilled, (state, action) => {
          state.loading = false
          state.cards = action.payload
          state.filteredCards = filterCards(state.cards, state.searchQuery)
        })
        // 名刺取得：失敗時（エラーメッセージをセット）
        .addCase(fetchBusinessCards.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to fetch business cards'
        })
        // 名刺削除：成功時（該当カードを状態から削除）
        .addCase(deleteBusinessCard.fulfilled, (state, action) => {
          state.cards = state.cards.filter(card => card.id !== action.payload)
          state.filteredCards = state.filteredCards.filter(card => card.id !== action.payload)
        })
    },
  })

 // アクションとリデューサーをエクスポート
export const { setSearchQuery, clearError } = businessCardsSlice.actions
export default businessCardsSlice.reducer
