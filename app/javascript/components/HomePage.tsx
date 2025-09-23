import React from 'react';

interface HomePageStats {
  totalBusinessCards: number;
  companiesCount: number;
  lastUpdated: string;
}

interface HomePageProps {
  stats?: HomePageStats;
}

export const HomePage: React.FC<HomePageProps> = ({ stats }) => {
  return (
    <div>
      {/* ジャンボトロン */}
      <div className="jumbotron bg-light p-5 rounded-lg mb-4">
        <h1 className="display-4">Business Card Manager</h1>
        <p className="lead">名刺管理システムへようこそ</p>
        <hr className="my-4" />
        <p>効率的な名刺管理を実現するモダンなWebアプリケーションです。</p>

        {/* ナビゲーションリンク */}
        <div className="d-flex gap-3 mt-4">
          <a href="/business_cards" className="btn btn-primary">
            名刺一覧を見る
          </a>
          <a href="/business_cards/new" className="btn btn-success">
            新しい名刺を追加
          </a>
        </div>
      </div>

      {/* 統計情報セクション（データがある場合のみ表示） */}
      {stats && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>統計情報</h3>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-md-4">
                <div className="mb-3">
                  <h4 className="text-primary">{stats.totalBusinessCards}</h4>
                  <p className="text-muted">登録名刺数</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <h4 className="text-success">{stats.companiesCount}</h4>
                  <p className="text-muted">登録会社数</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <h4 className="text-info">{stats.lastUpdated}</h4>
                  <p className="text-muted">最終更新</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 機能紹介セクション */}
      <div className="row">
        <div className="col-md-4">
          <h3>主な機能</h3>
          <ul className="list-unstyled">
            <li>📇 名刺管理</li>
            <li>🏷️ タグ付け機能</li>
            <li>🔍 高速検索</li>
            <li>📊 統計・分析</li>
          </ul>
        </div>
        <div className="col-md-4">
          <h3>今後の予定</h3>
          <ul className="list-unstyled">
            <li>🔐 認証システム</li>
            <li>📱 レスポンシブ対応</li>
            <li>🤖 OCR機能</li>
            <li>📈 ダッシュボード機能</li>
          </ul>
        </div>
        <div className="col-md-4">
          <h3>技術スタック</h3>
          <ul className="list-unstyled">
            <li>💎 Rails 7.0</li>
            <li>🅱️ Bootstrap 5</li>
            <li>🗄️ MySQL 8.0</li>
            <li>⚛️ React + TypeScript</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
