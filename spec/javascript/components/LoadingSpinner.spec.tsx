import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('デフォルトのローディングスピナーが表示される', () => {
    render(<LoadingSpinner />);

    // スピナー要素の存在を確認
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();

    // Bootstrap spinnnerクラスが適用されていることを確認
    expect(spinner).toHaveClass('spinner-border');
  });

  it('カスタムサイズ（small）が適用される', () => {
    render(<LoadingSpinner size="small" />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('spinner-border-sm');
  });

  it('カスタムサイズ（large）が適用される', () => {
    render(<LoadingSpinner size="large" />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('spinner-border');
    // largeサイズは追加のカスタムクラスで実装される予定
    expect(spinner).toHaveStyle('width: 3rem; height: 3rem');
  });

  it('カスタムメッセージが表示される', () => {
    const customMessage = 'データを読み込み中...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByTestId('loading-message')).toHaveTextContent(customMessage);
  });

  it('メッセージが非表示にできる', () => {
    render(<LoadingSpinner showMessage={false} />);

    // メッセージエリアが表示されないことを確認
    expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
  });

  it('センタリング表示される', () => {
    render(<LoadingSpinner centered />);

    const container = screen.getByTestId('loading-container');
    expect(container).toHaveClass('d-flex', 'justify-content-center', 'align-items-center');
  });

  it('色のバリエーション（primary）が適用される', () => {
    render(<LoadingSpinner color="primary" />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('text-primary');
  });

  it('色のバリエーション（success）が適用される', () => {
    render(<LoadingSpinner color="success" />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('text-success');
  });

  it('オーバーレイモードが動作する', () => {
    render(<LoadingSpinner overlay />);

    const container = screen.getByTestId('loading-container');
    expect(container).toHaveClass('position-fixed');
    expect(container).toHaveStyle('top: 0; left: 0; width: 100%; height: 100%');
  });

  it('アクセシビリティ属性が正しく設定される', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');

    // スクリーンリーダー用のテキストが存在することを確認
    const srText = spinner.querySelector('.visually-hidden');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveTextContent('読み込み中...');
  });
});