import {
    validateEmail,
    validatePhone,
    validateWebsite,
    validateRequiredField,
    validateBusinessCardForm
  } from '../../../app/javascript/utils/validation';
  import { BusinessCardFormData } from '../../../app/javascript/types/BusinessCard';

  describe('バリデーションユーティリティ', () => {
    describe('validateEmail', () => {
      it('有効なメールアドレスの場合はtrueを返す', () => {
        // 有効なメールアドレスのテストケース
        expect(validateEmail('test@example.com').isValid).toBe(true);
        expect(validateEmail('user.name@domain.co.jp').isValid).toBe(true);
        expect(validateEmail('123@test-domain.org').isValid).toBe(true);
      });

      it('無効なメールアドレスの場合はfalseとエラーメッセージを返す', () => {
        // 無効なメールアドレスのテストケース
        const result = validateEmail('invalid-email');
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('有効なメールアドレスを入力してください');
      });

      it('空文字列の場合は有効とする（オプショナルフィールドのため）', () => {
        const result = validateEmail('');
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    describe('validatePhone', () => {
      it('有効な電話番号の場合はtrueを返す', () => {
        // 日本の電話番号形式をサポート
        expect(validatePhone('03-1234-5678').isValid).toBe(true);
        expect(validatePhone('090-1234-5678').isValid).toBe(true);
        expect(validatePhone('0312345678').isValid).toBe(true);
      });

      it('無効な電話番号の場合はfalseとエラーメッセージを返す', () => {
        const result = validatePhone('123');
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('有効な電話番号を入力してください');
      });
    });

    describe('validateWebsite', () => {
      it('有効なURLの場合はtrueを返す', () => {
        expect(validateWebsite('https://example.com').isValid).toBe(true);
        expect(validateWebsite('http://test.co.jp').isValid).toBe(true);
        expect(validateWebsite('https://subdomain.example.com/path').isValid).toBe(true);
      });

      it('無効なURLの場合はfalseとエラーメッセージを返す', () => {
        const result = validateWebsite('not-a-url');
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('有効なURLを入力してください');
      });
    });

    describe('validateRequiredField', () => {
      it('値が存在する場合はtrueを返す', () => {
        expect(validateRequiredField('田中太郎', '名前').isValid).toBe(true);
        expect(validateRequiredField('株式会社テスト', '会社名').isValid).toBe(true);
      });

      it('空文字列やnullの場合はfalseとエラーメッセージを返す', () => {
        const result1 = validateRequiredField('', '名前');
        expect(result1.isValid).toBe(false);
        expect(result1.message).toBe('名前は必須です');

        const result2 = validateRequiredField(null, '会社名');
        expect(result2.isValid).toBe(false);
        expect(result2.message).toBe('会社名は必須です');
      });
    });

    describe('validateBusinessCardForm', () => {
      const validFormData: BusinessCardFormData = {
        name: '田中太郎',
        company_name: '株式会社テスト',
        job_title: 'エンジニア',
        email: 'tanaka@test.co.jp',
        phone: '03-1234-5678',
        website: 'https://test.co.jp',
        notes: 'テストメモ'
      };

      it('すべてのフィールドが有効な場合はtrueを返す', () => {
        const result = validateBusinessCardForm(validFormData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
      });

      it('必須フィールドが不足している場合はfalseとエラー詳細を返す', () => {
        const invalidFormData: BusinessCardFormData = {
          name: '', // 必須フィールドが空
          company_name: '', // 必須フィールドが空
        };

        const result = validateBusinessCardForm(invalidFormData);
        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBe('名前は必須です');
        expect(result.errors.company_name).toBe('会社名は必須です');
      });

      it('オプショナルフィールドが無効な場合はエラーを返す', () => {
        const invalidFormData: BusinessCardFormData = {
          name: '田中太郎',
          company_name: '株式会社テスト',
          email: 'invalid-email', // 無効なメール
          phone: '123', // 無効な電話番号
          website: 'not-a-url' // 無効なURL
        };

        const result = validateBusinessCardForm(invalidFormData);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe('有効なメールアドレスを入力してください');
        expect(result.errors.phone).toBe('有効な電話番号を入力してください');
        expect(result.errors.website).toBe('有効なURLを入力してください');
      });
    });
  });
