# API 仕様書

Business Card Manager のAPI仕様書です。

## 概要

Business Card Managerは以下のAPIエンドポイントを提供しています：

- **ユーザー登録API**: ユーザー新規登録、プロフィール表示
- **認証API**: ユーザーログイン・ログアウト、ユーザー情報取得
- **アカウント有効化API**: メール経由のアカウント有効化
- **パスワードリセットAPI**: パスワード忘却時のリセット機能
- **名刺管理API**: 名刺のCRUD操作（作成・読み取り・更新・削除）
- **エラーハンドリングAPI**: 404・500エラーページ

すべてのAPIは、Rails標準のセッション認証を使用します。

## ユーザー登録API

### GET /signup

ユーザー登録フォームを表示します。

**リクエスト**
```http
GET /signup
```

**成功レスポンス (200 OK)**
```html
<!-- ユーザー登録フォームページ（HTML） -->
```

### POST /users

新しいユーザーを登録します。

**リクエスト**
```http
POST /users
Content-Type: application/x-www-form-urlencoded

user[name]=山田太郎&user[email]=yamada@example.com&user[password]=password123&user[password_confirmation]=password123
```

**パラメータ**
- `user[name]` (string, required): ユーザー名
- `user[email]` (string, required): メールアドレス
- `user[password]` (string, required): パスワード（6文字以上）
- `user[password_confirmation]` (string, required): パスワード確認

**成功レスポンス (302 Found)**
```
Location: /
```

**失敗レスポンス (422 Unprocessable Content)**
```html
<!-- 登録フォームページにエラーメッセージが表示される -->
```

**注意**: 登録成功後、アカウント有効化メールが送信されます。メール内のリンクをクリックしてアカウントを有効化する必要があります。

### GET /users/:id

ユーザーのプロフィールを表示します。

**リクエスト**
```http
GET /users/1
```

**成功レスポンス (200 OK)**
```html
<!-- ユーザープロフィールページ（HTML） -->
```

**制限事項**
- 有効化されたユーザーのみ表示可能
- 未有効化ユーザーの場合はルートページにリダイレクト

**存在しない場合 (302 Found)**
```
Location: /
```

## アカウント有効化API

### GET /account_activations/:id/edit

メール経由でアカウントを有効化します。

**リクエスト**
```http
GET /account_activations/1/edit?token=abc123def456...
```

**パラメータ**
- `:id` (integer, required): ユーザーID
- `token` (string, required): 有効化トークン（メールで送信されたもの）

**成功レスポンス (302 Found)**
```
Location: /users/1
```

**失敗レスポンス (302 Found)**
```
Location: /
```

**注意**:
- 有効化成功後、ユーザーは自動的にログイン状態になります
- 既に有効化済みのアカウントの場合はルートページにリダイレクト
- 無効なトークンの場合はルートページにリダイレクト

## 認証API

### GET /login

ログインフォームを表示します。

**リクエスト**
```http
GET /login
```

**成功レスポンス (200 OK)**
```html
<!-- ログインフォームページ（HTML） -->
```

### POST /login

ユーザーのログインを行います。

**リクエスト**
```http
POST /login
Content-Type: application/x-www-form-urlencoded

session[email]=user@example.com&session[password]=password&session[remember_me]=1
```

**パラメータ**
- `session[email]` (string, required): メールアドレス
- `session[password]` (string, required): パスワード
- `session[remember_me]` (string, optional): Remember Me機能（"1"で有効化、省略時は無効）

**成功レスポンス (302 Found)**
```
Location: /
```

**JSON成功レスポンス (200 OK)**
```json
{
  "data": {
    "id": 1,
    "name": "山田太郎",
    "email": "user@example.com",
    "activated": true
  },
  "success": true,
  "message": "ログインに成功しました"
}
```

**失敗レスポンス (422 Unprocessable Content)**
```html
<!-- ログインフォームページにエラーメッセージが表示される -->
```

**JSON失敗レスポンス (422 Unprocessable Content)**
```json
{
  "error": "メールアドレスまたはパスワードが正しくありません",
  "details": {
    "credentials": ["メールアドレスまたはパスワードが正しくありません"]
  }
}
```

