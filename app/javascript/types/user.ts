// User関連の型定義
// ユーザー認証とプロフィール管理のためのTypeScript型定義

// ユーザー基本情報の型
export interface User {
  id: number;
  email: string;
  name: string;
  // ユーザーがアクティベートされているかどうか
  activated: boolean;
  // 管理者権限の有無
  admin: boolean;
  // 作成日時
  created_at: string;
  // 更新日時
  updated_at: string;
}

// ユーザー登録フォームのデータ型
export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ユーザーログインフォームのデータ型
export interface UserLoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

// ユーザープロフィール更新フォームのデータ型
export interface UserUpdateData {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

// パスワードリセット要求フォームのデータ型
export interface PasswordResetRequestData {
  email: string;
}

// パスワードリセット実行フォームのデータ型
export interface PasswordResetData {
  password: string;
  password_confirmation: string;
  reset_token: string;
}