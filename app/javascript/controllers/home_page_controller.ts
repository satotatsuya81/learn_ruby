import { Controller } from "@hotwired/stimulus";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { HomePage } from "@/components/HomePage";

interface HomePageStats {
  totalBusinessCards: number;
  companiesCount: number;
  lastUpdated: string;
}

// ホームページ用のStimulus Controller
// Reactコンポーネントとの統合を担当
export default class extends Controller {
  static values = { stats: Object };

  declare readonly statsValue: HomePageStats;
  private root?: Root;

  connect(): void {
    console.log("🎯 HomePageController connected");
    console.log("Element:", this.element);
    console.log("Stats value raw:", this.element.getAttribute('data-home-page-stats-value'));
    console.log("Stats value parsed:", this.statsValue);
    console.log("React available:", typeof window.React !== 'undefined');

    // JSONパースのテスト
    try {
      const rawValue = this.element.getAttribute('data-home-page-stats-value');
      const parsed = JSON.parse(rawValue ?? '{}') as HomePageStats;
      console.log("✅ JSON parse successful:", parsed);
    } catch (error) {
      console.error("❌ JSON parse failed:", error);
      return; // JSON解析に失敗した場合は処理を停止
    }

    // Reactコンポーネントをマウント
    this.mountReactComponent();
  }

  disconnect(): void {
    // コンポーネントのクリーンアップ
    if (this.root) {
      this.root.unmount();
    }
  }

  mountReactComponent(): void {
    try {
      console.log("Starting React component mount...");
      console.log("Creating root for element:", this.element);

      // React 18の新しいcreateRoot APIを使用
      this.root = createRoot(this.element);
      console.log("Root created successfully");

      // HomePageコンポーネントをレンダリング
      console.log("Rendering HomePage component with stats:", this.statsValue);
      this.root.render(
        React.createElement(HomePage, {
          stats: this.statsValue
        })
      );
      console.log("HomePage component rendered successfully");
    } catch (error) {
      console.error('HomePage component mount failed:', error);
      // エラーが発生した場合はフォールバック表示を維持
    }
  }

  // statsValueが変更された時の処理
  statsValueChanged(): void {
    if (this.root) {
      this.mountReactComponent();
    }
  }
}