**未有効化アカウントレスポンス (422 Unprocessable Content)**
```json
{
  "error": "アカウントが有効化されていません。メールをご確認ください。",
  "details": {
    "account": ["アカウントが有効化されていません"]
  }
}
```

### DELETE /logout

ユーザーのログアウトを行います。

**リクエスト**
```http
DELETE /logout
```

**成功レスポンス (302 Found)**
```
Location: /
```

**JSON成功レスポンス (200 OK)**
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

### GET /current_user

現在ログインしているユーザーの情報を取得します。

**リクエスト**
```http
GET /current_user
```

**成功レスポンス (200 OK)**
```json
{
  "data": {
    "id": 1,
    "name": "山田太郎",
    "email": "user@example.com",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:00:00.000Z"
  },
  "success": true
}
```

**未認証レスポンス (401 Unauthorized)**
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

## パスワードリセットAPI

### GET /password_resets/new

パスワードリセットフォームを表示します。

**リクエスト**
```http
GET /password_resets/new
```

**成功レスポンス (200 OK)**
```html
<!-- パスワードリセットフォームページ（HTML） -->
```

### POST /password_resets

パスワードリセットメールを送信します。

**リクエスト**
```http
POST /password_resets
Content-Type: application/x-www-form-urlencoded

password_reset[email]=user@example.com
```

**パラメータ**
- `password_reset[email]` (string, required): メールアドレス

**成功レスポンス (302 Found)**
```
Location: /
```

**失敗レスポンス (422 Unprocessable Content)**
```html
<!-- リセットフォームページにエラーメッセージが表示される -->
```

### GET /password_resets/:id/edit

パスワードリセットフォームを表示します。

**リクエスト**
```http
GET /password_resets/1/edit?token=abc123def456...
```

**パラメータ**
- `:id` (integer, required): ユーザーID
- `token` (string, required): リセットトークン（メールで送信されたもの）

**成功レスポンス (200 OK)**
```html
<!-- パスワード変更フォームページ（HTML） -->
```

**失敗レスポンス (302 Found)**
```
Location: /
```

### PATCH /password_resets/:id

パスワードをリセットします。

**リクエスト**
```http
PATCH /password_resets/1
Content-Type: application/x-www-form-urlencoded

token=abc123def456...&user[password]=newpassword123&user[password_confirmation]=newpassword123
```

**パラメータ**
- `:id` (integer, required): ユーザーID
- `token` (string, required): リセットトークン
- `user[password]` (string, required): 新しいパスワード
- `user[password_confirmation]` (string, required): パスワード確認

**成功レスポンス (302 Found)**
```
Location: /users/1
```

**失敗レスポンス (422 Unprocessable Content)**
```html
<!-- パスワード変更フォームページにエラーメッセージが表示される -->
```

**注意**:
- リセットトークンの有効期限は2時間です
- 期限切れの場合、新しいリセットメールの送信が必要です

## 名刺管理API

名刺管理APIはすべて認証が必要です。未認証の場合は `/login` へリダイレクトされます。

### GET /business_cards

名刺一覧を取得します。

**リクエスト**
```http
GET /business_cards
```

**クエリパラメータ**
現在、検索・フィルタリング機能は実装されていません。

**成功レスポンス (200 OK)**
```html
<!-- 名刺一覧ページ（HTML） -->
```

### GET /business_cards/new

名刺作成フォームを表示します。

**リクエスト**
```http
GET /business_cards/new
```

**成功レスポンス (200 OK)**
```html
<!-- 名刺作成フォームページ（HTML） -->
```

### POST /business_cards

新しい名刺を作成します。

**リクエスト**
```http
POST /business_cards
Content-Type: application/x-www-form-urlencoded

business_card[name]=山田太郎&business_card[company_name]=株式会社サンプル&business_card[job_title]=営業部長&business_card[department]=営業部&business_card[email]=yamada@sample.com&business_card[phone]=03-1234-5678&business_card[mobile]=090-1234-5678&business_card[address]=東京都&business_card[website]=https://sample.com&business_card[notes]=重要な取引先
```

**パラメータ**
- `business_card[name]` (string, required): 氏名
- `business_card[company_name]` (string, required): 会社名
- `business_card[job_title]` (string, optional): 役職
- `business_card[department]` (string, optional): 部署
- `business_card[email]` (string, optional): メールアドレス
- `business_card[phone]` (string, optional): 固定電話番号
- `business_card[mobile]` (string, optional): 携帯電話番号
- `business_card[address]` (string, optional): 住所
- `business_card[website]` (string, optional): ウェブサイト
- `business_card[notes]` (string, optional): メモ

