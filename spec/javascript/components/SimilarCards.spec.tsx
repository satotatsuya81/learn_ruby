import { render, screen } from '@testing-library/react';
import { SimilarCards } from '@/components/SimilarCards';
import { BusinessCard } from '@/types//BusinessCard';

describe('SimilarCards', () => {
  const mockSimilarCards: BusinessCard[] = [
    {
      id: 2,
      name: '佐藤花子',
      company_name: 'テスト株式会社',
      job_title: 'マネージャー',
      department: '営業部',
      email: 'sato@test.com',
      phone: '03-1234-5679',
      mobile: '090-1234-5679',
      website: 'https://test.com',
      address: '東京都千代田区1-1-2',
      notes: 'テストメモ2',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      user_id: 1
    },
    {
      id: 3,
      name: '田中次郎',
      company_name: 'テスト株式会社',
      job_title: 'シニアエンジニア',
      department: '開発部',
      email: 'tanaka.jiro@test.com',
      phone: '03-1234-5680',
      mobile: '090-1234-5680',
      website: 'https://test.com',
      address: '東京都千代田区1-1-3',
      notes: 'テストメモ3',
      created_at: '2023-01-03T00:00:00Z',
      updated_at: '2023-01-03T00:00:00Z',
      user_id: 1
    }
  ];

  const currentCardId = 1;

  describe('類似名刺の表示', () => {
    it('タイトルを表示する', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      expect(screen.getByText('類似名刺')).toBeInTheDocument();
    });

    it('類似名刺のリストを表示する', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      expect(screen.getByText('佐藤花子')).toBeInTheDocument();
      expect(screen.getByText('田中次郎')).toBeInTheDocument();
    });

    it('各名刺の会社名を表示する', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      // 複数の同じ会社名が表示されることを確認
      const companyNames = screen.getAllByText('テスト株式会社');
      expect(companyNames).toHaveLength(2);
    });

    it('各名刺の役職を表示する', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      expect(screen.getByText('マネージャー')).toBeInTheDocument();
      expect(screen.getByText('シニアエンジニア')).toBeInTheDocument();
    });
  });

  describe('空データの処理', () => {
    it('類似名刺がない場合は何も表示しない', () => {
      render(
        <SimilarCards
          similarCards={[]}
          currentCardId={currentCardId}
        />
      );

      expect(screen.queryByText('類似名刺')).not.toBeInTheDocument();
    });

    it('類似名刺が0件の場合は何も表示しない', () => {
      render(
        <SimilarCards
          similarCards={[]}
          currentCardId={currentCardId}
        />
      );

      expect(screen.queryByText('類似名刺')).not.toBeInTheDocument();
    });
  });

  describe('現在の名刺の除外', () => {
    it('現在表示中の名刺IDは除外して表示する', () => {
      const cardsIncludingCurrent = [
        ...mockSimilarCards,
        {
          id: currentCardId,
          name: '田中太郎',
          company_name: 'テスト株式会社',
          job_title: 'エンジニア',
          department: '開発部',
          email: 'tanaka@test.com',
          phone: '03-1234-5678',
          mobile: '090-1234-5678',
          website: 'https://test.com',
          address: '東京都千代田区1-1-1',
          notes: 'テストメモ',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          user_id: 1
        }
      ];

      render(
        <SimilarCards
          similarCards={cardsIncludingCurrent}
          currentCardId={currentCardId}
        />
      );

      // 現在の名刺は表示されない
      expect(screen.queryByText('田中太郎')).not.toBeInTheDocument();
      // 他の類似名刺は表示される
      expect(screen.getByText('佐藤花子')).toBeInTheDocument();
      expect(screen.getByText('田中次郎')).toBeInTheDocument();
    });
  });

  describe('レイアウト', () => {
    it('カード形式で表示される', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      expect(screen.getByText('類似名刺').closest('.card')).toBeInTheDocument();
    });

    it('グリッドレイアウトで表示される', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      const cardElement = screen.getByText('類似名刺').closest('.card');
      expect(cardElement?.querySelector('.row')).toBeInTheDocument();
    });
  });

  describe('リンク機能', () => {
    it('各名刺に詳細ページへのリンクが設定される', () => {
      render(
        <SimilarCards
          similarCards={mockSimilarCards}
          currentCardId={currentCardId}
        />
      );

      const card1Link = screen.getByText('佐藤花子');
      const card2Link = screen.getByText('田中次郎');

      expect(card1Link.closest('a')).toHaveAttribute('href', '/business_cards/2');
      expect(card2Link.closest('a')).toHaveAttribute('href', '/business_cards/3');
    });
  });
});
