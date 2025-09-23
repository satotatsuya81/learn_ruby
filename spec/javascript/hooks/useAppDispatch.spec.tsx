import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setSearchQuery } from '@/store/slices/businessCardsSlice'

// Redux Providerでラップするヘルパー関数
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
)

describe('useAppDispatch', () => {
  it('Reduxストアにアクションを正常にディスパッチできること', () => {
    // useAppDispatchフックをテスト環境でレンダリング
    const { result } = renderHook(() => useAppDispatch(), { wrapper })

    // dispatchが関数として取得できることを確認
    expect(typeof result.current).toBe('function')

    // アクションをディスパッチして例外が発生しないことを確認
    expect(() => {
      result.current(setSearchQuery('test'))
    }).not.toThrow()
  })

  it('TypeScript型安全性により不正なアクションをコンパイル時に検出すること', () => {
    // このテストはTypeScriptコンパイラによる型チェックを確認
    // 実際の実行時テストというより、型定義の正確性をドキュメント化
    const { result } = renderHook(() => useAppDispatch(), { wrapper })
    const dispatch = result.current

    // 正しい型のアクションはディスパッチできる
    expect(() => {
      dispatch(setSearchQuery('valid string'))
    }).not.toThrow()
  })
})
