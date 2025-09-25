import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // エラーが発生した場合、状態を更新してフォールバックUIを表示
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーログを記録（開発環境では詳細情報を出力）
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    // エラー状態をリセットして再試行を可能にする
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUIを表示
      return (
        <div className="alert alert-danger d-flex flex-column align-items-center" role="alert">
          <div className="mb-3">
            <i className="bi bi-exclamation-triangle fs-1" aria-hidden="true"></i>
          </div>
          <h4 className="alert-heading">エラーが発生しました</h4>
          <p className="mb-3">ページを再読み込みしてください</p>
          <button
            className="btn btn-outline-danger"
            onClick={this.handleRetry}
            type="button"
          >
            再試行
          </button>
        </div>
      );
    }

    // エラーがない場合は通常通り子コンポーネントを表示
    return this.props.children;
  }
}