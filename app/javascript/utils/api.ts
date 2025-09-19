// TypeScript型安全なAPIクライアント
// Rails APIとの通信を型安全に行うためのクライアント実装
import { BusinessCard, BusinessCardFormData, BusinessCardSearchParams } from '@/types/BusinessCard';

// API通信の標準レスポンス型
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// APIエラーレスポンス型
interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

// 型安全なAPIクライアントクラス
class ApiClient {
  private baseUrl: string;
  private csrfToken: string;

  constructor() {
    // Rails API v1エンドポイントのベースURL
    this.baseUrl = '/api/v1';
    // Rails CSRFトークンを取得
    this.csrfToken = this.getCSRFToken();
  }

  // HTMLヘッダーからCSRFトークンを取得
  // Railsが自動生成するCSRFトークンを読み取り
  private getCSRFToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta !== null ? (meta as HTMLMetaElement).content : '';
  }

  // 型安全なHTTPリクエスト共通メソッド
  // 全てのAPI通信で使用される基盤メソッド
  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: BodyInit;
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.csrfToken,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw new Error(error.error || 'API request failed');
      }

      const data = await response.json() as T;
      return { data, success: true };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // 名刺一覧取得API - 検索パラメータ対応
  // GETリクエストで名刺データを型安全に取得
  async getBusinessCards(params?: BusinessCardSearchParams): Promise<BusinessCard[]> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const endpoint = `/business_cards${queryString ? `?${queryString}` : ''}`;
    const response = await this.request<BusinessCard[]>(endpoint);
    return response.data;
  }

  // 単一名刺取得API
  // 指定されたIDの名刺データを型安全に取得
  async getBusinessCard(id: number): Promise<BusinessCard> {
    const response = await this.request<BusinessCard>(`/business_cards/${id}`);
    return response.data;
  }

    // 名刺作成API - FormData対応
  // POSTリクエストで新規名刺を作成
  async createBusinessCard(data: BusinessCardFormData): Promise<BusinessCard> {
    const formData = new FormData();

    // フォームデータを適切にFormDataオブジェクトに変換
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(`business_card[${key}]`, String(value));
      }
    });

    // FormData使用時はContent-Typeヘッダーを設定しない（ブラウザが自動設定）
    const headers: Record<string, string> = {
      'X-CSRF-Token': this.csrfToken,
    };

    const response = await this.request<BusinessCard>('/business_cards', {
      method: 'POST',
      body: formData,
      headers,
    });
    return response.data;
  }

  // 名刺更新API
  // PATCHリクエストで既存名刺を更新
  async updateBusinessCard(id: number, data: BusinessCardFormData): Promise<BusinessCard> {
    const response = await this.request<BusinessCard>(`/business_cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ business_card: data }),
    });
    return response.data;
  }

  // 名刺削除API
  // DELETEリクエストで名刺を削除
  async deleteBusinessCard(id: number): Promise<void> {
    await this.request<void>(`/business_cards/${id}`, {
      method: 'DELETE',
    });
  }
}

// シングルトンインスタンスをエクスポート
// アプリケーション全体で共通のAPIクライアントを使用
export const apiClient = new ApiClient();

export const deleteBusinessCard = (id: number): Promise<void> => {
  return apiClient.deleteBusinessCard(id);
};

export const getBusinessCards = (params?: BusinessCardSearchParams): Promise<BusinessCard[]> => {
  return apiClient.getBusinessCards(params);
};

export const getBusinessCard = (id: number): Promise<BusinessCard> => {
  return apiClient.getBusinessCard(id);
};

export const createBusinessCard = (data: BusinessCardFormData): Promise<BusinessCard> => {
  return apiClient.createBusinessCard(data);
};

export const updateBusinessCard = (id: number, data: BusinessCardFormData): Promise<BusinessCard> => {
  return apiClient.updateBusinessCard(id, data);
};