**成功レスポンス (302 Found)**
```
Location: /business_cards
```

**失敗レスポンス (422 Unprocessable Content)**
```html
<!-- 作成フォームページにエラーメッセージが表示される -->
```

### GET /business_cards/:id

指定された名刺の詳細を取得します。

**リクエスト**
```http
GET /business_cards/1
```

**成功レスポンス (200 OK)**
```html
<!-- 名刺詳細ページ（HTML） -->
```

**存在しない場合 (302 Found)**
```
Location: /
```

### GET /business_cards/:id/edit

名刺編集フォームを表示します。

**リクエスト**
```http
GET /business_cards/1/edit
```

**成功レスポンス (200 OK)**
```html
<!-- 名刺編集フォームページ（HTML） -->
```

### PATCH /business_cards/:id

指定された名刺を更新します。

**リクエスト**
```http
PATCH /business_cards/1
Content-Type: application/x-www-form-urlencoded

business_card[name]=山田太郎&business_card[company_name]=株式会社サンプル&business_card[job_title]=部長&business_card[department]=営業部&business_card[email]=yamada@sample.com&business_card[phone]=03-1234-5678&business_card[mobile]=090-1234-5678&business_card[address]=東京都&business_card[website]=https://sample.com&business_card[notes]=重要な取引先
```

**パラメータ**
- POST /business_cardsと同じパラメータを使用

**注意**: 更新する項目のみ送信すれば、部分更新が可能です。

**成功レスポンス (302 Found)**
```
Location: /business_cards/1
```

**失敗レスポンス (422 Unprocessable Content)**
```html
<!-- 編集フォームページにエラーメッセージが表示される -->
```

### DELETE /business_cards/:id

指定された名刺を削除します。

**リクエスト**
```http
DELETE /business_cards/1
```

**成功レスポンス (302 Found)**
```
Location: /business_cards
```

**存在しない場合 (302 Found)**
```
Location: /
```

## その他のエンドポイント

### GET /up

アプリケーションのヘルスチェック用エンドポイントです。

**リクエスト**
```http
GET /up
```

**成功レスポンス (200 OK)**
```
OK
```

**エラーレスポンス (500 Internal Server Error)**
```
Application Error
```

## ホームページAPI

### GET /

アプリケーションのホームページを表示します。

**リクエスト**
```http
GET /
```

**ログイン済みレスポンス (200 OK)**
```html
<!-- ホームページ（HTML） -->
```

**未ログインレスポンス (302 Found)**
```
Location: /login
```

## カスタムエラーページAPI

### GET /errors/404

404エラーページを表示します。

**リクエスト**
```http
GET /errors/404
```

**レスポンス (404 Not Found)**
```html
<!-- カスタム404エラーページ（HTML） -->
```

**JSONレスポンス (404 Not Found)**
```json
{
  "error": "Not Found"
}
```

### GET /errors/500

500エラーページを表示します。

**リクエスト**
```http
GET /errors/500
```

**レスポンス (500 Internal Server Error)**
```html
<!-- カスタム500エラーページ（HTML） -->
```

**JSONレスポンス (500 Internal Server Error)**
```json
{
  "error": "Internal Server Error"
}
```

## エラーハンドリング

### 404 Not Found

存在しないページへのアクセス時

**レスポンス**
```html
<!-- カスタム404エラーページ -->
```

### 500 Internal Server Error

サーバー内部エラー時

**レスポンス**
```html
<!-- カスタム500エラーページ -->
```

## 認証について

- すべての名刺管理API（`/business_cards/*`）は認証が必要です
- 未認証の場合、`/login` へリダイレクトされます
- 認証はRailsの標準セッションベース認証を使用しています
- Remember Me機能により永続的なセッションが利用可能です

## レート制限

現在、レート制限は実装されていません。

## バージョニング

現在のAPIバージョンは v1 です。明示的なバージョン指定は不要です。

---

**更新日**: 2025年9月28日
**バージョン**: 1.1.0
**最終確認**: 実装と仕様書の整合性確認済み
