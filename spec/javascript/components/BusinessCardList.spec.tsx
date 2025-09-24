  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { Provider } from 'react-redux';
  import { BusinessCardList } from '@/components/BusinessCardList';
  import * as api from '@/utils/api';
  // ファクトリー関数をインポート
  import { createBusinessCards } from '../factories/businessCardFactory';
  import { store } from '@/store';

  jest.mock('@/utils/api');
  const mockApi = api as jest.Mocked<typeof api>;

  // Redux Providerでラップするヘルパー関数
  const renderWithRedux = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

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

  });
