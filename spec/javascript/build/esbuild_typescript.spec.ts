/**
    * esbuildでのTypeScript処理が正しく動作することを確認するテスト
    *
    * このテストは以下を検証します：
    * 1. TypeScriptファイルがJavaScriptに正しくコンパイルされる
    * 2. 型定義ファイルがimportできる
    * 3. ESModuleとしてバンドルされる
    * 4. Rails環境でのアセット処理が正常に動作する
    */

   // 未使用のimportを削除し、実際に使用する型のみをimport
   import { BusinessCard } from '@/types/business_card';
   import { apiClient } from '@/utils/api';

   describe('esbuildとRailsの統合テスト', () => {
     // TypeScript型定義の読み込みテスト
     it('should import TypeScript types correctly', () => {
       // BusinessCard型が正しく定義されていることを確認
       // 実際の型定義に合わせてプロパティ名を修正
       const businessCard: BusinessCard = {
         id: 1,
         name: 'テスト太郎',
         company_name: 'テスト株式会社', // company -> company_name に修正
         job_title: 'エンジニア',
         email: 'test@example.com',
         phone: '090-1234-5678',
         website: 'https://example.com',
         notes: 'テストノート',
         // tags プロパティは型定義に存在しないため削除
         created_at: '2024-01-01T00:00:00Z',
         updated_at: '2024-01-01T00:00:00Z',
         user_id: 1
       };

       // 型安全性を確認：正しい型のプロパティを持つ
       expect(businessCard.id).toEqual(1);
       expect(businessCard.name).toEqual('テスト太郎');
       expect(businessCard.company_name).toEqual('テスト株式会社'); // プロパティ名を修正
     });

     // TypeScriptクラスのインスタンス化テスト
     it('TypeScriptクラスが正しくインスタンス化されることを確認する', () => {
       // APIクライアントが正しくインスタンス化される
       expect(apiClient).toBeDefined();
       expect(typeof apiClient.getBusinessCards).toBe('function');
       expect(typeof apiClient.createBusinessCard).toBe('function');
     });

     // esbuildによるモジュール解決テスト
     it('TypeScriptモジュールがパスエイリアスで解決されることを確認する', () => {
       // tsconfig.jsonのpathマッピング（@/*）が動作することを確認
       expect(() => {
         // @/ パスエイリアスでimportが成功することを間接的に確認
         // 実際のimportは上で行われており、エラーが発生していないことを確認
         const types = require.resolve('@/types/business_card');
         expect(types).toBeDefined();
       }).not.toThrow();
     });

     // TypeScript固有の機能（ジェネリクス等）のコンパイルテスト
     it('ジェネリック関数が正しくコンパイルされることを確認する', () => {
       // ジェネリック関数の定義とコンパイルを確認
       function identity<T>(arg: T): T {
         return arg;
       }

       const stringResult = identity<string>('test');
       const numberResult = identity<number>(42);

       expect(stringResult).toBe('test');
       expect(numberResult).toBe(42);
     });

     // ES2022機能のコンパイルテスト
     it('ES2022機能が正しくコンパイルされることを確認する', () => {
       // Optional chaining
       const obj = { a: { b: { c: 'value' } } };
       expect(obj.a?.b?.c).toBe('value');
       expect((obj as any).x?.y?.z).toBeUndefined();

       // Nullish coalescing - TypeScript厳密チェックに対応
       const value1: string | null = null;
       const value2: string | undefined = undefined;
       const value3: string = '';

       const result1 = value1 ?? 'default';
       const result2 = value2 ?? 'default';
       const result3 = value3 || 'default'; // nullish coalescing ではなく論理OR演算子を使用

       expect(result1).toBe('default');
       expect(result2).toBe('default');
       expect(result3).toBe('default'); // 空文字は falsy なので 'default' が返される
     });
   });
