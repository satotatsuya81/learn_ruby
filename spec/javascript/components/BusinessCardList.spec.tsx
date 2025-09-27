  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { Provider } from 'react-redux';
  import { configureStore } from '@reduxjs/toolkit';
  import { BusinessCardList } from '@/components/BusinessCardList';
  import businessCardsReducer from '@/store/slices/businessCardsSlice';
  import uiReducer from '@/store/slices/uiSlice';
  import { BusinessCard } from '@/types/BusinessCard';
  import * as api from '@/utils/api';
  // ファクトリー関数をインポート
  import { createBusinessCards } from '../factories/businessCardFactory';
  import { store } from '@/store';

  jest.mock('@/utils/api');
  const mockApi = api as jest.Mocked<typeof api>;

  // モックデータの準備
  const mockBusinessCard: BusinessCard = {
    id: 1,
    name: '田中太郎',
    company_name: 'テスト株式会社',
    job_title: '営業部長',
    email: 'tanaka@test.co.jp',
    phone: '03-1234-5678',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 1
  };

  // テスト用のストアを作成するヘルパー関数
  const createTestStore = (initialState: any = {}) => {
    return configureStore({
      reducer: {
        businessCards: businessCardsReducer,
        ui: uiReducer,
      },
      preloadedState: {
        businessCards: {
          cards: [mockBusinessCard],
          filteredCards: [mockBusinessCard],
          searchQuery: '',
          loading: false,
          error: null,
          successMessage: null,
          ...(initialState.businessCards || {})
        },
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
          ...(initialState.ui || {})
        }
      }
    });
  };

  // Redux Providerでラップするヘルパー関数
  const renderWithRedux = (component: React.ReactElement, testStore = store) => {
    return render(
      <Provider store={testStore}>
        {component}
      </Provider>
    );
  };

  // テスト用のラッパーコンポーネント
  const TestWrapper = ({ children, store }: { children: React.ReactNode, store: any }) => (
    <Provider store={store}>{children}</Provider>
  );

  describe('BusinessCardList', () => {
    // ファクトリー関数を使用してモックデータを生成
    const mockBusinessCards = createBusinessCards(3);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('Redux版のテスト', () => {
      it('名刺一覧を表示する', async () => {
        mockApi.getBusinessCards.mockResolvedValue(mockBusinessCards);

        renderWithRedux(<BusinessCardList />);

        // ローディング状態の確認
        expect(screen.getByText('名刺を読み込み中...')).toBeInTheDocument();

        // データ表示の確認（非同期）
        await waitFor(() => {
          expect(screen.getByText('テストユーザー1')).toBeInTheDocument();
          expect(screen.getByText('テスト会社1')).toBeInTheDocument();
        });
      });

      it('削除ボタンクリックで削除確認モーダルを表示する', async () => {
        mockApi.getBusinessCards.mockResolvedValue(mockBusinessCards);

        renderWithRedux(<BusinessCardList />);

        // データが読み込まれるまで待機
        await waitFor(() => {
          expect(screen.getByText('テストユーザー1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByRole('button', { name: '削除' })[0]);

        expect(screen.getByText('削除確認')).toBeInTheDocument();
        expect(screen.getByText('以下の名刺を削除してもよろしいですか？')).toBeInTheDocument();
      });
    });

    // トースト通知統合のテスト
    describe('トースト通知統合', () => {
      describe('削除操作でのトースト通知', () => {
        it('削除成功時にsuccessトースト通知をディスパッチする', async () => {
          // 削除成功の状態でストアを初期化
          const testStore = createTestStore({
            businessCards: {
              successMessage: '名刺を削除しました'
            }
          });

          render(
            <TestWrapper store={testStore}>
              <BusinessCardList />
            </TestWrapper>
          );

          // useEffectが実行されるまで待機
          await waitFor(() => {
            const state = testStore.getState();
            expect(state.ui.toasts).toHaveLength(1);
          });

          // ストアの状態を確認（successToastがディスパッチされることを期待）
          const state = testStore.getState();
          expect(state.ui.toasts[0]).toMatchObject({
            message: '名刺を削除しました',
            type: 'success'
          });
        });

        it('削除エラー時にerrorトースト通知をディスパッチする', async () => {
          // 削除エラーの状態でストアを初期化
          const testStore = createTestStore({
            businessCards: {
              error: '名刺の削除に失敗しました'
            }
          });

          render(
            <TestWrapper store={testStore}>
              <BusinessCardList />
            </TestWrapper>
          );

          // useEffectが実行されるまで待機
          await waitFor(() => {
            const state = testStore.getState();
            expect(state.ui.toasts).toHaveLength(1);
          });

          // ストアの状態を確認（errorToastがディスパッチされることを期待）
          const state = testStore.getState();
          expect(state.ui.toasts[0]).toMatchObject({
            message: '名刺の削除に失敗しました',
            type: 'error'
          });
        });
      });

      describe('FlashMessageコンポーネントの除去', () => {
        it('FlashMessageコンポーネントが表示されない', () => {
          const testStore = createTestStore({
            businessCards: {
              error: 'エラーメッセージ',
              successMessage: '成功メッセージ'
            }
          });

          render(
            <TestWrapper store={testStore}>
              <BusinessCardList />
            </TestWrapper>
          );

          // FlashMessageコンポーネント特有のクラスが存在しないことを確認
          // （現在の実装では存在するため、このテストは失敗する）
          expect(document.querySelector('.alert')).not.toBeInTheDocument();
        });
      });
    });

  });
