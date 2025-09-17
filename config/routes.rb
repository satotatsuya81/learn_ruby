Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "home#index"
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # ユーザー登録
  # GET /signup
  get "/signup",  to: "users#new"
  resources :users, only: [ :new, :create, :edit, :show ]
  # セッション管理のルート
  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"

  # アカウント有効化
  # /account_activations/:token/edit
  resources :account_activations, only: [ :edit ]

    # パスワードリセット
    # /password_resets/new, /password_resets (POST), /password_resets/:id/edit, /password_resets/:id (PATCH)
    resources :password_resets, only: [ :new, :create, :edit, :update ]

  # エラーページルーティング（config.exceptions_app = self.routes 用）
  # 全HTTPメソッドでアクセス可能にして、あらゆるエラー状況に対応
  match "/404", to: "errors#not_found", via: :all
  match "/500", to: "errors#internal_server_error", via: :all
  get "/errors/404", to: "errors#not_found", as: :not_found
  get "/errors/500", to: "errors#internal_server_error", as: :internal_server_error

  # すべての未知のルートを404エラーページへリダイレクト（最後に配置）
  match "*path", to: "errors#not_found", via: :all
end
