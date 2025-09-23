// BusinessCard型定義の型安全性テスト
// 現在実装されている型定義のみをテスト

import { BusinessCard, BusinessCardFormData, BusinessCardSearchParams } from '../../../app/javascript/types/BusinessCard';

describe('BusinessCard型定義', () => {
  describe('BusinessCard インターフェース', () => {
    test('必須フィールドが正しく定義されている', () => {
      // このテストは型レベルでのチェック
      // 実際のオブジェクトを作成して型の制約を確認
      const validBusinessCard: BusinessCard = {
        id: 1,
        name: '田中太郎',
        company_name: '株式会社サンプル',
        department: '営業部',
        job_title: '部長',
        email: 'tanaka@sample.co.jp',
        phone: '03-1234-5678',
        mobile: '090-1234-5678',
        address: '東京都渋谷区',
        website: 'https://sample.co.jp',
        notes: '重要なクライアント',
        title: '営業部長',
        created_at: '2025-09-18T00:00:00Z',
        updated_at: '2025-09-18T00:00:00Z',
        user_id: 1
      };

      // 型チェック: 必須フィールドのみで作成可能か
      const minimalBusinessCard: BusinessCard = {
        id: 2,
        name: '佐藤花子',
        company_name: '合同会社テスト',
        created_at: '2025-09-18T00:00:00Z',
        updated_at: '2025-09-18T00:00:00Z',
        user_id: 1
      };

      expect(validBusinessCard.name).toBe('田中太郎');
      expect(minimalBusinessCard.name).toBe('佐藤花子');
    });

    test('オプショナルフィールドがundefinedを許可する', () => {
      const businessCardWithoutOptionals: BusinessCard = {
        id: 3,
        name: '山田次郎',
        company_name: '個人事業主',
        created_at: '2025-09-18T00:00:00Z',
        updated_at: '2025-09-18T00:00:00Z',
        user_id: 1
        // department, job_title, email, phone, mobile, address, website, notes, title は未定義
      };

      expect(businessCardWithoutOptionals.department).toBeUndefined();
      expect(businessCardWithoutOptionals.job_title).toBeUndefined();
      expect(businessCardWithoutOptionals.email).toBeUndefined();
      expect(businessCardWithoutOptionals.phone).toBeUndefined();
      expect(businessCardWithoutOptionals.mobile).toBeUndefined();
    });
  });

  describe('BusinessCardFormData インターフェース', () => {
    test('フォーム用データ型が正しく定義されている', () => {
      const formData: BusinessCardFormData = {
        name: '新規名刺',
        company_name: '新規会社',
        department: '開発部',
        job_title: '担当者',
        email: 'new@company.co.jp',
        phone: '03-9999-9999',
        mobile: '090-1234-5678',
        address: '東京都新宿区',
        website: 'https://new-company.co.jp',
        notes: 'フォームから入力',
        title: '開発担当'
      };

      expect(formData.name).toBe('新規名刺');
      expect(formData.company_name).toBe('新規会社');
      expect(formData.department).toBe('開発部');
    });

    test('最小限のフォームデータで作成可能', () => {
      const minimalFormData: BusinessCardFormData = {
        name: '最小名刺',
        company_name: '最小会社'
        // 他の全フィールドはオプショナル
      };

      expect(minimalFormData.name).toBe('最小名刺');
      expect(minimalFormData.company_name).toBe('最小会社');
      expect(minimalFormData.department).toBeUndefined();
      expect(minimalFormData.job_title).toBeUndefined();
    });
  });

  describe('BusinessCardSearchParams インターフェース', () => {
    test('検索パラメータ型が正しく定義されている', () => {
      const searchParams: BusinessCardSearchParams = {
        query: '田中',
        company_name: 'サンプル',
        department: '営業部',
        job_title: '部長',
        created_from: '2025-01-01',
        created_to: '2025-12-31'
      };

      expect(searchParams.query).toBe('田中');
      expect(searchParams.company_name).toBe('サンプル');
      expect(searchParams.department).toBe('営業部');
    });

    test('空の検索パラメータも有効', () => {
      const emptySearchParams: BusinessCardSearchParams = {};

      expect(emptySearchParams.query).toBeUndefined();
      expect(emptySearchParams.company_name).toBeUndefined();
      expect(emptySearchParams.department).toBeUndefined();
    });
  });
});
