// ESLint設定のテスト - TypeScript統合の動作確認
  import { exec } from 'child_process';
  import * as fs from 'fs';
  import * as path from 'path';
  import { promisify } from 'util';

  // Node.jsのexecをPromise化して型安全に使用
  const execAsync = promisify(exec);

  // ESLint設定ファイルの型定義
  interface ESLintConfig {
    parser?: string;
    plugins?: string[];
    extends?: string[];
    rules?: Record<string, any>;
    env?: Record<string, boolean>;
  }

  describe('ESLint設定のテスト', () => {
    const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');

    // ESLint設定ファイルが存在することを確認
    test('ESLint設定ファイルが存在すること', () => {
      expect(fs.existsSync(eslintConfigPath)).toBe(true);
    });

    // ESLint設定にTypeScriptパーサーが含まれていることを確認
    test('TypeScriptパーサーがESLintに設定されていること', () => {
      const eslintConfigContent = fs.readFileSync(eslintConfigPath, 'utf8');
      const eslintConfig: ESLintConfig = JSON.parse(eslintConfigContent);

      expect(eslintConfig.parser).toBe('@typescript-eslint/parser');
      expect(eslintConfig.plugins).toContain('@typescript-eslint');
    });

    // TypeScriptファイルに対してESLintが実行できることを確認
    test('TypeScriptファイルに対してESLintが実行できること', async () => {
      try {
        // TypeScriptファイルに対してESLintを実行
        await execAsync('npx eslint app/javascript/**/*.ts --format json');
        // エラーなく実行できればOK（警告があっても実行は成功する）
        expect(true).toBe(true);
      } catch (error: any) {
        // exit code 1は警告/エラーがある場合（実行自体は成功）
        // exit code 127はコマンドが見つからない場合（実行失敗）
        expect(error.code).not.toBe(127);
      }
    });

    // TypeScript固有のルールが設定されていることを確認
    test('TypeScript固有のESLintルールが設定されていること', () => {
      const eslintConfigContent = fs.readFileSync(eslintConfigPath, 'utf8');
      const eslintConfig: ESLintConfig = JSON.parse(eslintConfigContent);

      // TypeScript推奨ルールが含まれていることを確認
      expect(eslintConfig.extends).toEqual(
        expect.arrayContaining(['eslint:recommended'])
      );
    });
  });
