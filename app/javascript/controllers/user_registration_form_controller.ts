import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from "react-dom/client"
import UserRegistrationForm from "@/components/UserRegistrationForm"

// Rails 8 + React 18 + TypeScript統合
// Stimulusコントローラー: ユーザー登録フォーム
export default class extends Controller<HTMLElement> {
  static values = {
    signupPath: String,
    loginPath: String
  }

  declare readonly signupPathValue: string
  declare readonly loginPathValue: string

  connect(): void {
    console.log("=== UserRegistrationFormController connected ===")
    console.log("Signup path:", this.signupPathValue)
    console.log("Login path:", this.loginPathValue)

    this.mountReactComponent()
  }

  disconnect(): void {
    console.log("=== UserRegistrationFormController disconnected ===")
    // React 18のcreateRootの場合、rootの参照を保持してunmountする必要がある
    // 今回はページ離脱時なので特に処理不要
  }

  private mountReactComponent(): void {
    try {
      console.log("UserRegistrationForm component mounting...")

      const root = createRoot(this.element)

      root.render(
        React.createElement(UserRegistrationForm, {
          signupPath: this.signupPathValue,
          loginPath: this.loginPathValue
        })
      )

      console.log("✅ UserRegistrationForm mounted successfully")
    } catch (error) {
      console.error("❌ UserRegistrationForm mount failed:", error)

      // フォールバック表示
      this.element.innerHTML = `
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading">JavaScript無効モード</h4>
          <p>Reactコンポーネントの読み込みに失敗しました。従来のHTMLフォームでユーザー登録してください。</p>
          <hr>
          <p class="mb-0">ブラウザのJavaScriptが有効になっているかご確認ください。</p>
        </div>
      `
    }
  }
}
