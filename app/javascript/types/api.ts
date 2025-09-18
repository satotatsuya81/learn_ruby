// API通信関連の型定義
// Rails APIとの型安全な通信のためのTypeScript型定義

// 標準的なAPI成功レスポンス
export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

// 標準的なAPIエラーレスポンス
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[]>;
  status_code?: number;
}

// APIレスポンスの共通型
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// HTTPメソッドの型定義
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// API設定オプションの型
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: BodyInit;
  timeout?: number;
}

// ページネーション情報の型
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

// 検索とフィルタリングの基本パラメータ
export interface SearchParams {
  query?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

// APIエラーハンドリングのための型
export interface ApiError extends Error {
  status?: number;
  details?: Record<string, string[]>;
}