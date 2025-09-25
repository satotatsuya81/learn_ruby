import React, { useState, useCallback } from 'react';
  import { useDebounce } from '@/hooks/useDebounce';

  interface SearchInputProps {
    value: string;
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
    debounceMs?: number;
    showClearButton?: boolean;
    className?: string;
    'aria-label'?: string;
  }

  export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onSearch,
    placeholder = '検索...',
    debounceMs = 300,
    showClearButton = false,
    className = '',
    'aria-label': ariaLabel
  }) => {
    // ローカル状態で入力値を管理（即座に表示を更新するため）
    const [inputValue, setInputValue] = useState(value);

    // デバウンス処理された値でonSearchを実行
    const debouncedInputValue = useDebounce(inputValue, debounceMs);

    // デバウンス値が変更されたらonSearchを呼び出し（初期値は除く）
    const isInitialMount = React.useRef(true);
    React.useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      onSearch(debouncedInputValue);
    }, [debouncedInputValue, onSearch]);

    // 外部からのvalue変更を反映（親コンポーネントからの制御）
    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    // 入力値変更ハンドラー
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    }, []);

    // クリアボタンハンドラー（即座に実行、デバウンスなし）
    const handleClear = useCallback(() => {
      setInputValue('');
      onSearch(''); // クリアは即座に実行
    }, [onSearch]);

    return (
      <div className={`input-group ${className}`}>
        <input
          type="search"
          role="searchbox"
          className="form-control"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label={ariaLabel || placeholder}
        />
        {showClearButton && inputValue && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClear}
            aria-label="クリア"
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        )}
      </div>
    );
  };
