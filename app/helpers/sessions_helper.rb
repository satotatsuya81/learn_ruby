module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
    @current_user = user
  end

  def remember(user)
    user.remember
    cookies.permanent.encrypted[:user_id] = user.id
    cookies.permanent.encrypted[:remember_token] = user.remember_token
  end

  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.encrypted[:user_id])
      user = User.find_by(id: user_id)
      if user&.authenticated?(cookies.encrypted[:remember_token])
        log_in(user)
        @current_user = user
      end
    end
  rescue ActiveRecord::RecordNotFound
    # 無効なuser_idが渡された場合の安全な処理
    nil
  end

  def logged_in?
    !current_user.nil?
  end

  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  def log_out
    forget(current_user) if logged_in?
    session.delete(:user_id)
    @current_user = nil
  end
end
