import { render, screen, fireEvent } from '@testing-library/react';
import { BusinessCardDetail } from '@/components/BusinessCardDetail';
import { BusinessCard } from '@/types//BusinessCard';

describe('BusinessCardDetail', () => {
  const mockBusinessCard: BusinessCard = {
    id: 1,
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
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  describe('名刺情報の表示', () => {
    it('名前を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('田中太郎')).toBeInTheDocument();
    });

    it('会社名を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('テスト株式会社')).toBeInTheDocument();
    });

    it('役職を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('エンジニア')).toBeInTheDocument();
    });

    it('部署を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('開発部')).toBeInTheDocument();
    });

    it('メールアドレスを表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('tanaka@test.com')).toBeInTheDocument();
    });

    it('電話番号を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('03-1234-5678')).toBeInTheDocument();
    });

    it('携帯電話を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('090-1234-5678')).toBeInTheDocument();
    });

    it('ウェブサイトを表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('https://test.com')).toBeInTheDocument();
    });

    it('住所を表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('東京都千代田区1-1-1')).toBeInTheDocument();
    });

    it('メモを表示する', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('テストメモ')).toBeInTheDocument();
    });
  });

  describe('オプション項目の表示制御', () => {
    it('値が空の場合は表示しない', () => {
      const incompleteCard = {
        ...mockBusinessCard,
        job_title: '',
        department: '',
        phone: '',
        mobile: '',
        website: '',
        address: '',
        notes: ''
      };

      render(
        <BusinessCardDetail
          businessCard={incompleteCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.queryByText('役職:')).not.toBeInTheDocument();
      expect(screen.queryByText('部署:')).not.toBeInTheDocument();
      expect(screen.queryByText('電話番号:')).not.toBeInTheDocument();
      expect(screen.queryByText('携帯電話:')).not.toBeInTheDocument();
      expect(screen.queryByText('ウェブサイト:')).not.toBeInTheDocument();
      expect(screen.queryByText('住所:')).not.toBeInTheDocument();
      expect(screen.queryByText('メモ:')).not.toBeInTheDocument();
    });
  });

  describe('操作ボタン', () => {
    it('編集ボタンが表示される', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    });

    it('削除ボタンが表示される', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
    });

    it('名刺一覧へ戻るボタンが表示される', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: '名刺一覧に戻る' })).toBeInTheDocument();
    });

    it('編集ボタンクリックでonEdit関数が呼ばれる', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '編集' }));
      expect(mockOnEdit).toHaveBeenCalledWith(mockBusinessCard.id);
    });

    it('削除ボタンクリックでonDelete関数が呼ばれる', () => {
      render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '削除' }));
      expect(mockOnDelete).toHaveBeenCalledWith(mockBusinessCard.id);
    });
  });

  describe('表示スタイル', () => {
    it('カード形式で表示される', () => {
      const { container } = render(
        <BusinessCardDetail
          businessCard={mockBusinessCard}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(container.querySelector('.card')).toBeInTheDocument();
    });
  });
});
