// BusinessCard関連の型定義
// RailsのBusinessCardモデルと厳密に一致する型構造を定義

// 基本的な名刺情報を表すインターフェース
// データベーススキーマとBusinessCardモデルに厳密に基づく型定義
export interface BusinessCard {
  // データベースの主キー（必須）
  id: number;
  // 名前（必須）
  name: string;
  // 会社名（必須）- データベースフィールド名
  company_name: string;
  // 部署（オプショナル）
  department?: string;
  // 役職（オプショナル）
  job_title?: string;
  // メールアドレス（オプショナル）
  email?: string;
  // 固定電話（オプショナル）
  phone?: string;
  // 携帯電話（オプショナル）
  mobile?: string;
  // 住所（オプショナル）
  address?: string;
  // ウェブサイト（オプショナル）
  website?: string;
  // メモ（オプショナル）
  notes?: string;
  // タイトル（オプショナル）- 現在のスキーマに存在
  title?: string;
  // 作成日時（ISO形式文字列、必須）
  created_at: string;
  // 更新日時（ISO形式文字列、必須）
  updated_at: string;
  // 所有者のユーザーID（必須）
  user_id: number;
}

// フォーム送信用のデータ型
// データベースのIDや日時フィールドは含まない
// Railsモデルのバリデーションと厳密に一致
export interface BusinessCardFormData {
  // 名前（必須）
  name: string;
  // 会社名（必須）- データベースフィールド名
  company_name: string;
  // 部署（オプショナル）
  department?: string;
  // 役職（オプショナル）
  job_title?: string;
  // メールアドレス（オプショナル）
  email?: string;
  // 固定電話（オプショナル）
  phone?: string;
  // 携帯電話（オプショナル）
  mobile?: string;
  // 住所（オプショナル）
  address?: string;
  // ウェブサイト（オプショナル）
  website?: string;
  // メモ（オプショナル）
  notes?: string;
  // タイトル（オプショナル）
  title?: string;
}

// 検索パラメータの型
// 全てのフィールドがオプショナル（フィルタリング用）
// 現在実装されている検索機能のみ含む
export interface BusinessCardSearchParams {
  // 名前や会社名での検索クエリ（オプショナル）
  query?: string;
  // 会社名での絞り込み（オプショナル）- データベースフィールド名
  company_name?: string;
  // 部署での絞り込み（オプショナル）
  department?: string;
  // 役職での絞り込み（オプショナル）
  job_title?: string;
  // 作成日の開始日（オプショナル、YYYY-MM-DD形式）
  created_from?: string;
  // 作成日の終了日（オプショナル、YYYY-MM-DD形式）
  created_to?: string;
}
