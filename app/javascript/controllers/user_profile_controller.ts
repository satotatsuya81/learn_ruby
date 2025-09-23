import { Controller } from "@hotwired/stimulus";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { UserProfile } from "@/components/UserProfile";
import { User, UserUpdateData } from "@/types/User";

export default class extends Controller {
  static values = {
    user: Object,
    editable: Boolean
  };

  declare readonly userValue: User;
  declare readonly editableValue: boolean;
  private root?: Root;

  connect(): void {
    console.log("UserProfileController connected");
    this.render();
  }

  disconnect(): void {
    if (this.root) {
      this.root.unmount();
    }
  }

  render(): void {
    const user = this.userValue;
    const editable = this.editableValue;

    const handleUpdate = async (data: UserUpdateData): Promise<void> => {
      const { updateUserProfile } = await import('@/utils/api');
      await updateUserProfile(user.id, data);
      window.location.reload();
    };

    // コンテナをクリア
    this.element.innerHTML = '';

    // Reactコンポーネントをレンダー
    this.root = createRoot(this.element);
    this.root.render(
      React.createElement(UserProfile, {
        user,
        editable,
        onUpdate: handleUpdate
      })
    );
  }
}