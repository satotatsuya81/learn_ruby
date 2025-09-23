import { render, screen } from '@testing-library/react';
import { HomePage } from '@/components/HomePage';

describe('HomePage', () => {
  const mockStats = {
    totalBusinessCards: 15,
    companiesCount: 8,
    lastUpdated: '2023-12-01'
  };

  describe('基本表示', () => {
    it('ホームページが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('Business Card Manager')).toBeInTheDocument();
    });

    it('アプリケーション名が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('Business Card Manager')).toBeInTheDocument();
    });

    it('ウェルカムメッセージが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/名刺管理システムへようこそ/)).toBeInTheDocument();
    });

    it('アプリケーションの説明が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/効率的な名刺管理を実現する/)).toBeInTheDocument();
    });
  });

  describe('機能紹介セクション', () => {
    it('主要機能セクションが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('主な機能')).toBeInTheDocument();
    });

    it('名刺管理機能が紹介される', () => {
      render(<HomePage />);
      expect(screen.getByText('📇 名刺管理')).toBeInTheDocument();
    });

    it('タグ機能が紹介される', () => {
      render(<HomePage />);
      expect(screen.getByText(/タグ付け/)).toBeInTheDocument();
    });

    it('検索機能が紹介される', () => {
      render(<HomePage />);
      expect(screen.getByText(/検索/)).toBeInTheDocument();
    });

    it('統計機能が紹介される', () => {
      render(<HomePage />);
      expect(screen.getByText(/統計・分析/)).toBeInTheDocument();
    });
  });

  describe('今後の予定セクション', () => {
    it('今後の予定セクションが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('今後の予定')).toBeInTheDocument();
    });

    it('認証機能の予定が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/認証システム/)).toBeInTheDocument();
    });

    it('レスポンシブ対応の予定が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/レスポンシブ対応/)).toBeInTheDocument();
    });

    it('OCR機能の予定が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/OCR機能/)).toBeInTheDocument();
    });

    it('ダッシュボード機能の予定が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/ダッシュボード/)).toBeInTheDocument();
    });
  });

  describe('技術スタックセクション', () => {
    it('技術スタックセクションが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('技術スタック')).toBeInTheDocument();
    });

    it('Rails技術が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/Rails/)).toBeInTheDocument();
    });

    it('Bootstrap技術が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/Bootstrap/)).toBeInTheDocument();
    });

    it('MySQL技術が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/MySQL/)).toBeInTheDocument();
    });

    it('React技術が表示される', () => {
      render(<HomePage />);
      expect(screen.getByText(/React/)).toBeInTheDocument();
    });
  });

  describe('統計情報付きホームページ', () => {
    it('統計情報が渡された場合は統計セクションが表示される', () => {
      render(<HomePage stats={mockStats} />);
      expect(screen.getByText(/登録名刺数/)).toBeInTheDocument();
    });

    it('総名刺数が表示される', () => {
      render(<HomePage stats={mockStats} />);
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText(/登録名刺数/)).toBeInTheDocument();
    });

    it('会社数が表示される', () => {
      render(<HomePage stats={mockStats} />);
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText(/登録会社数/)).toBeInTheDocument();
    });

    it('最終更新日が表示される', () => {
      render(<HomePage stats={mockStats} />);
      expect(screen.getByText('2023-12-01')).toBeInTheDocument();
      expect(screen.getByText(/最終更新/)).toBeInTheDocument();
    });
  });

  describe('統計情報なしホームページ', () => {
    it('統計情報が渡されない場合は統計セクションが表示されない', () => {
      render(<HomePage />);
      expect(screen.queryByText(/登録名刺数/)).not.toBeInTheDocument();
    });
  });

  describe('ナビゲーションリンク', () => {
    it('名刺一覧へのリンクが表示される', () => {
      render(<HomePage />);
      const link = screen.getByRole('link', { name: /名刺一覧/ });
      expect(link).toHaveAttribute('href', '/business_cards');
    });

    it('新しい名刺を追加へのリンクが表示される', () => {
      render(<HomePage />);
      const link = screen.getByRole('link', { name: /新しい名刺を追加/ });
      expect(link).toHaveAttribute('href', '/business_cards/new');
    });

  });

  describe('レスポンシブレイアウト', () => {
    it('ジャンボトロンコンテナが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('Business Card Manager')).toBeInTheDocument();
    });

    it('3カラムレイアウトのコンテナが表示される', () => {
      render(<HomePage />);
      expect(screen.getByText('主な機能')).toBeInTheDocument();
      expect(screen.getByText('今後の予定')).toBeInTheDocument();
      expect(screen.getByText('技術スタック')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('メインヘッダーが適切な見出しレベルで表示される', () => {
      render(<HomePage />);
      expect(screen.getByRole('heading', { level: 1, name: 'Business Card Manager' })).toBeInTheDocument();
    });

    it('セクションヘッダーが適切な見出しレベルで表示される', () => {
      render(<HomePage />);
      expect(screen.getByRole('heading', { level: 3, name: '主な機能' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: '今後の予定' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: '技術スタック' })).toBeInTheDocument();
    });
  });
});
