// Redux Toolkit の useSelector を型安全にするカスタムフック
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

// RootState型を使用して、型安全なselectorフックを提供
// これにより、ステートの型が自動的に推論される
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
