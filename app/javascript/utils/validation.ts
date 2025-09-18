import { BusinessCardFormData } from '@/types/business_card';

export interface ValidationResult {
    isValid: boolean;        // バリデーション成功/失敗
    message: string;         // エラーメッセージ（成功時は空文字列）
  }

  // フォーム全体のバリデーション結果
  export interface FormValidationResult {
    isValid: boolean;                    // 全体の成功/失敗
    errors: Record<string, string>;      // フィールド名をキーとするエラーメッセージ
  }

  // メールアドレスのバリデーション
  export function validateEmail(email: string): ValidationResult {
    // 空文字列はオプショナルフィールドのため有効とする
    if (!email || email.trim() === '') {
      return { isValid: true, message: '' };
    }

    // 基本的なメール形式の正規表現
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (emailRegex.test(email.trim())) {
      return { isValid: true, message: '' };
    } else {
      return { isValid: false, message: '有効なメールアドレスを入力してください' };
    }
  }

  // 電話番号のバリデーション（日本の形式に対応）
  export function validatePhone(phone: string): ValidationResult {
    // 空文字列はオプショナルフィールドのため有効とする
    if (!phone || phone.trim() === '') {
      return { isValid: true, message: '' };
    }

    // 日本の電話番号形式：03-1234-5678, 090-1234-5678, 0312345678 など
    const phoneRegex = /^(\d{2,4}-?\d{2,4}-?\d{4}|\d{10,11})$/;

    // ハイフンを除去して数字のみで検証
    const cleanPhone = phone.replace(/-/g, '');

    if (phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 11) {
      return { isValid: true, message: '' };
    } else {
      return { isValid: false, message: '有効な電話番号を入力してください' };
    }
  }

  // ウェブサイトURLのバリデーション
  export function validateWebsite(website: string): ValidationResult {
    // 空文字列はオプショナルフィールドのため有効とする
    if (!website || website.trim() === '') {
      return { isValid: true, message: '' };
    }

    try {
      // URLコンストラクタを使用してURL形式を検証
      const url = new URL(website);
      // httpまたはhttpsプロトコルのみ許可
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return { isValid: true, message: '' };
      } else {
        return { isValid: false, message: '有効なURLを入力してください' };
      }
    } catch {
      return { isValid: false, message: '有効なURLを入力してください' };
    }
  }

  // 必須フィールドのバリデーション
  export function validateRequiredField(value: string | null | undefined, fieldName: string): ValidationResult {
    if (!value || value.trim() === '') {
      return { isValid: false, message: `${fieldName}は必須です` };
    }

    return { isValid: true, message: '' };
  }

  // BusinessCardFormData全体のバリデーション
  export function validateBusinessCardForm(formData: BusinessCardFormData): FormValidationResult {
    const errors: Record<string, string> = {};

    // 必須フィールドのバリデーション
    const nameValidation = validateRequiredField(formData.name, '名前');
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
    }

    const companyValidation = validateRequiredField(formData.company_name, '会社名');
    if (!companyValidation.isValid) {
      errors.company_name = companyValidation.message;
    }

    // オプショナルフィールドのバリデーション（値が存在する場合のみ）
    if (formData.email) {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }

    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.message;
      }
    }

    if (formData.website) {
      const websiteValidation = validateWebsite(formData.website);
      if (!websiteValidation.isValid) {
        errors.website = websiteValidation.message;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
