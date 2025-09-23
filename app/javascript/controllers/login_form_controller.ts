import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from "react-dom/client"
import LoginForm from "../components/LoginForm"

// Rails 8 + React 18 + TypeScript統合
// Stimulusコントローラー: ログインフォーム
export default class extends Controller<HTMLElement> {
  static values = {
    loginPath: String,
    newPasswordResetPath: String
  }

  declare readonly loginPathValue: string
  declare readonly newPasswordResetPathValue: string

  connect(): void {
    console.log("=== LoginFormController connected ===")
    console.log("Login path:", this.loginPathValue)
    console.log("Password reset path:", this.newPasswordResetPathValue)

    this.mountReactComponent()
  }

  disconnect(): void {
    console.log("=== LoginFormController disconnected ===")
    // React 18のcreateRootの場合、rootの参照を保持してunmountする必要がある
    // 今回はページ離脱時なので特に処理不要
  }

  private mountReactComponent(): void {
    try {
      console.log("LoginForm component mounting...")

      // React 18の新しいAPI使用
      const root = createRoot(this.element)

      root.render(
        React.createElement(LoginForm, {
          loginPath: this.loginPathValue,
          newPasswordResetPath: this.newPasswordResetPathValue
        })
      )

      console.log("✅ LoginForm mounted successfully")
    } catch (error) {
      console.error("❌ LoginForm mount failed:", error)

      // フォールバック表示
      this.element.innerHTML = `
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading">JavaScript無効モード</h4>
          <p>Reactコンポーネントの読み込みに失敗しました。従来のHTMLフォームでログインしてください。</p>
          <hr>
          <p class="mb-0">ブラウザのJavaScriptが有効になっているかご確認ください。</p>
        </div>
      `
    }
  }
}
