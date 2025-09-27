# System specでSeleniumを使用するためのCapybara設定
require 'capybara/rspec'
require 'selenium-webdriver'
require 'socket'

# リモートSeleniumサーバーの設定
Capybara.register_driver :remote_chrome do |app|
  url = ENV["SELENIUM_DRIVER_URL"]

  # 新しいSelenium WebDriver API を使用
  chrome_options = Selenium::WebDriver::Chrome::Options.new
  chrome_options.add_argument('--no-sandbox')
  chrome_options.add_argument('--headless')
  chrome_options.add_argument('--disable-gpu')
  chrome_options.add_argument('--disable-dev-shm-usage')
  chrome_options.add_argument('--window-size=1400,900')

  Capybara::Selenium::Driver.new(app,
                                 browser: :remote,
                                 url: url,
                                 options: chrome_options)
end

# Capybaraの基本設定
Capybara.configure do |config|
  config.default_driver = :rack_test
  config.javascript_driver = :remote_chrome
  config.default_max_wait_time = 10
end

# RSpecでの設定
RSpec.configure do |config|
  # JavaScript無効テスト（デフォルト）
  config.before(:each, type: :system) do
    driven_by :rack_test
  end

  # JavaScript有効テスト
  config.before(:each, type: :system, js: true) do
    if ENV['SELENIUM_DRIVER_URL']
      # Docker環境でのSelenium使用
      Capybara.server_host = IPSocket.getaddress(Socket.gethostname)
      Capybara.server_port = 3000
      Capybara.app_host = "http://#{Capybara.server_host}:#{Capybara.server_port}"
      driven_by :remote_chrome
    else
      # ローカル環境でのSelenium使用
      driven_by :selenium_chrome_headless
    end
  end
end
