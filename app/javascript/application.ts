// TypeScript版アプリケーションエントリーポイント
// Rails 7 + esbuild + TypeScript統合の基盤設定

// React関連ライブラリのインポート
import React from "react";

// Stimulus（Rails標準コントローラーフレームワーク）の初期化
import { Application } from "@hotwired/stimulus";

// Bootstrap（UIライブラリ）の初期化
import "bootstrap";

// デバッグユーティリティ
import { initializeDebug } from "@/utils/debug";

// TypeScript型定義をアプリケーション全体で利用可能にする
export * from "@/types/BusinessCard";
export * from "@/utils/api";

// React統合のためのStimulusコントローラー
import BusinessCardFormController from "@/controllers/business_card_form_controller"
import BusinessCardDetailController from "@/controllers/business_card_detail_controller"
import HomePageController from "@/controllers/home_page_controller"
import UserProfileController from "@/controllers/user_profile_controller"
import LoginFormController from "@/controllers/login_form_controller"
import UserRegistrationFormController from "@/controllers/user_registration_form_controller"

// Turboイベントによる初期化関数
function initializeApplication() {
  console.log("=== APPLICATION.TS START ===");
  console.log("=== IMPORTS COMPLETED ===");

  // Stimulusアプリケーションの起動
  console.log("=== STARTING STIMULUS APPLICATION ===");
  const application = Application.start();

  // 開発環境でのデバッグサポート
  application.debug = true;
  console.log("=== STIMULUS DEBUG ENABLED ===");

  // コントローラーの登録
  console.log("=== REGISTERING CONTROLLERS ===");

  try {
    application.register("business-card-form", BusinessCardFormController)
    console.log("✅ business-card-form registered");

    application.register("business-card-detail", BusinessCardDetailController)
    console.log("✅ business-card-detail registered");

    application.register("home-page", HomePageController)
    console.log("✅ home-page registered");

    application.register("user-profile", UserProfileController)
    console.log("✅ user-profile registered");

    application.register("login-form", LoginFormController)
    console.log("✅ login-form registered");

    application.register("user-registration-form", UserRegistrationFormController)
    console.log("✅ user-registration-form registered");

  } catch (error) {
    console.error("❌ コントローラー登録エラー:", error);
  }
  console.log("=== CONTROLLERS REGISTERED ===");

  // ReactをグローバルからアクセスできるようにExport
  console.log("=== SETTING GLOBAL VARIABLES ===");
  (window as any).React = React;

  // StimulusをグローバルからアクセスできるようにExport
  (window as any).Stimulus = application;

  // アプリケーション初期化完了ログ
  console.log("=== INITIALIZATION COMPLETE ===");
  console.log("TypeScript Application with React initialized successfully");
  console.log("Stimulus application:", application);
  console.log("Controllers registered successfully");
  console.log("window.Stimulus:", (window as any).Stimulus);

  // デバッグ機能初期化（開発環境のみ）
  if (process.env.NODE_ENV !== 'production') {
    initializeDebug();
  }

  // Pure React コンポーネントの直接マウント
  initializeReactComponents();
}

// Pure React コンポーネントのマウント処理
function initializeReactComponents() {
  // BusinessCardList コンポーネントのマウント
  const businessCardListRoot = document.getElementById('business-card-list-root');
  if (businessCardListRoot) {
    mountBusinessCardList(businessCardListRoot);
  }
}

async function mountBusinessCardList(container: HTMLElement) {
  try {
    const { createRoot } = await import('react-dom/client');
    const { BusinessCardList } = await import('@/components/BusinessCardList');

    const businessCardsData = container.dataset.businessCards;
    const businessCards = businessCardsData ? JSON.parse(businessCardsData) : [];

    const root = createRoot(container);
    root.render(React.createElement(BusinessCardList, { businessCards }));

    console.log('✅ BusinessCardList mounted successfully');
  } catch (error) {
    console.error('❌ BusinessCardList mount failed:', error);
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">コンポーネントの読み込みに失敗しました</h4>
        <p>エラー: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}

// グローバルウィンドウオブジェクトへの型安全なアクセス
declare global {
  interface Window {
    Stimulus: Application;
    React: typeof React;
  }
}

// DOMContentLoadedとturbo:loadイベントで初期化
document.addEventListener('DOMContentLoaded', initializeApplication);
document.addEventListener('turbo:load', initializeApplication);
