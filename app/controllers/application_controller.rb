class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  # CSRFトークンの検証を有効にする
  protect_from_forgery with: :exception
end
