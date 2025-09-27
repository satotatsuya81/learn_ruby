/**
 * 開発者向けデバッグユーティリティ
 * React + Stimulus + Rails環境での統合デバッグ機能
 */

export class DebugHelper {
  private static instance: DebugHelper;
  private debugContainer: HTMLElement | null = null;

  static getInstance(): DebugHelper {
    if (DebugHelper.instance === undefined) {
      DebugHelper.instance = new DebugHelper();
    }
    return DebugHelper.instance;
  }

  /**
   * デバッグパネルを表示
   */
  showDebugPanel(): void {
    if (this.debugContainer !== null) {
      return;
    } // 既に表示されている場合

    this.debugContainer = document.createElement('div');
    this.debugContainer.id = 'debug-panel';
    this.debugContainer.className = 'mt-4 p-3 bg-info bg-opacity-10 rounded';
    this.debugContainer.innerHTML = `
      <h5>🔧 開発者向けデバッグ情報</h5>
      <p id="debug-status">デバッグパネル初期化済み</p>
      <div class="btn-group" role="group">
        <button onclick="window.DebugHelper.testJavaScript()" class="btn btn-sm btn-outline-info">基本動作確認</button>
        <button onclick="window.DebugHelper.debugStimulus()" class="btn btn-sm btn-outline-warning">Stimulusデバッグ</button>
        <button onclick="window.DebugHelper.debugReact()" class="btn btn-sm btn-outline-success">Reactデバッグ</button>
        <button onclick="window.DebugHelper.hideDebugPanel()" class="btn btn-sm btn-outline-danger">非表示</button>
      </div>
      <div id="debug-details" class="mt-3" style="display: none;">
        <pre id="debug-output" class="bg-dark text-light p-2 rounded" style="font-size: 12px; max-height: 300px; overflow-y: auto;"></pre>
      </div>
    `;

    document.body.appendChild(this.debugContainer);
    console.log("✅ デバッグパネル表示");
  }

  /**
   * デバッグパネルを非表示
   */
  hideDebugPanel(): void {
    if (this.debugContainer) {
      this.debugContainer.remove();
      this.debugContainer = null;
      console.log("✅ デバッグパネル非表示");
    }
  }

  /**
   * 基本的なJavaScript動作確認
   */
  testJavaScript(): void {
    const status = document.getElementById('debug-status');
    if (status === null) {
      return;
    }

    let result = "✅ JavaScript正常動作\n";
    console.log("=== JavaScript動作確認開始 ===");

    // Stimulus確認
    if (typeof (window as any).Stimulus !== 'undefined') {
      result += "✅ Stimulus読み込み済み\n";
      console.log("✅ Stimulus found:", (window as any).Stimulus);
    } else {
      result += "❌ Stimulus未読み込み\n";
      console.log("❌ Stimulus not found");
    }

    // React確認
    if (typeof (window as any).React !== 'undefined') {
      result += "✅ React読み込み済み\n";
      console.log("✅ React found:", (window as any).React);
    } else {
      result += "❌ React未読み込み\n";
      console.log("❌ React not found");
    }

    status.innerHTML = result.replace(/\n/g, '<br>');
    this.updateDebugOutput("基本動作確認完了");
  }

  /**
   * Stimulusコントローラーのデバッグ
   */
  debugStimulus(): void {
    console.log("=== Stimulusデバッグ開始 ===");

    const stimulus = (window as any).Stimulus;
    if (stimulus === undefined) {
      this.updateDebugOutput("❌ Stimulusが見つかりません");
      return;
    }

    let output = "=== Stimulus情報 ===\n";
    output += `アプリケーション: ${stimulus.constructor.name}\n`;
    output += `デバッグモード: ${stimulus.debug}\n`;

    // 登録済みコントローラー
    const modules = stimulus.router?.modulesByIdentifier ?? {};
    output += `\n登録済みコントローラー (${Object.keys(modules).length}個):\n`;
    Object.keys(modules).forEach(identifier => {
      output += `  - ${identifier}\n`;
    });

    // DOM上のコントローラー要素
    const controllerElements = document.querySelectorAll('[data-controller]');
    output += `\nDOM上のコントローラー要素 (${controllerElements.length}個):\n`;
    controllerElements.forEach((element, index) => {
      const controllers = element.getAttribute('data-controller');
      output += `  ${index + 1}. ${controllers} (${element.tagName.toLowerCase()})\n`;
    });

    this.updateDebugOutput(output);
  }

