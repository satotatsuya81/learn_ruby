// API通信関連の型定義
// Rails APIとの型安全な通信のためのTypeScript型定義

// 基本的なAPIレスポンス型
export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

// API成功レスポンス - ジェネリクスでデータ型を指定
export interface ApiSuccessResponse<T> extends BaseApiResponse {
  data: T;
  success: true;
  meta?: PaginationMeta;
}

// ページネーションメタデータの型
export interface PaginationMeta {
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

// API エラーレスポンス
export interface ApiErrorResponse extends BaseApiResponse {
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

// 詳細なページネーション情報の型（レスポンス用）
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

// ===== Resource-specific API types =====

// BusinessCard用のAPIレスポンス型
import type { BusinessCard } from '@/types/BusinessCard';
import type { User } from '@/types/user';

export type BusinessCardApiResponse = ApiSuccessResponse<BusinessCard>;
export type BusinessCardListApiResponse = ApiSuccessResponse<BusinessCard[]>;

// User用のAPIレスポンス型
export type UserApiResponse = ApiSuccessResponse<User>;

// Collection API用のページネーション付きレスポンス型
export interface PaginatedApiResponse<T> extends ApiSuccessResponse<T[]> {
  meta: PaginationInfo;
}