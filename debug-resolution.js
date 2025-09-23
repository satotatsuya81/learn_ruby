// TypeScriptモジュール解決のデバッグスクリプト
const fs = require('fs');
const path = require('path');

console.log('=== TypeScript Module Resolution Debug ===');
console.log('Current working directory:', process.cwd());
console.log('Node.js version:', process.version);

// tsconfig.jsonの確認
const tsconfigPath = path.resolve('./tsconfig.json');
console.log('tsconfig.json exists:', fs.existsSync(tsconfigPath));

if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('baseUrl:', tsconfig.compilerOptions?.baseUrl);
    console.log('paths:', tsconfig.compilerOptions?.paths);
  } catch (e) {
    console.log('Error reading tsconfig.json:', e.message);
  }
}

// User.tsファイルの確認
const userTypePath = path.resolve('./app/javascript/types/User.ts');
console.log('User.ts path:', userTypePath);
console.log('User.ts exists:', fs.existsSync(userTypePath));

if (fs.existsSync(userTypePath)) {
  const stats = fs.statSync(userTypePath);
  console.log('User.ts size:', stats.size, 'bytes');
  console.log('User.ts modified:', stats.mtime);

  try {
    const content = fs.readFileSync(userTypePath, 'utf8');
    console.log('User.ts first line:', content.split('\n')[0]);
    console.log('User.ts exports found:', (content.match(/export/g) || []).length);
  } catch (e) {
    console.log('Error reading User.ts:', e.message);
  }
}

// TypeScript解決テスト
console.log('\n=== Path Resolution Test ===');
const basePath = path.resolve('.');
const typesPath = path.resolve('./app/javascript/types');
const userPath = path.resolve('./app/javascript/types/User');

console.log('Base path:', basePath);
console.log('Types path:', typesPath);
console.log('User path (without .ts):', userPath);
console.log('User.ts path:', userPath + '.ts');

console.log('Types directory exists:', fs.existsSync(typesPath));
console.log('User.ts file exists:', fs.existsSync(userPath + '.ts'));