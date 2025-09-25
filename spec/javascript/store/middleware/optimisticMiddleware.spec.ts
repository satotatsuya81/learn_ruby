import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { optimisticMiddleware } from '@/store/middleware/optimisticMiddleware';

// テスト用のシンプルなスライス
const testSlice = createSlice({
  name: 'test',
  initialState: {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ],
    loading: false,
    error: null as string | null  // 型を明示的に指定してエラーを解消
  },
  reducers: {
    // 楽観的削除アクション
    deleteItemOptimistic: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // 削除成功アクション（未使用変数エラーを避けるため、変数名にアンダースコアを付与）
    deleteItemSuccess: (state, _action: PayloadAction<number>) => {
      // 楽観的更新が既に適用されているので、何もしない
      console.log('Delete success', state.items.length); // 変数使用を明示
    },
    // 削除失敗時のロールバックアクション
    deleteItemFailure: (state, action: PayloadAction<{ id: number, originalItem: any }>) => {
      // 元のアイテムを復元
      state.items.push(action.payload.originalItem);
      state.error = '削除に失敗しました';  // 型エラーが解消される
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

const { deleteItemOptimistic, setLoading } = testSlice.actions;
// 未使用変数警告を避けるため、実際に使用する変数のみを分割代入

describe('optimisticMiddleware', () => {
  let store: any;

  beforeEach(() => {
    // テスト用ストアを楽観的更新ミドルウェア付きで作成
    store = configureStore({
      reducer: {
        test: testSlice.reducer
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(optimisticMiddleware)
    });
  });

  it('楽観的更新ミドルウェアが存在し、基本的なアクションを通すことができる', () => {
    // 初期状態の確認
    expect(store.getState().test.items).toHaveLength(2);
    expect(store.getState().test.items[0].id).toBe(1);

    // 通常のアクション実行
    store.dispatch(setLoading(true));

    // ミドルウェアが正常に動作し、アクションが通ることを確認
    expect(store.getState().test.loading).toBe(true);
  });

  it('楽観的削除アクションを実行すると、即座にアイテムが削除される', () => {
    // 楽観的削除を実行
    store.dispatch(deleteItemOptimistic(1));

    // 即座にアイテムが削除されることを確認（楽観的更新）
  const state = store.getState().test;
    expect(state.items).toHaveLength(1);
    expect(state.items.find((item: any) => item.id === 1)).toBeUndefined();
  });
});
