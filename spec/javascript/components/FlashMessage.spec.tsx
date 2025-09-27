import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlashMessage } from '@/components/FlashMessage';

// タイマーをモック化して制御可能にする
jest.useFakeTimers();

describe('FlashMessage', () => {
  let mockOnClose: jest.Mock;

  beforeEach(() => {
    mockOnClose = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('コンポーネントのレンダリング', () => {
    it('メッセージが表示される', () => {
      render(
        <FlashMessage
          message="テストメッセージ"
          type="success"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('複数メッセージが配列で渡された場合、全て表示される', () => {
      const messages = ['メッセージ1', 'メッセージ2', 'メッセージ3'];

      render(
        <FlashMessage
          message={messages}
          type="info"
          onClose={mockOnClose}
        />
      );

      messages.forEach(message => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });

    it('メッセージがない場合は何も表示しない', () => {
      const { container } = render(
        <FlashMessage
          message=""
          type="success"
          onClose={mockOnClose}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('クローズボタンが表示される', () => {
      render(
        <FlashMessage
          message="テスト"
          type="success"
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('btn-close');
    });
  });

  describe('メッセージタイプによるスタイル確認', () => {
    it('success タイプの場合、適切なBootstrapクラスが適用される', () => {
      render(
        <FlashMessage
          message="成功メッセージ"
          type="success"
          onClose={mockOnClose}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
    });

    it('danger タイプの場合、適切なBootstrapクラスが適用される', () => {
      render(
        <FlashMessage
          message="エラーメッセージ"
          type="danger"
          onClose={mockOnClose}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
    });

    it('warning タイプの場合、適切なBootstrapクラスが適用される', () => {
      render(
        <FlashMessage
          message="警告メッセージ"
          type="warning"
          onClose={mockOnClose}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    });

    it('info タイプの場合、適切なBootstrapクラスが適用される', () => {
      render(
        <FlashMessage
          message="情報メッセージ"
          type="info"
          onClose={mockOnClose}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('alert', 'alert-info', 'alert-dismissible', 'fade', 'show');
    });
  });

  describe('手動クローズボタンの動作', () => {
    it('クローズボタンクリックでonCloseコールバックが呼ばれる', () => {
      render(
        <FlashMessage
          message="テストメッセージ"
          type="success"
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('自動消失タイマーの動作', () => {
    it('autoClose=trueの場合、指定時間後にonCloseが呼ばれる', async () => {
      render(
        <FlashMessage
          message="自動消失テスト"
          type="success"
          onClose={mockOnClose}
          autoClose={true}
          autoCloseDelay={3000}
        />
      );

      // 3秒経過前はonCloseが呼ばれない
      expect(mockOnClose).not.toHaveBeenCalled();

      // 3秒経過
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('autoClose=falseの場合、自動消失しない', async () => {
      render(
        <FlashMessage
          message="手動消失のみ"
          type="info"
          onClose={mockOnClose}
          autoClose={false}
          autoCloseDelay={3000}
        />
      );

      // 長時間経過しても自動消失しない
      jest.advanceTimersByTime(10000);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('デフォルト設定では自動消失しない', async () => {
      render(
        <FlashMessage
          message="デフォルト設定"
          type="success"
          onClose={mockOnClose}
        />
      );

      // 長時間経過しても自動消失しない（autoClose=falseがデフォルト）
      jest.advanceTimersByTime(10000);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('カスタム自動消失時間が正しく動作する', async () => {
      render(
        <FlashMessage
          message="カスタム時間テスト"
          type="warning"
          onClose={mockOnClose}
          autoClose={true}
          autoCloseDelay={5000} // 5秒
        />
      );

      // 4秒経過時点では呼ばれない
      jest.advanceTimersByTime(4999);
      expect(mockOnClose).not.toHaveBeenCalled();

      // 5秒経過
      jest.advanceTimersByTime(1);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('メッセージが空の場合、タイマーが設定されない', () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      render(
        <FlashMessage
          message=""
          type="success"
          onClose={mockOnClose}
          autoClose={true}
          autoCloseDelay={3000}
        />
      );

      // setTimeoutが呼ばれないことを確認
      expect(setTimeoutSpy).not.toHaveBeenCalled();

      setTimeoutSpy.mockRestore();
    });
  });

  describe('クリーンアップ処理', () => {
    it('コンポーネントアンマウント時にタイマーがクリアされる', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <FlashMessage
          message="クリーンアップテスト"
          type="success"
          onClose={mockOnClose}
          autoClose={true}
          autoCloseDelay={3000}
        />
      );

      // コンポーネントをアンマウント
      unmount();

      // clearTimeoutが呼ばれることを確認
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });
});