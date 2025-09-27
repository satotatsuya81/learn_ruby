// TypeScript型安全なAPIクライアント
// Rails APIとの通信を型安全に行うためのクライアント実装
import { BusinessCard, BusinessCardFormData, BusinessCardSearchParams } from '@/types/BusinessCard';
import { User, UserRegistrationData, UserLoginData, UserUpdateData } from '@/types/user';
import { HttpHeaders } from '@/types/common';

// FormData作成で使用される型の統合型
type FormDataInput = BusinessCardFormData | UserRegistrationData | UserLoginData | UserUpdateData | Record<string, unknown>;
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiError
} from '@/types/api';

// 注意: BusinessCardApiResponse, BusinessCardListApiResponse, UserApiResponse
// これらの型は外部コンポーネントがAPIクライアントを使用する際の型注釈に使用される
// 例: const response: BusinessCardApiResponse = await apiClient.createBusinessCard(data);

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

  // FormDataオブジェクト作成のための共通ヘルパー
  // Rails規約に従ったネストパラメータ形式でFormDataを作成
  private createFormData(data: FormDataInput, prefix = ''): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const fieldName = prefix ? `${prefix}[${key}]` : key;
        formData.append(fieldName, String(value));
      }
    });

    return formData;
  }

  // 型安全なHTTPリクエスト共通メソッド
  // 全てのAPI通信で使用される基盤メソッド
  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      headers?: HttpHeaders;
      body?: BodyInit;
      timeout?: number;
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

    // タイムアウト処理のためのAbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, options.timeout ?? 30000); // デフォルト30秒

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // レスポンスのContent-Typeを確認
        const contentType = response.headers.get('content-type');

        if (contentType !== null && contentType.includes('application/json')) {
          // JSONレスポンスの場合
          const errorResponse = await response.json() as ApiErrorResponse;
          const apiError = new Error(errorResponse.error || 'API request failed') as ApiError;
          apiError.status = response.status;
          if (errorResponse.details) {
            apiError.details = errorResponse.details;
          }
          throw apiError;
        } else {
          // HTMLレスポンスの場合（406 Not Acceptableなど）
          const htmlResponse = await response.text();
          console.error('Non-JSON response received:', htmlResponse);
          const apiError = new Error(`Server error (${response.status}): Expected JSON but received HTML. Please check server configuration.`) as ApiError;
          apiError.status = response.status;
          throw apiError;
        }
      }

      // 成功レスポンスもContent-Typeを確認
      const contentType = response.headers.get('content-type');
      if (contentType === null || !contentType.includes('application/json')) {
        const htmlResponse = await response.text();
        console.error('Non-JSON success response received:', htmlResponse);
        throw new Error('Expected JSON response but received HTML');
      }

      const apiResponse = await response.json() as ApiSuccessResponse<T>;
      return apiResponse.data;
    } catch (error) {
      clearTimeout(timeoutId);

      // タイムアウトエラーの場合
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout') as ApiError;
        timeoutError.status = 408;
        console.error('API Timeout:', timeoutError);
        throw timeoutError;
      }

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

  // 名刺作成API
  // POSTリクエストで新規名刺を作成
  async createBusinessCard(data: BusinessCardFormData): Promise<BusinessCard> {
    const formData = this.createFormData(data, 'business_card');

    return await this.request<BusinessCard>('/business_cards', {
      method: 'POST',
      body: formData,
    });
  }

  // 名刺更新API - FormData統一対応
  // PATCHリクエストで既存名刺を更新
  async updateBusinessCard(id: number, data: BusinessCardFormData): Promise<BusinessCard> {
    const formData = this.createFormData(data, 'business_card');

    return await this.request<BusinessCard>(`/business_cards/${id}`, {
      method: 'PATCH',
      body: formData,
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
    const formData = this.createFormData(data, 'user');

    return await this.request<User>('/users', {
      method: 'POST',
      body: formData,
    });
  }

  // ログインAPI
  // POSTリクエストでセッションを作成
  async loginUser(data: UserLoginData): Promise<User> {
    // remember_me値を文字列に変換してからFormData作成
    const sessionData = {
      email: data.email,
      password: data.password,
      ...(data.remember_me !== undefined && {
        remember_me: data.remember_me ? '1' : '0'
      })
    };

    const formData = this.createFormData(sessionData, 'session');

    return await this.request<User>('/login', {
      method: 'POST',
      body: formData,
    });
  }

  // ユーザープロフィール更新API - FormData統一対応
  // PATCHリクエストで既存ユーザーを更新
  async updateUserProfile(id: number, data: UserUpdateData): Promise<User> {
    const formData = this.createFormData(data, 'user');

    return await this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: formData,
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
