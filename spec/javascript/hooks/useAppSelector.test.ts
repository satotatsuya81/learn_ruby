import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useAppSelector } from '@/hooks/useAppSelector'
import businessCardsReducer from '@/store/slices/businessCardsSlice'
import uiReducer from '@/store/slices/uiSlice'
import React from 'react'

// テスト用のstoreを作成する関数
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      businessCards: businessCardsReducer,
      ui: uiReducer,
    },
    preloadedState,
  })
}

// テスト用のProviderコンポーネント
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(Provider, { store, children })
  )
}

describe('useAppSelector', () => {
  it('should select business cards state correctly', () => {
    // テスト用の初期状態を定義
    const mockState = {
      businessCards: {
        cards: [
      {
        id: 1,
        name: '田中太郎',
        company_name: 'テスト株式会社',
        department: '営業部',
        job_title: '部長',
        email: 'tanaka@test.com',
        phone: '03-1234-5678',
        mobile: '090-1234-5678',
        website: 'https://test.com',
        address: '東京都千代田区1-1-1',
        notes: 'テストメモ',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        user_id: 1
      },
      {
        id: 2,
        name: '佐藤花子',
        company_name: 'サンプル企業',
        department: '技術部',
        job_title: 'エンジニア',
        email: 'sato@sample.com',
        phone: '03-5678-9012',
        mobile: '090-5678-9012',
        website: 'https://sample.com',
        address: '東京都渋谷区2-2-2',
        notes: 'サンプルメモ',
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        user_id: 1
      }
      ],
        filteredCards: [],
        searchQuery: '',
        loading: false,
        error: null,
      },
      ui: {
        sidebarOpen: false,
        modalOpen: false,
        theme: 'light',
        loading: false,
        error: null,
        deleteConfirm: {
          isOpen: false,
          cardId: null,
          cardName: ''
        }
      },
    }

    const store = createTestStore(mockState)
    const wrapper = createWrapper(store)

    // useAppSelectorフックをテスト
    const { result } = renderHook(
      () => useAppSelector((state) => state.businessCards.cards),
      { wrapper }
    )

    // 期待する値が取得できることを確認
    expect(result.current).toHaveLength(2)
    expect(result.current[0].name).toBe('田中太郎')
    expect(result.current[1].name).toBe('佐藤花子')
  })

  it('should select UI state correctly', () => {
    const mockState = {
      businessCards: {
        cards: [],
        filteredCards: [],
        searchQuery: '',
        loading: false,
        error: null,
      },
      ui: {
        sidebarOpen: true,
        modalOpen: false,
        theme: 'dark',
        loading: false,
        error: null,
        deleteConfirm: {
          isOpen: false,
          cardId: null,
          cardName: ''
        }
      },
    }

    const store = createTestStore(mockState)
    const wrapper = createWrapper(store)

    // UI状態の選択をテスト
    const { result } = renderHook(
      () => useAppSelector((state) => state.ui),
      { wrapper }
    )

    expect(result.current.sidebarOpen).toBe(true)
    expect(result.current.modalOpen).toBe(false)
    expect(result.current.theme).toBe('dark')
  })

  it('should return the same reference when state has not changed', () => {
    const store = createTestStore()
    const wrapper = createWrapper(store)

    // 同じselectorを複数回実行
    const { result, rerender } = renderHook(
      () => useAppSelector((state) => state.businessCards.cards),
      { wrapper }
    )

    const firstResult = result.current

    // 再レンダリング実行（状態は変更しない）
    rerender()

    const secondResult = result.current

    // メモ化により同じ参照が返されることを確認
    expect(firstResult).toBe(secondResult)
  })

  it('should handle nested state selection', () => {
    const mockState = {
      businessCards: {
        cards: [],
        filteredCards: [],
        searchQuery: 'test query',
        loading: true,
        error: 'Some error occurred',
      },
      ui: {
        sidebarOpen: false,
        modalOpen: true,
        theme: 'light',
        loading: false,
        error: null,
        deleteConfirm: {
          isOpen: false,
          cardId: null,
          cardName: ''
        }
      },
    }

    const store = createTestStore(mockState)
    const wrapper = createWrapper(store)

    // 複数の異なる状態を個別に選択
    const { result: loadingResult } = renderHook(
      () => useAppSelector((state) => state.businessCards.loading),
      { wrapper }
    )

    const { result: errorResult } = renderHook(
      () => useAppSelector((state) => state.businessCards.error),
      { wrapper }
    )

    // それぞれの状態が正しく取得できることを確認
    expect(loadingResult.current).toBe(true)
    expect(errorResult.current).toBe('Some error occurred')
  })
})
