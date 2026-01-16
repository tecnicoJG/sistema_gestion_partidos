import { cpSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('📦 Copying assets to dist/...\n');

// Copy display static files
const displaySrc = 'src/services/display';
const displayDest = 'dist/services/display';

if (!existsSync(displayDest)) {
  mkdirSync(displayDest, { recursive: true });
}

cpSync(displaySrc, displayDest, { recursive: true });
console.log('✓ Copied display files');

// Copy updater (CommonJS .js file)
const updaterSrc = 'src/services/updater/Updater.js';
const updaterDest = 'dist/services/updater';

if (!existsSync(updaterDest)) {
  mkdirSync(updaterDest, { recursive: true });
}

copyFileSync(updaterSrc, join(updaterDest, 'Updater.js'));
console.log('✓ Copied updater');

// Copy default config files
const defaultsSrc = 'src/lib/defaults';
const defaultsDest = 'dist/lib/defaults';

if (!existsSync(defaultsDest)) {
  mkdirSync(defaultsDest, { recursive: true });
}

cpSync(defaultsSrc, defaultsDest, { recursive: true });
console.log('✓ Copied default configs');

console.log('\n✅ Asset copy complete!');
