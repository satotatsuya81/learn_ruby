 // Redux Toolkit の useDispatch を型安全にするカスタムフック
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'

// AppDispatch型を使用して、型安全なdispatchフックを提供
// これにより、TypeScriptが自動的にアクションの型をチェックする
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
