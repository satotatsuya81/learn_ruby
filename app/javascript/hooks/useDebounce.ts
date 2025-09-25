// デバウンス処理を行うカスタムフック
// 値の変更を指定した遅延時間後に適用し、連続した変更は最後の値のみ反映する
import { useState, useEffect } from 'react';

/**
 * useDebounce - 値の変更をデバウンス処理するカスタムフック
 *
 * @param value - デバウンス処理を行う値（任意の型T）
 * @param delay - 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 *
 * 学習ポイント:
 * - Reactの基本的なHooks（useState, useEffect）の組み合わせパターン
 * - TypeScriptジェネリクス<T>による型安全な汎用実装
 * - setTimeout/clearTimeoutによるタイマー制御とメモリリーク防止
 */
export function useDebounce<T>(value: T, delay: number): T {
  // デバウンスされた値を管理するstate
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 指定された遅延時間後に値を更新するタイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数: 次のuseEffect実行時や component unmount時に
    // 前のタイマーをクリアしてメモリリークを防ぐ
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // valueまたはdelayが変更されたときのみ実行

  return debouncedValue;
}