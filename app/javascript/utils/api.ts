// TypeScript型安全なAPIクライアント
// Rails APIとの通信を型安全に行うためのクライアント実装
import { BusinessCard, BusinessCardFormData, BusinessCardSearchParams } from '@/types/BusinessCard';
import { User, UserRegistrationData, UserLoginData, UserUpdateData } from '@/types/user';
import { HttpHeaders } from '@/types/common';

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

  constructor() {
    // Rails APIエンドポイントのベースURL（標準RESTfulルート）
    this.baseUrl = '';
  }

  // HTMLヘッダーからCSRFトークンを取得
  // Railsが自動生成するCSRFトークンを読み取り
  private getCSRFToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return meta?.content || '';
  }

  // 型安全なHTTPリクエスト共通メソッド
  // 全てのAPI通信で使用される基盤メソッド
  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      headers?: HttpHeaders;
      body?: BodyInit;
    } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    // CSRFトークンを毎回取得（詳細画面の成功パターンに合わせる）
    const csrfToken = this.getCSRFToken();
    const headers: HttpHeaders = {
      'X-CSRF-Token': csrfToken,
      'Accept': 'application/json',
      ...options.headers,
    };

    // FormDataでない場合のみContent-Typeを設定
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // レスポンスのContent-Typeを確認
        const contentType = response.headers.get('content-type');

        if (contentType !== null && contentType.includes('application/json')) {
          // JSONレスポンスの場合
          const error = await response.json() as ApiError;
          throw new Error(error.error || 'API request failed');
        } else {
          // HTMLレスポンスの場合（406 Not Acceptableなど）
          const htmlResponse = await response.text();
          console.error('Non-JSON response received:', htmlResponse);
          throw new Error(`Server error (${response.status}): Expected JSON but received HTML. Please check server configuration.`);
        }
      }

      // 成功レスポンスもContent-Typeを確認
      const contentType = response.headers.get('content-type');
      if (contentType === null || !contentType.includes('application/json')) {
        const htmlResponse = await response.text();
        console.error('Non-JSON success response received:', htmlResponse);
        throw new Error('Expected JSON response but received HTML');
      }

      const apiResponse = await response.json() as ApiResponse<T>;
      return apiResponse.data;
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
    return await this.request<BusinessCard[]>(endpoint);
  }

  // 単一名刺取得API
  // 指定されたIDの名刺データを型安全に取得
  async getBusinessCard(id: number): Promise<BusinessCard> {
    return await this.request<BusinessCard>(`/business_cards/${id}`);
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

    return await this.request<BusinessCard>('/business_cards', {
      method: 'POST',
      body: formData,
    });
  }

  // 名刺更新API
  // PATCHリクエストで既存名刺を更新
  async updateBusinessCard(id: number, data: BusinessCardFormData): Promise<BusinessCard> {
    return await this.request<BusinessCard>(`/business_cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ business_card: data }),
    });
  }

  // 名刺削除API
  // DELETEリクエストで名刺を削除
  async deleteBusinessCard(id: number): Promise<void> {
    await this.request<void>(`/business_cards/${id}`, {
      method: 'DELETE',
    });
  }

  // ユーザー登録API
  // POSTリクエストで新規ユーザーを作成
  async createUser(data: UserRegistrationData): Promise<User> {
    const formData = new FormData();
    formData.append('user[name]', data.name);
    formData.append('user[email]', data.email);
    formData.append('user[password]', data.password);
    formData.append('user[password_confirmation]', data.password_confirmation);

    return await this.request<User>('/users', {
      method: 'POST',
      body: formData,
    });
  }

  // ログインAPI
  // POSTリクエストでセッションを作成
  async loginUser(data: UserLoginData): Promise<User> {
    const formData = new FormData();
    formData.append('session[email]', data.email);
    formData.append('session[password]', data.password);
    if (data.remember_me !== undefined) {
      // remember_meの値は"1"または何も送信しない形式に変更
      formData.append('session[remember_me]', data.remember_me ? '1' : '0');
    }

    return await this.request<User>('/login', {
      method: 'POST',
      body: formData,
    });
  }

  // ユーザープロフィール更新API
  // PATCHリクエストで既存ユーザーを更新
  async updateUserProfile(id: number, data: UserUpdateData): Promise<User> {
    return await this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ user: data }),
    });
  }

  // 現在のユーザー情報取得API
  // GETリクエストで現在ログイン中のユーザー情報を取得
  async getCurrentUser(): Promise<User> {
    return await this.request<User>('/current_user');
  }
}

// シングルトンインスタンスをエクスポート
// アプリケーション全体で共通のAPIクライアントを使用
export const apiClient = new ApiClient();

export const deleteBusinessCard = (id: number): Promise<void> => {
  console.log("Deleting business card with ID:", id);
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

// ユーザー関連のエクスポート関数
export const createUser = (data: UserRegistrationData): Promise<User> => {
  return apiClient.createUser(data);
};

export const loginUser = (data: UserLoginData): Promise<User> => {
  return apiClient.loginUser(data);
};

export const updateUserProfile = (id: number, data: UserUpdateData): Promise<User> => {
  return apiClient.updateUserProfile(id, data);
};

export const getCurrentUser = (): Promise<User> => {
  return apiClient.getCurrentUser();
};
