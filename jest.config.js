module.exports = {
  // TypeScript サポートの設定
  preset: 'ts-jest',

  // テスト環境をブラウザ環境に設定（DOM API使用のため）
  testEnvironment: 'jsdom',

  // テストファイルの検索パターン
  testMatch: [
    '<rootDir>/spec/javascript/**/*.(test|spec).(js|ts|tsx)'
  ],

  // TypeScript ファイルの変換設定
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  // モジュール解決設定（tsconfig.json のパスエイリアスと同期）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1'
  },

  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/spec/javascript/setup.ts'],

  // カバレッジ対象ファイル
  collectCoverageFrom: [
    'app/javascript/**/*.{ts,tsx}',
    '!app/javascript/**/*.d.ts'
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx']
};
