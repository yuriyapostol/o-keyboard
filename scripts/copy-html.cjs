const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'index.html');
const destDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(src)) {
  console.warn('src/index.html not found, skipping copy.');
  process.exit(0);
}

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, path.join(destDir, 'index.html'));
console.log('Copied demo to dist/index.html');