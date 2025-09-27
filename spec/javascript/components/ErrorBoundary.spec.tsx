import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// エラーを投げるテスト用コンポーネント
const ThrowErrorComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('テストエラーメッセージ');
  }
  return <div>正常なコンテンツ</div>;
};

// コンソールエラーを抑制（テスト時の出力を綺麗にするため）
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  it('エラーが発生しない場合、子コンポーネントを正常に表示する', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('正常なコンテンツ')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラー境界が作動してフォールバックUIを表示する', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // エラーフォールバックUIの表示を確認
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('ページを再読み込みしてください')).toBeInTheDocument();
  });

  it('カスタムエラーメッセージが提供された場合、それを表示する', () => {
    const customFallback = <div>カスタムエラーメッセージ</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('カスタムエラーメッセージ')).toBeInTheDocument();
  });

  it('再試行ボタンが表示され、クリックできる', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // エラーが表示されることを確認
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();

    // 再試行ボタンがクリック可能であることを確認
    const retryButton = screen.getByText('再試行');
    expect(retryButton).toBeInTheDocument();

    // ボタンがクリックできることを確認（実際の動作テスト）
    await user.click(retryButton);

    // クリック後、再度同じエラーが表示される（子コンポーネントがまだエラーを投げるため）
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });
});