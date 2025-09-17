require 'rails_helper'

# User Authentication（ユーザー認証）のシステムテスト
RSpec.describe "User Authentication", type: :system do
  before do
    driven_by(:rack_test)
  end

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
            expect(current_path).to eq(root_path)
            expect(page).to have_link(I18n.t('navigation.logout'))
            # ウェルカムメッセージが日本語で表示されることを確認
            expect(page).to have_content(I18n.t('navigation.welcome_message', name: user.name))
          end
        end

        # テスト2: Remember Me機能の動作確認テスト
        # 目的: 永続ログイン機能が正しく動作し、セキュアなクッキーが設定されることを確認
        it 'Remember Me機能が正常に動作し、ログイン状態が維持されること' do
          with_locale(:ja) do  # 一時的に日本語ロケールに切り替え
            visit login_path

            fill_in I18n.t('authentication.login.email_label'), with: user.email
            fill_in I18n.t('authentication.login.password_label'), with: user.password
            check I18n.t('authentication.login.remember_me_label')  # Remember meをチェック

            click_button I18n.t('authentication.login.submit_button')

            # Remember me機能が正常に動作していることを確認（暗号化クッキーのため、存在をチェック）
            expect(page.driver.browser.rack_mock_session.cookie_jar['user_id']).to be_present
            expect(page.driver.browser.rack_mock_session.cookie_jar['remember_token']).to be_present
            # ログイン状態が維持されていることも確認
            expect(current_path).to eq(root_path)
            expect(page).to have_link(I18n.t('navigation.logout'))
          end
        end
      end

      # 英語ロケールでのログインテスト
      context 'when locale is English' do
        # テスト3: 英語環境でのログイン成功テスト
        # 目的: 英語ユーザーが適切にログインでき、英語UIが正しく表示されることを確認
        it 'ログインに成功し、ダッシュボードにリダイレクトされ、英語UIが表示されること' do
          with_locale(:en) do  # 一時的に英語ロケールに切り替え
            visit login_path  # ログインページにアクセス

            # ページタイトルとフォーム要素の確認（英語）
            expect(page).to have_title(I18n.t('authentication.login.title'))
            expect(page).to have_content(I18n.t('authentication.login.title'))

            # フォームに情報を入力
            fill_in I18n.t('authentication.login.email_label'), with: user.email
            fill_in I18n.t('authentication.login.password_label'), with: user.password

            # ログインを実施
            click_button I18n.t('authentication.login.submit_button')

            # ダッシュボードにリダイレクトされることを確認
            expect(current_path).to eq(root_path)
            expect(page).to have_link(I18n.t('navigation.logout'))
            # ウェルカムメッセージが英語で表示されることを確認
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
            expect(page).not_to have_link(I18n.t('navigation.logout'))
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

      # 英語ロケールでのエラーテスト
      context 'when locale is English' do
        # テスト6: 英語環境でのログイン失敗テスト
        # 目的: 英語ユーザーに対して適切な英語エラーメッセージが表示されることを確認
        it 'ログインに失敗し、英語のエラーメッセージが表示されること' do
          with_locale(:en) do  # 一時的に英語ロケールに切り替え
            visit login_path

            fill_in I18n.t('authentication.login.email_label'), with: user.email
            fill_in I18n.t('authentication.login.password_label'), with: "wrongpassword"  # 間違ったパスワード

            click_button I18n.t('authentication.login.submit_button')

            # ログインページに留まり、英語のエラーメッセージが表示されることを確認
            expect(current_path).to eq(login_path)
            expect(page).to have_content(I18n.t('authentication.login.invalid_credentials'))
            expect(page).to have_link(I18n.t('navigation.login'))
            expect(page).not_to have_link(I18n.t('navigation.logout'))
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
          click_link I18n.t('navigation.logout')

          # ホームページにリダイレクトされることを確認
          expect(current_path).to eq(root_path)
          expect(page).to have_link(I18n.t('navigation.login'))
          expect(page).not_to have_link(I18n.t('navigation.logout'))
        end
      end
    end

    # 英語ロケールでのログアウトテスト
    context 'when locale is English' do
      before do
        # 英語環境でのログインを事前に行う
        with_locale(:en) do
          visit login_path
          fill_in I18n.t('authentication.login.email_label'), with: user.email
          fill_in I18n.t('authentication.login.password_label'), with: user.password
          click_button I18n.t('authentication.login.submit_button')
        end
      end

      # テスト8: 英語環境でのログアウト機能テスト
      # 目的: 英語ユーザーに対してもログアウト機能が正しく動作することを確認
      it '正常にログアウトし、ホームページにリダイレクトされ、英語UIが表示されること' do
        with_locale(:en) do  # 一時的に英語ロケールに切り替え
          click_link I18n.t('navigation.logout')

          # ホームページにリダイレクトされることを確認
          expect(current_path).to eq(root_path)
          expect(page).to have_link(I18n.t('navigation.login'))
          expect(page).not_to have_link(I18n.t('navigation.logout'))
        end
      end
    end
  end

  # ページ構造のテストグループ
  describe 'ページ構造' do
    # テスト9: ログインページのHTML構造テスト
    # 目的: SEO対策とアクセシビリティを確保するため、適切なHTML要素が使われていることを確認
    it 'ログインページが適切なセマンティックHTML構造を持つこと' do
      visit login_path  # ログインページにアクセス

      # セマンティックHTML要素の確認
      expect(page).to have_css('nav')       # ナビゲーション領域
      expect(page).to have_css('main')      # メインコンテンツ領域（ログインフォーム）
      expect(page).to have_css('footer')    # フッター領域
      expect(page).to have_css('h3')        # ページ見出し（SEOで重要）
      expect(page).to have_css('form')      # フォーム要素
      expect(page).to have_css('label')     # ラベル要素（アクセシビリティで重要）
      expect(page).to have_css('input[type="email"]')     # メールアドレス入力フィールド
      expect(page).to have_css('input[type="password"]')  # パスワード入力フィールド
      expect(page).to have_css('input[type="checkbox"]')  # Remember meチェックボックス
      expect(page).to have_css('input[type="submit"]')    # 送信ボタン
    end

    # テスト10: レスポンシブデザインの要素確認テスト
    # 目的: スマホ・タブレット・PCでの表示が適切になるBootstrapクラスが使われていることを確認
    it 'ログインページがレスポンシブデザイン要素を持つこと' do
      visit login_path  # ログインページにアクセス

      # Bootstrapのレスポンシブデザイン要素の確認
      expect(page).to have_css('.container')      # 中央寄せコンテナ（画面幅に応じて調整）
      expect(page).to have_css('.row')            # Bootstrapのグリッドシステム（行）
      expect(page).to have_css('.col-md-6')       # Bootstrapのグリッドシステム（列、中画面以上で6/12幅）
      expect(page).to have_css('.card')           # Bootstrapのカードコンポーネント
      expect(page).to have_css('.form-control')   # Bootstrapのフォームコントロール（レスポンシブ入力欄）
      expect(page).to have_css('.btn')            # Bootstrapのボタンコンポーネント
    end

    # テスト11: フォームバリデーション要素の確認テスト
    # 目的: HTMLフォームバリデーションが適切に設定され、ユーザビリティが確保されることを確認
    it 'ログインフォームが適切なバリデーション属性を持つこと' do
      visit login_path  # ログインページにアクセス

      # HTML5フォームバリデーション属性の確認
      expect(page).to have_css('input[required]')           # 必須入力フィールド
      expect(page).to have_css('input[type="email"]')       # メールアドレス形式バリデーション
      expect(page).to have_css('.needs-validation')         # Bootstrapバリデーションクラス
    end
  end
end
