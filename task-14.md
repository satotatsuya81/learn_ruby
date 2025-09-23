# タスク 14 実装ロードマップ

## タスク概要
- **タスク番号**: 14
- **タイトル**: Redux状態管理の導入
- **ブランチ名**: feature/14-redux-state-management
- **フェーズ**: フェーズ3.5（フロントエンド技術スタック近代化）
- **優先度**: 高

## 関連要件
- **要件番号**: Requirement 12
- **User Story**: ユーザーとして、より高速で直感的な操作性を持つモダンなWebアプリケーション体験を得たい
- **主要な受け入れ基準**:
  - ユーザーが複数の画面間を移動する際、システムはReduxによる一貫した状態管理で滑らかな操作体験を提供する
  - 検索・フィルタリング操作をページリロードなしに即座に結果を更新表示する
  - TypeScriptの型安全性により実行時エラーを事前に防止できる

## 作成・修正ファイル一覧
### 新規作成ファイル
- `app/javascript/store/index.ts` - Redux store の設定と初期化
- `app/javascript/store/slices/businessCardsSlice.ts` - Business Cards用のSliceとAction
- `app/javascript/store/slices/uiSlice.ts` - UI状態管理用のSlice
- `app/javascript/hooks/useAppDispatch.ts` - 型安全なdispatchフック
- `app/javascript/hooks/useAppSelector.ts` - 型安全なselectorフック
- `app/javascript/types/store.ts` - Redux store の型定義
- `app/javascript/types/businessCard.ts` - Business Card関連の型定義
- `app/javascript/utils/api.ts` - API通信用のユーティリティ

### 修正ファイル
- `package.json` - Redux Toolkit関連の依存関係追加
- `app/javascript/application.js` - Redux Provider の設定
- `app/javascript/components/BusinessCardList.tsx` - Redux状態管理との連携
- `app/javascript/components/BusinessCardItem.tsx` - Redux actionsとの連携
- `app/javascript/components/DeleteConfirmModal.tsx` - Redux状態との連携
- `tsconfig.json` - Redux関連の型設定追加

## 実装手順（TDD）
### 1. テスト作成フェーズ
- [ ] `spec/javascript/store/slices/businessCardsSlice.test.ts` - Business Cards Sliceのテスト
- [ ] `spec/javascript/store/slices/uiSlice.test.ts` - UI Sliceのテスト
- [ ] `spec/javascript/hooks/useAppDispatch.test.ts` - カスタムhookのテスト
- [ ] `spec/javascript/hooks/useAppSelector.test.ts` - カスタムhookのテスト
- [ ] `spec/javascript/utils/api.test.ts` - API通信ユーティリティのテスト
- [ ] テストが失敗することを確認

### 2. 実装フェーズ
- [ ] Redux Toolkit の依存関係をpackage.jsonに追加
- [ ] TypeScript型定義ファイルの作成
- [ ] Redux store の設定と初期化
- [ ] Business Cards Slice の実装（CRUD操作）
- [ ] UI Slice の実装（ローディング状態、エラー状態）
- [ ] 型安全なカスタムhooksの実装
- [ ] API通信ユーティリティの実装
- [ ] 既存Reactコンポーネントとの連携

### 3. リファクタリングフェーズ
- [ ] コードの最適化とパフォーマンス向上
- [ ] Redux DevTools Extension の統合
- [ ] エラーハンドリングの統一
- [ ] Rails規約への準拠確認
- [ ] セキュリティ要件の確認

## 実装例
### app/javascript/store/index.ts
```typescript
import { configureStore } from '@reduxjs/toolkit'
import businessCardsReducer from './slices/businessCardsSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    businessCards: businessCardsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### app/javascript/store/slices/businessCardsSlice.ts
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { BusinessCard } from '../../types/businessCard'
import { api } from '../../utils/api'

interface BusinessCardsState {
  cards: BusinessCard[]
  filteredCards: BusinessCard[]
  searchQuery: string
  selectedTags: string[]
  loading: boolean
  error: string | null
}

const initialState: BusinessCardsState = {
  cards: [],
  filteredCards: [],
  searchQuery: '',
  selectedTags: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchBusinessCards = createAsyncThunk(
  'businessCards/fetchBusinessCards',
  async () => {
    const response = await api.get('/business_cards')
    return response.data
  }
)

export const deleteBusinessCard = createAsyncThunk(
  'businessCards/deleteBusinessCard',
  async (id: number) => {
    await api.delete(`/business_cards/${id}`)
    return id
  }
)

const businessCardsSlice = createSlice({
  name: 'businessCards',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredCards = filterCards(state.cards, state.searchQuery, state.selectedTags)
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload
      state.filteredCards = filterCards(state.cards, state.searchQuery, state.selectedTags)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessCards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBusinessCards.fulfilled, (state, action) => {
        state.loading = false
        state.cards = action.payload
        state.filteredCards = filterCards(state.cards, state.searchQuery, state.selectedTags)
      })
      .addCase(fetchBusinessCards.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch business cards'
      })
      .addCase(deleteBusinessCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(card => card.id !== action.payload)
        state.filteredCards = state.filteredCards.filter(card => card.id !== action.payload)
      })
  },
})

function filterCards(cards: BusinessCard[], searchQuery: string, selectedTags: string[]): BusinessCard[] {
  return cards.filter(card => {
    const matchesSearch = searchQuery === '' ||
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => card.tags?.includes(tag))

    return matchesSearch && matchesTags
  })
}

export const { setSearchQuery, setSelectedTags, clearError } = businessCardsSlice.actions
export default businessCardsSlice.reducer
```

