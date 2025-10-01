// scripts/copy-icons.js
// Copies your existing assets/icon.png into root-level filenames
// that iOS/Android/web look for after `expo export --platform web`.

const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const src = path.join(__dirname, '..', 'assets', 'icon.png');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

function copy(name) {
  const dest = path.join(dist, name);
  fs.copyFileSync(src, dest);
  console.log(`Copied assets/icon.png -> dist/${name}`);
}

// Common names iOS and PWAs like:
copy('apple-touch-icon.png');
copy('apple-touch-icon-180x180.png');
copy('favicon-192.png');
copy('favicon-512.png');
