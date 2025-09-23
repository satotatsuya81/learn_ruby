require 'rails_helper'

# User Authentication（ユーザー認証）のシステムテスト
RSpec.describe "User Authentication", type: :system, js: true do
  let(:user) { create(:user, email: "user@example.com",
                            password: "password",
                            password_confirmation: "password",
                            name: "Test User",
                            activated: true) }

  # ログイン機能のテストグループ
  describe 'ログイン機能' do
    # 有効な認証情報でのログインテスト
    context '有効な認証情報でログインする場合' do
      # 日本語ロケールでのログインテスト
      context 'when locale is Japanese' do
        # テスト1: 日本語環境でのログイン成功テスト
        # 目的: 日本語ユーザーが適切にログインでき、日本語UIが正しく表示されることを確認
        it 'ログインに成功し、ダッシュボードにリダイレクトされ、日本語UIが表示されること' do
          with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
            visit login_path  # ログインページにアクセス

            # ページタイトルとフォーム要素の確認（日本語）
            expect(page).to have_title(I18n.t('authentication.login.title'))
            expect(page).to have_content(I18n.t('authentication.login.title'))

            # フォームに情報を入力
            fill_in I18n.t('authentication.login.email_label'), with: user.email
            fill_in I18n.t('authentication.login.password_label'), with: user.password

            # ログインを実施
            click_button I18n.t('authentication.login.submit_button')

            # ダッシュボードにリダイレクトされることを確認
            expect(page).to have_current_path(root_path)
            expect(page).to have_button(I18n.t('navigation.logout'))
            # ウェルカムメッセージが日本語で表示されることを確認
            expect(page).to have_content(I18n.t('navigation.welcome_message', name: user.name))
          end
        end

        # テスト2: Remember Me機能の動作確認テスト
        # 目的: 永続ログイン機能が正しく動作し、セッションが切れてもログイン状態が維持されることを確認
        it 'Remember Me機能が正常に動作し、ログイン状態が維持されること' do
          with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
            visit login_path

            fill_in I18n.t('authentication.login.email_label'), with: user.email
            fill_in I18n.t('authentication.login.password_label'), with: user.password
            check I18n.t('authentication.login.remember_me_label')  # Remember meをチェック
            click_button I18n.t('authentication.login.submit_button')

            # ログインが成功していることを確認
            expect(page).to have_current_path(root_path)
            expect(page).to have_button(I18n.t('navigation.logout'), wait: 3)

            # セッションのみをクリア（永続cookieは保持）
            # Railsセッションを無効化するため、新しいセッションを開始
            Capybara.current_session.driver.browser.execute_script(
              "document.cookie = '_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'"
            )

            # 新しいページ訪問でRemember Me機能をテスト
            visit root_path
            # Remember Me機能によりログイン状態が維持されていることを確認
            expect(page).to have_button(I18n.t('navigation.logout'), wait: 5)
            expect(page).to have_content(I18n.t('navigation.welcome_message', name: user.name))
          end
        end
      end
    end

    # 無効な認証情報でのログインテスト
    context '無効な認証情報でログインする場合' do
      # 日本語ロケールでのエラーテスト
      context 'when locale is Japanese' do
        # テスト4: 間違ったパスワードでのログイン失敗テスト
        # 目的: セキュリティ機能が正しく動作し、適切な日本語エラーメッセージが表示されることを確認
        it 'ログインに失敗し、日本語のエラーメッセージが表示されること' do
          with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
            visit login_path

            fill_in I18n.t('authentication.login.email_label'), with: user.email
            fill_in I18n.t('authentication.login.password_label'), with: "wrongpassword"  # 間違ったパスワード

            click_button I18n.t('authentication.login.submit_button')

            # ログインページに留まり、エラーメッセージが表示されることを確認
            expect(current_path).to eq(login_path)
            expect(page).to have_content(I18n.t('authentication.login.invalid_credentials'))
            expect(page).to have_link(I18n.t('navigation.login'))
            expect(page).not_to have_button(I18n.t('navigation.logout'))
          end
        end

        # テスト5: 存在しないメールアドレスでのログイン失敗テスト
        # 目的: データベースに存在しないユーザーでの認証試行が適切に処理されることを確認
        it '存在しないメールアドレスでログインに失敗し、エラーメッセージが表示されること' do
          with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
            visit login_path

            fill_in I18n.t('authentication.login.email_label'), with: "nonexistent@example.com"
            fill_in I18n.t('authentication.login.password_label'), with: "password"

            click_button I18n.t('authentication.login.submit_button')

            # ログインページに留まり、エラーメッセージが表示されることを確認
            expect(current_path).to eq(login_path)
            expect(page).to have_content(I18n.t('authentication.login.invalid_credentials'))
          end
        end
      end
    end
  end

  # ログアウト機能のテストグループ
  describe 'ログアウト機能' do
    before do
      # 事前にログインしておく（テストの前提条件設定）
      visit login_path
      fill_in I18n.t('authentication.login.email_label'), with: user.email
      fill_in I18n.t('authentication.login.password_label'), with: user.password
      click_button I18n.t('authentication.login.submit_button')
    end

    # 日本語ロケールでのログアウトテスト
    context 'when locale is Japanese' do
      # テスト7: 日本語環境でのログアウト機能テスト
      # 目的: セッション破棄が正しく行われ、適切にホームページにリダイレクトされることを確認
      it '正常にログアウトし、ホームページにリダイレクトされ、日本語UIが表示されること' do
        with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
          click_button I18n.t('navigation.logout')

          # ホームページにリダイレクトされることを確認
          expect(current_path).to eq(login_path)
          expect(page).to have_link(I18n.t('navigation.login'))
          expect(page).not_to have_button(I18n.t('navigation.logout'))
        end
      end
    end
  end
end
