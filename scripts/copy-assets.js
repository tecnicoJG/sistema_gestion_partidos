import { cpSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('📦 Copying assets to dist/...\n');

// Copy display static files
const displaySrc = 'src/modules/display';
const displayDest = 'dist/modules/display';

if (!existsSync(displayDest)) {
  mkdirSync(displayDest, { recursive: true });
}

cpSync(displaySrc, displayDest, { recursive: true });
console.log('✓ Copied display files');

// Copy updater (CommonJS .js file)
const updaterSrc = 'src/modules/updater/index.js';
const updaterDest = 'dist/modules/updater';

if (!existsSync(updaterDest)) {
  mkdirSync(updaterDest, { recursive: true });
}

copyFileSync(updaterSrc, join(updaterDest, 'index.js'));
console.log('✓ Copied updater');

// Copy default config files
const defaultsSrc = 'src/lib/defaults';
const defaultsDest = 'dist/lib/defaults';

if (!existsSync(defaultsDest)) {
  mkdirSync(defaultsDest, { recursive: true });
}

cpSync(defaultsSrc, defaultsDest, { recursive: true });
console.log('✓ Copied default configs');

// Copy shared assets
const assetsSrc = 'src/modules/assets';
const assetsDest = 'dist/modules/assets';

if (!existsSync(assetsDest)) {
  mkdirSync(assetsDest, { recursive: true });
}

cpSync(assetsSrc, assetsDest, { recursive: true });
console.log('✓ Copied shared assets');

console.log('\n✅ Asset copy complete!');
