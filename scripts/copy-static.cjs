const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const files = ['index.html', 'index.css'];

files.forEach(file => {
  const src = path.join(__dirname, '..', 'src', file);

  if (!fs.existsSync(src)) {
    console.warn(`src/${file} not found, skipping copy.`);
    process.exit(0);
  }

  fs.copyFileSync(src, path.join(destDir, file));
  console.log(`Copied demo to dist/${file}`);
});