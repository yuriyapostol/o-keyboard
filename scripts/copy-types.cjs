const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'types', 'index.d.ts');
const destDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(src)) {
  console.warn('types/index.d.ts not found, skipping copy.');
  process.exit(0);
}

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, path.join(destDir, 'index.d.ts'));
console.log('Copied types to dist/index.d.ts');