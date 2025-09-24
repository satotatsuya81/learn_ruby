import { apiClient } from '@/utils/api';
import { BusinessCard, BusinessCardFormData } from '@/types/BusinessCard';
import { User, UserRegistrationData, UserLoginData, UserUpdateData } from '@/types/user';
import { ApiError } from '@/types/api';

// テスト用のモック設定
describe('ApiClient', () => {
  // 各テストの前にfetchをモック化
  beforeEach(() => {
    // fetchのグローバルモック
    global.fetch = jest.fn();

    // CSRFトークンのモック - document.querySelectorをモック化
    const mockElement = {
      content: 'test-csrf-token'
    } as HTMLMetaElement;

    jest.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
      if (selector === 'meta[name="csrf-token"]') {
        return mockElement;
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getBusinessCards', () => {
    it('正常なレスポンスでBusinessCard配列を返す', async () => {
      // テスト用のBusinessCardデータ
      const mockBusinessCards: BusinessCard[] = [
        {
          id: 1,
          name: '田中太郎',
          company_name: '株式会社テスト',
          job_title: 'エンジニア',
          email: 'tanaka@test.com',
          phone: '090-1234-5678',
          website: 'https://test.com',
          notes: 'テストノート',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          user_id: 1
        }
      ];

      // fetchのレスポンスをモック
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValueOnce({ data: mockBusinessCards, success: true })
      });

      // APIクライアントのメソッドを呼び出し
      const result = await apiClient.getBusinessCards();

      // 期待する結果の検証
      expect(result).toEqual(mockBusinessCards);
      expect(global.fetch).toHaveBeenCalledWith(
        '/business_cards',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'test-csrf-token'
          })
        })
      );
    });

    it('検索パラメータ付きでAPIを呼び出す', async () => {
      const mockBusinessCards: BusinessCard[] = [];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValueOnce({ data: mockBusinessCards, success: true })
      });

      const searchParams = {
        query: '田中',
        company_name: 'テスト'
      };

      await apiClient.getBusinessCards(searchParams);

      expect(global.fetch).toHaveBeenCalledWith(
        '/business_cards?query=%E7%94%B0%E4%B8%AD&company_name=%E3%83%86%E3%82%B9%E3%83%88',
        expect.any(Object)
      );
    });
  });

  describe('createBusinessCard', () => {
    it('FormDataを使用してPOSTリクエストを送信する', async () => {
      const mockFormData: BusinessCardFormData = {
        name: '佐藤花子',
        company_name: '株式会社新規',
        job_title: 'デザイナー',
        email: 'sato@new.com'
      };

      const mockCreatedCard: BusinessCard = {
        id: 2,
        name: '佐藤花子',
        company_name: '株式会社新規',
        job_title: 'デザイナー',
        email: 'sato@new.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        user_id: 1
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValueOnce({ data: mockCreatedCard, success: true })
      });

      const result = await apiClient.createBusinessCard(mockFormData);

      expect(result).toEqual(mockCreatedCard);
      expect(global.fetch).toHaveBeenCalledWith(
        '/business_cards',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          headers: expect.objectContaining({
            'X-CSRF-Token': 'test-csrf-token',
            'Accept': 'application/json'
          })
        })
      );

      // Content-Typeが設定されていないことを確認（FormDataの場合）
      const call = (global.fetch as jest.Mock).mock.calls[0];
      expect(call[1].headers['Content-Type']).toBeUndefined();
    });
  });

  describe('エラーハンドリング', () => {
    it('HTTPエラーレスポンスで適切なエラーを投げる', async () => {
      // テスト中のconsole.errorを一時的に抑制
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValueOnce({
          error: 'バリデーションエラー',
          details: { name: ['名前は必須です'] }
        })
      });

      await expect(apiClient.getBusinessCards()).rejects.toThrow('バリデーションエラー');

      // console.errorのモックを復元
      consoleSpy.mockRestore();
    });

    it('ネットワークエラーで適切なエラーを投げる', async () => {
      // テスト中のconsole.errorを一時的に抑制
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ネットワークエラー'));

      await expect(apiClient.getBusinessCards()).rejects.toThrow('ネットワークエラー');

      // console.errorのモックを復元
      consoleSpy.mockRestore();
    });

    it('タイムアウトエラーで適切なApiErrorを投げる', async () => {
      // テスト中のconsole.errorを一時的に抑制
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // AbortErrorをシミュレート
      const abortError = new Error('The user aborted a request');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);

      try {
        await apiClient.getBusinessCards();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as ApiError).message).toBe('Request timeout');
        expect((error as ApiError).status).toBe(408);
      }

      // console.errorのモックを復元
      consoleSpy.mockRestore();
    });
  });

  describe('型定義の検証', () => {
    it('BusinessCardApiResponseの型が正しく動作する', async () => {
      const mockBusinessCard: BusinessCard = {
        id: 1,
        name: '田中太郎',
        company_name: '株式会社テスト',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        user_id: 1
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValueOnce({ data: mockBusinessCard, success: true })
      });

      const result = await apiClient.getBusinessCard(1);

      // TypeScriptの型チェックが実行時に適用されることを確認
      expect(result).toEqual(mockBusinessCard);
      expect(typeof result.id).toBe('number');
      expect(typeof result.name).toBe('string');
      expect(typeof result.company_name).toBe('string');
    });

    it('UserApiResponseの型が正しく動作する', async () => {
      const mockUser: User = {
        id: 1,
        name: '田中太郎',
        email: 'tanaka@example.com',
        activated: true,
        admin: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValueOnce({ data: mockUser, success: true })
      });

      const result = await apiClient.getCurrentUser();

      // TypeScriptの型チェックが実行時に適用されることを確認
      expect(result).toEqual(mockUser);
      expect(typeof result.id).toBe('number');
      expect(typeof result.name).toBe('string');
      expect(typeof result.email).toBe('string');
    });
  });

  describe('ユーザー関連API', () => {
    describe('createUser', () => {
      it('FormDataを使用してユーザー登録のPOSTリクエストを送信する', async () => {
        const mockUserData: UserRegistrationData = {
          name: '田中太郎',
          email: 'tanaka@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        };

        const mockCreatedUser: User = {
          id: 1,
          name: '田中太郎',
          email: 'tanaka@example.com',
          activated: true,
          admin: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json')
          },
          json: jest.fn().mockResolvedValueOnce({ data: mockCreatedUser, success: true })
        });

        const result = await apiClient.createUser(mockUserData);

        expect(result).toEqual(mockCreatedUser);
        expect(global.fetch).toHaveBeenCalledWith(
          '/users',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
            headers: expect.objectContaining({
              'X-CSRF-Token': 'test-csrf-token',
              'Accept': 'application/json'
            })
          })
        );

        // FormDataの内容を確認
        const call = (global.fetch as jest.Mock).mock.calls[0];
        const formData = call[1].body as FormData;
        expect(formData.get('user[name]')).toBe('田中太郎');
        expect(formData.get('user[email]')).toBe('tanaka@example.com');
        expect(formData.get('user[password]')).toBe('password123');
        expect(formData.get('user[password_confirmation]')).toBe('password123');
      });
    });

    describe('loginUser', () => {
      it('FormDataを使用してログインのPOSTリクエストを送信する', async () => {
        const mockLoginData: UserLoginData = {
          email: 'tanaka@example.com',
          password: 'password123',
          remember_me: true
        };

        const mockUser: User = {
          id: 1,
          name: '田中太郎',
          email: 'tanaka@example.com',
          activated: true,
          admin: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json')
          },
          json: jest.fn().mockResolvedValueOnce({ data: mockUser, success: true })
        });

        const result = await apiClient.loginUser(mockLoginData);

        expect(result).toEqual(mockUser);
        expect(global.fetch).toHaveBeenCalledWith(
          '/login',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
            headers: expect.objectContaining({
              'X-CSRF-Token': 'test-csrf-token',
              'Accept': 'application/json'
            })
          })
        );

        // FormDataの内容を確認
        const call = (global.fetch as jest.Mock).mock.calls[0];
        const formData = call[1].body as FormData;
        expect(formData.get('session[email]')).toBe('tanaka@example.com');
        expect(formData.get('session[password]')).toBe('password123');
        expect(formData.get('session[remember_me]')).toBe('1');
      });
    });

    describe('updateUserProfile', () => {
      it('FormDataを使用してユーザープロフィールのPATCHリクエストを送信する', async () => {
        const mockUpdateData: UserUpdateData = {
          name: '田中太郎（更新）',
          email: 'tanaka_updated@example.com'
        };

        const mockUpdatedUser: User = {
          id: 1,
          name: '田中太郎（更新）',
          email: 'tanaka_updated@example.com',
          activated: true,
          admin: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T01:00:00Z'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json')
          },
          json: jest.fn().mockResolvedValueOnce({ data: mockUpdatedUser, success: true })
        });

        const result = await apiClient.updateUserProfile(1, mockUpdateData);

        expect(result).toEqual(mockUpdatedUser);
        expect(global.fetch).toHaveBeenCalledWith(
          '/users/1',
          expect.objectContaining({
            method: 'PATCH',
            body: expect.any(FormData),
            headers: expect.objectContaining({
              'X-CSRF-Token': 'test-csrf-token',
              'Accept': 'application/json'
            })
          })
        );

        // FormDataの内容を確認
        const call = (global.fetch as jest.Mock).mock.calls[0];
        const formData = call[1].body as FormData;
        expect(formData.get('user[name]')).toBe('田中太郎（更新）');
        expect(formData.get('user[email]')).toBe('tanaka_updated@example.com');

        // Content-Typeが設定されていないことを確認（FormDataの場合）
        expect(call[1].headers['Content-Type']).toBeUndefined();
      });
    });

    describe('getCurrentUser', () => {
      it('現在のユーザー情報を取得するGETリクエストを送信する', async () => {
        const mockCurrentUser: User = {
          id: 1,
          name: '田中太郎',
          email: 'tanaka@example.com',
          activated: true,
          admin: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json')
          },
          json: jest.fn().mockResolvedValueOnce({ data: mockCurrentUser, success: true })
        });

        const result = await apiClient.getCurrentUser();

        expect(result).toEqual(mockCurrentUser);
        expect(global.fetch).toHaveBeenCalledWith(
          '/current_user',
          expect.objectContaining({
            headers: expect.objectContaining({
              'X-CSRF-Token': 'test-csrf-token',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });
  });
});
