import { Controller } from "@hotwired/stimulus";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { BusinessCardForm } from "@/components/BusinessCardForm";
import { BusinessCard, BusinessCardFormData } from "@/types/BusinessCard";

interface BusinessCardFormProps {
  mode: 'create' | 'edit';
  businessCard?: BusinessCard;
  onSubmit: (formData: BusinessCardFormData) => Promise<void>;
  onCancel: () => void;
}

export default class extends Controller {
  static values = {
    mode: String,
    card: Object,
    errors: Array
  };

  declare readonly modeValue: 'create' | 'edit';
  declare readonly cardValue: BusinessCard;
  declare readonly errorsValue: string[];
  declare readonly hasCardValue: boolean;
  private root?: Root;

  connect(): void {
    console.log("BusinessCardFormController connected");
    this.render();
  }

  disconnect(): void {
    if (this.root) {
      this.root.unmount();
    }
  }

  render(): void {
    const mode = this.modeValue;
    const businessCard = this.hasCardValue ? this.cardValue : null;
    const errors = this.errorsValue ?? [];

    const handleSuccess = (): void => {
      if (mode === 'create') {
        window.location.href = '/business_cards';
      } else {
        window.location.href = `/business_cards/${businessCard?.id}`;
      }
    };

    const handleCancel = (): void => {
      if (mode === 'create') {
        window.location.href = '/business_cards';
      } else {
        window.location.href = `/business_cards/${businessCard?.id}`;
      }
    };

    const handleSubmit = async (formData: BusinessCardFormData): Promise<void> => {
      if (mode === 'create') {
        const { createBusinessCard } = await import('@/utils/api');
        await createBusinessCard(formData);
      } else {
        const { updateBusinessCard } = await import('@/utils/api');
        if (businessCard === null) {
          throw new Error('Business card is required for edit mode');
        }
        await updateBusinessCard(businessCard.id, formData);
      }
      handleSuccess();
    };

    // 初期エラーがある場合の処理
    if (errors.length > 0) {
      console.warn('Form errors:', errors);
    }

    // コンテナをクリア
    this.element.innerHTML = '';

    // Reactコンポーネントをレンダー
    this.root = createRoot(this.element);

    const props: BusinessCardFormProps = {
      mode,
      onSubmit: handleSubmit,
      onCancel: handleCancel,
      ...(businessCard && { businessCard })
    };

    this.root.render(React.createElement(BusinessCardForm, props));
  }
}