### spec/javascript/store/slices/businessCardsSlice.test.ts
```typescript
import businessCardsReducer, {
  setSearchQuery,
  setSelectedTags,
  clearError,
  fetchBusinessCards,
  deleteBusinessCard
} from '@/store/slices/businessCardsSlice'

describe('businessCardsSlice', () => {
  const initialState = {
    cards: [],
    filteredCards: [],
    searchQuery: '',
    selectedTags: [],
    loading: false,
    error: null,
  }

  it('should handle setSearchQuery', () => {
    const mockCards = [
      { id: 1, name: 'John Doe', company: 'Company A', tags: ['tag1'] },
      { id: 2, name: 'Jane Smith', company: 'Company B', tags: ['tag2'] }
    ]

    const state = { ...initialState, cards: mockCards, filteredCards: mockCards }
    const action = setSearchQuery('John')
    const newState = businessCardsReducer(state, action)

    expect(newState.searchQuery).toBe('John')
    expect(newState.filteredCards).toHaveLength(1)
    expect(newState.filteredCards[0].name).toBe('John Doe')
  })

  it('should handle fetchBusinessCards.pending', () => {
    const action = { type: fetchBusinessCards.pending.type }
    const state = businessCardsReducer(initialState, action)

    expect(state.loading).toBe(true)
    expect(state.error).toBe(null)
  })
})
```

## 依存関係
- **前提タスク**:
  - タスク12: TypeScript基盤の構築
  - タスク13: React基本コンポーネントの実装
- **関連タスク**:
  - タスク15: API通信層のTypeScript化
- **後続タスク**:
  - タスク16: インタラクティブ機能の実装

## 完了基準チェックリスト
- [ ] 全ての受け入れ基準を満たしている
- [ ] Redux storeが適切に設定され、型安全性が確保されている
- [ ] Business Cards関連の状態管理が正常に動作している
- [ ] 検索・フィルタリング機能がRedux経由で動作している
- [ ] 既存のReactコンポーネントがReduxと連携している
- [ ] テストが全てパスしている（カバレッジ80%以上）
- [ ] TypeScript型チェックが成功している
- [ ] ESLintチェックが成功している
- [ ] Redux DevToolsで状態変化が確認できる
- [ ] パフォーマンス要件を満たしている
- [ ] セキュリティ要件を満たしている

## 学習ポイント
- **Redux Toolkit の基本概念**: Slice、Reducer、Action、Store の理解
- **TypeScript との連携**: 型安全な状態管理の実装方法
- **React-Redux Hooks**: useSelector、useDispatch の使い方
- **非同期処理**: createAsyncThunk を使った非同期アクション
- **状態の正規化**: 複雑な状態構造の設計パターン
- **パフォーマンス最適化**: メモ化とリセレクターの活用
- **デバッグ技術**: Redux DevTools の効果的な使用方法

## トラブルシューティング
- **状態が更新されない場合**:
  - Immerが正しく動作しているか確認
  - アクションが適切にディスパッチされているか確認
- **TypeScriptエラーが発生する場合**:
  - RootState型とAppDispatch型が正しく設定されているか確認
  - useAppSelector、useAppDispatchフックを使用しているか確認
- **パフォーマンスが低下する場合**:
  - 不要なレンダリングが発生していないか確認
  - useSelectorで適切な部分のみを選択しているか確認
- **非同期処理でエラーが発生する場合**:
  - API通信のエラーハンドリングが適切に実装されているか確認
  - CSRFトークンが正しく設定されているか確認

## パッケージ依存関係
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3"
  },
  "devDependencies": {
    "@types/react-redux": "^7.1.25"
  }
}
```

## 実装時の注意事項
1. **Rails CSRFトークン**: API通信時にCSRFトークンを適切に設定する
2. **メモリリーク防止**: コンポーネントアンマウント時の適切なクリーンアップ
3. **エラー境界**: React Error Boundary と Redux エラーハンドリングの連携
4. **SEO対応**: サーバーサイドレンダリング時の状態初期化
5. **アクセシビリティ**: 状態変化をスクリーンリーダーに適切に通知
