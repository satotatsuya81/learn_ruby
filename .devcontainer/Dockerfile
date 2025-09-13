FROM ubuntu:24.04

  # YJITを有効化
  ENV RUBY_YJIT_ENABLE=1

  # 作業ディレクトリ設定
  WORKDIR /workspace

  # システム依存関係のインストール
  RUN apt-get update -qq && apt-get install -yq --no-install-recommends \
      build-essential \
      gnupg2 \
      curl \
      less \
      git \
      default-mysql-client \
      default-libmysqlclient-dev \
      libyaml-dev \
      pkg-config \
      imagemagick \
      libvips42 \
      nodejs \
      npm \
      sudo \
      libssl-dev \
      libreadline-dev \
      zlib1g-dev \
      libncurses5-dev \
      libffi-dev \
      libgdbm-dev \
      libbz2-dev \
      liblzma-dev \
      && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

  # Node.js 18のインストール
  RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
      && apt-get install -y nodejs

  # Yarnのインストール
  RUN npm install -g yarn

# 既存のubuntuユーザーをvscoce用に設定
  RUN usermod -l vscode ubuntu \
      && usermod -d /home/vscode -m vscode \
      && groupmod -n vscode ubuntu \
      && echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode \
      && chmod 0440 /etc/sudoers.d/vscode

  # vscodユーザー用のrbenv設定
  USER vscode
  RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv \
      && cd ~/.rbenv && src/configure && make -C src \
      && echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc \
      && echo 'eval "$(rbenv init -)"' >> ~/.bashrc \
      && git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build \
      && ~/.rbenv/bin/rbenv install 3.3.9 \
      && ~/.rbenv/bin/rbenv global 3.3.9 \
      && ~/.rbenv/bin/rbenv rehash

  # vscodユーザー用のGem環境設定
  ENV PATH="/home/vscode/.rbenv/bin:/home/vscode/.rbenv/shims:$PATH"
  RUN ~/.rbenv/shims/gem install bundler rails \
      rubocop \
      rubocop-rails \
      rubocop-rspec \
      brakeman \
      ruby-lsp \
      syntax_tree

  USER root

  # rootユーザー用のrbenv設定
  RUN git clone https://github.com/rbenv/rbenv.git /root/.rbenv \
      && cd /root/.rbenv && src/configure && make -C src \
      && echo 'export PATH="/root/.rbenv/bin:$PATH"' >> /root/.bashrc \
      && echo 'eval "$(rbenv init -)"' >> /root/.bashrc \
      && git clone https://github.com/rbenv/ruby-build.git /root/.rbenv/plugins/ruby-build \
      && /root/.rbenv/bin/rbenv install 3.3.9 \
      && /root/.rbenv/bin/rbenv global 3.3.9 \
      && /root/.rbenv/bin/rbenv rehash

  # rootユーザー用のPATH設定とGemインストール
  ENV PATH="/root/.rbenv/bin:/root/.rbenv/shims:$PATH"
  RUN /root/.rbenv/shims/gem install bundler rails \
      rubocop \
      rubocop-rails \
      rubocop-rspec \
      brakeman \
      ruby-lsp \
      syntax_tree

  # コンテナが継続実行されるようにする
  CMD ["sleep", "infinity"]
