// BusinessCard関連の型定義

// 基本的な名刺情報を表すインターフェース
export interface BusinessCard {
  id: number;
  // 名前（必須）
  name: string;
  // 会社名（必須）
  company_name: string;
  // 部署
  department?: string;
  // 役職
  job_title?: string;
  // メールアドレス
  email?: string;
  // 固定電話
  phone?: string;
  // 携帯電話
  mobile?: string;
  // 住所
  address?: string;
  // ウェブサイト
  website?: string;
  // メモ
  notes?: string;
  // タイトル
  title?: string;
  // 作成日時（必須）
  created_at: string;
  // 更新日時（必須）
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
  // 部署
  department?: string;
  // 役職
  job_title?: string;
  // メールアドレス
  email?: string;
  // 固定電話
  phone?: string;
  // 携帯電話
  mobile?: string;
  // 住所
  address?: string;
  // ウェブサイト
  website?: string;
  // メモ
  notes?: string;
  // タイトル
  title?: string;
}

// 検索パラメータの型
export interface BusinessCardSearchParams {
  // 名前や会社名での検索クエリ
  query?: string;
  // 会社名での絞り込み
  company_name?: string;
  // 部署での絞り込み
  department?: string;
  // 役職での絞り込み
  job_title?: string;
  // 作成日の開始日
  created_from?: string;
  // 作成日の終了日
  created_to?: string;
}
