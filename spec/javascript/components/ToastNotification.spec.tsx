import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { Provider } from 'react-redux';
  import { configureStore } from '@reduxjs/toolkit';
  import { Toast, ToastContainer } from '@/components/ToastNotification';
  import uiReducer, { removeToast } from '@/store/slices/uiSlice';

  // テスト用のモックストアを作成するヘルパー
  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        ui: uiReducer,
      },
      preloadedState: {
        ui: {
          sidebarOpen: false,
          modalOpen: false,
          theme: 'light' as const,
          loading: false,
          toasts: [],
          error: null,
          deleteConfirm: {
            isOpen: false,
            cardId: null,
            cardName: ''
          },
          ...initialState,
        },
      },
    });
  };

  // タイマーをモック化して制御可能にする
  jest.useFakeTimers();

  describe('Toast', () => {
    let mockStore: ReturnType<typeof createMockStore>;

    beforeEach(() => {
      mockStore = createMockStore();
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('トーストメッセージを表示する', () => {
      render(
        <Provider store={mockStore}>
          <Toast
            id="test-1"
            message="テストメッセージ"
            type="success"
          />
        </Provider>
      );

      // メッセージが表示されることを確認
      expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
      // Bootstrap のクラスが適用されることを確認
      expect(screen.getByRole('alert')).toHaveClass('text-bg-success');
    });

    it('クローズボタンをクリックするとremoveToastアクションをディスパッチする', () => {
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

      render(
        <Provider store={mockStore}>
          <Toast
            id="test-1"
            message="削除テスト"
            type="info"
          />
        </Provider>
      );

      // クローズボタンをクリック
      fireEvent.click(screen.getByLabelText('Close'));

      // removeToastアクションがディスパッチされることを確認
      expect(dispatchSpy).toHaveBeenCalledWith(removeToast('test-1'));
    });

    it('duration指定時間後に自動的にremoveToastアクションをディスパッチする', async () => {
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

      render(
        <Provider store={mockStore}>
          <Toast
            id="test-1"
            message="自動削除テスト"
            type="warning"
            duration={3000} // 3秒後に自動削除
          />
        </Provider>
      );

      // 3秒経過前はディスパッチされない
      expect(dispatchSpy).not.toHaveBeenCalledWith(removeToast('test-1'));

      // 3秒経過
      jest.advanceTimersByTime(3000);

      // removeToastアクションがディスパッチされることを確認
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(removeToast('test-1'));
      });
    });

    it('duration=0の場合は自動削除されない', async () => {
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

      render(
        <Provider store={mockStore}>
          <Toast
            id="test-1"
            message="手動削除のみ"
            type="error"
            duration={0} // 自動削除なし
          />
        </Provider>
      );

      // 長時間経過しても自動削除されない
      jest.advanceTimersByTime(10000);
      expect(dispatchSpy).not.toHaveBeenCalledWith(removeToast('test-1'));
    });
  });

  describe('ToastContainer', () => {
    it('複数のトーストを表示する', () => {
      const mockStore = createMockStore({
        toasts: [
          { id: '1', message: '成功メッセージ', type: 'success' },
          { id: '2', message: 'エラーメッセージ', type: 'error' },
          { id: '3', message: '情報メッセージ', type: 'info' }
        ]
      });

      render(
        <Provider store={mockStore}>
          <ToastContainer />
        </Provider>
      );

      // 各トーストメッセージの表示を確認
      expect(screen.getByText('成功メッセージ')).toBeInTheDocument();
      expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
      expect(screen.getByText('情報メッセージ')).toBeInTheDocument();
    });

    it('トーストが空の場合は何も表示しない', () => {
      const mockStore = createMockStore({ toasts: [] });

      const { container } = render(
        <Provider store={mockStore}>
          <ToastContainer />
        </Provider>
      );

      // コンテナは存在するがトーストは表示されない（class指定で特定）
      const toastContainer = container.querySelector('.toast-container');
      expect(toastContainer).toHaveClass('toast-container');
      expect(toastContainer).toBeEmptyDOMElement();
    });

    it('適切なBootstrapクラスが適用される', () => {
      const mockStore = createMockStore({
        toasts: [{ id: '1', message: 'テスト', type: 'success' }]
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ToastContainer />
        </Provider>
      );

      // コンテナクラスの確認（class指定で特定）
      const toastContainer = container.querySelector('.toast-container');
      expect(toastContainer).toHaveClass(
        'toast-container',
        'position-fixed',
        'top-0',
        'end-0',
        'p-3'
      );
    });
  });
