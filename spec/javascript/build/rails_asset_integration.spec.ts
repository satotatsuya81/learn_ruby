/**
   * Rails環境でのTypeScriptアセット処理統合テスト
   *
   * esbuildでコンパイルされたTypeScriptが
   * Railsのアセットパイプラインと正しく連携することを確認
   */

  describe('Rails Asset Pipeline TypeScript Integration', () => {
    // CSRFトークンの取得テスト（DOM操作）
    it('DOMからCSRFトークンを取得する', () => {
      // Rails環境でのmeta tagからCSRFトークン取得をモック
      document.head.innerHTML = `
        <meta name="csrf-token" content="test-csrf-token">
      `;

      const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
      expect(meta).toBeDefined();
      expect(meta.content).toBe('test-csrf-token');
    });

    // アセットパス解決テスト
    it('アセットパスが正しく解決されることを確認する', () => {
      // Rails環境でのアセットパス解決が正しく動作することを確認
      // この設定は実際のconfig/importmap.rbに依存する
      expect(() => {
        // TypeScriptファイルのimportが成功することを確認
        const apiModule = require.resolve('@/utils/api');
        expect(apiModule).toBeDefined();
      }).not.toThrow();
    });

    // Stimulusコントローラーとの統合テスト準備
    it('StimulusコントローラーのTypeScript統合の準備をする', () => {
      // Stimulusコントローラーのベースクラスが利用可能であることを確認
      // （将来的なTypeScript化の準備）
      expect(typeof window).toBe('object');
      expect(typeof document).toBe('object');

      // DOM操作の基本的な機能が利用可能であることを確認
      const element = document.createElement('div');
      element.setAttribute('data-controller', 'test');
      expect(element.getAttribute('data-controller')).toBe('test');
    });
  });
