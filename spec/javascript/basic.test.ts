// Jest + TypeScript 環境の基本動作確認テスト
// 最初のテストとして、環境が正しく設定されているかを検証

describe('TypeScript + Jest 環境', () => {
  test('基本的なTypeScript機能が動作する', () => {
    // TypeScript の型推論をテスト
    const message: string = 'Hello TypeScript';
    const number: number = 42;

    expect(typeof message).toBe('string');
    expect(typeof number).toBe('number');
    expect(message).toBe('Hello TypeScript');
    expect(number).toBe(42);
  });

  test('DOM API が利用可能', () => {
    // jsdom 環境でのDOM操作をテスト
    document.body.innerHTML = '<div id="test">Test Content</div>';
    const element = document.getElementById('test');

    expect(element).not.toBeNull();
    expect(element?.textContent).toBe('Test Content');
  });

  test('モジュールインポートが動作する', () => {
    // ES modules の import/export をテスト
    const testFunction = (): string => 'test result';

    expect(testFunction()).toBe('test result');
  });
});
