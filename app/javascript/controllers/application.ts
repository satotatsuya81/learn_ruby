// TypeScript版 Stimulus Application コントローラー
// Rails標準のStimulusフレームワークをTypeScript化

import { Application } from "@hotwired/stimulus";

// Stimulusアプリケーションの作成と初期化
const application = Application.start();

// TypeScript環境での型安全なStimulus設定
export { application };