  /**
   * Reactコンポーネントのデバッグ
   */
  debugReact(): void {
    console.log("=== Reactデバッグ開始 ===");

    const React = (window as any).React;
    if (React === undefined) {
      this.updateDebugOutput("❌ Reactが見つかりません");
      return;
    }

    let output = "=== React情報 ===\n";
    output += `バージョン: ${React.version}\n`;

    // React要素の検索
    const reactElements = document.querySelectorAll('[data-reactroot]');
    output += `\nReact要素候補 (${reactElements.length}個):\n`;
    reactElements.forEach((element, index) => {
      const reactRoot = element.getAttribute('data-reactroot');
      output += `  ${index + 1}. ${element.tagName.toLowerCase()}`;
      if (reactRoot !== null) {
        output += ` (reactroot)`;
      }
      output += `\n`;
    });

    this.updateDebugOutput(output);
  }

  /**
   * 特定のStimulusコントローラーをデバッグ
   */
  debugStimulusController(controllerName: string): void {
    console.log(`=== ${controllerName}コントローラーデバッグ開始 ===`);

    const element = document.querySelector(`[data-controller*="${controllerName}"]`);
    if (!element) {
      this.updateDebugOutput(`❌ ${controllerName}コントローラー要素が見つかりません`);
      return;
    }

    let output = `=== ${controllerName}コントローラー詳細 ===\n`;
    output += `要素: ${element.tagName.toLowerCase()}\n`;
    output += `コントローラー: ${element.getAttribute('data-controller')}\n`;

    // data-* 属性の一覧
    const attributes = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('data-'))
      .map(attr => `  ${attr.name}: ${attr.value}`)
      .join('\n');

    if (attributes) {
      output += `\ndata-属性:\n${attributes}\n`;
    }

    // JSON値の解析テスト
    const valueAttributes = Array.from(element.attributes)
      .filter(attr => attr.name.includes('-value'));

    if (valueAttributes.length > 0) {
      output += `\nJSON値解析テスト:\n`;
      valueAttributes.forEach(attr => {
        try {
          const parsed = JSON.parse(attr.value ?? '{}')
          output += `  ✅ ${attr.name}: ${JSON.stringify(parsed, null, 2)}\n`;
        } catch (error) {
          output += `  ❌ ${attr.name}: JSON解析失敗 - ${error}\n`;
        }
      });
    }

    this.updateDebugOutput(output);
  }

  /**
   * デバッグ出力を更新
   */
  private updateDebugOutput(content: string): void {
    const details = document.getElementById('debug-details');
    const output = document.getElementById('debug-output');

    if (details && output) {
      details.style.display = 'block';
      output.textContent = content;
      console.log(content);
    }
  }
}

// グローバルに公開
declare global {
  interface Window {
    DebugHelper: typeof DebugHelper;
  }
}

// 初期化
export function initializeDebug(): void {
  (window as unknown as Record<string, unknown>).DebugHelper = DebugHelper;

  // Ctrl+D でデバッグパネル表示/非表示
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault();
      const debugHelper = DebugHelper.getInstance();
      if (document.getElementById('debug-panel')) {
        debugHelper.hideDebugPanel();
      } else {
        debugHelper.showDebugPanel();
      }
    }
  });

  console.log("🔧 デバッグヘルパー初期化完了 (Ctrl+D でパネル表示/非表示)");
}
