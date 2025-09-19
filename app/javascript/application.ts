// TypeScript版アプリケーションエントリーポイント
// Rails 7 + esbuild + TypeScript統合の基盤設定

// Stimulus（Rails標準コントローラーフレームワーク）の初期化
import { Application } from "@hotwired/stimulus";
import "./controllers";

// Bootstrap（UIライブラリ）の初期化
import "bootstrap";

// TypeScript型定義をアプリケーション全体で利用可能にする
export * from "@/types/BusinessCard";
export * from "@/types/user";
export * from "@/types/api";

// APIクライアントをグローバルに利用可能にする
export { apiClient } from "@/utils/api";
export * from "@/utils/validation";

// Stimulusアプリケーションの起動
const application = Application.start();

// 開発環境でのデバッグサポート
application.debug = process.env.NODE_ENV === "development";

// グローバルウィンドウオブジェクトへの型安全なアクセス
declare global {
  interface Window {
    Stimulus: Application;
  }
}

// StimulusをグローバルからアクセスできるようにExport
window.Stimulus = application;

// アプリケーション初期化完了ログ
console.log("TypeScript Application initialized successfully");
