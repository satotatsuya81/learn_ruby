// Jest グローバル設定ファイル
// DOM 環境のセットアップと共通モックの設定

// CSRF token のモック（Rails統合のため）
Object.defineProperty(document, 'querySelector', {
  value: jest.fn().mockImplementation((selector: string) => {
    if (selector === 'meta[name="csrf-token"]') {
      return { content: 'test-csrf-token' };
    }
    return null;
  }),
  writable: true,
});

// fetch API のモック（テスト時にHTTPリクエストを模擬）
global.fetch = jest.fn();

// コンソールエラーを実際のテスト失敗にしない設定
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
