import { minify } from 'terser';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Recursively minify all .js files in a directory
 */
async function minifyDirectory(dir) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively minify subdirectories
      await minifyDirectory(fullPath);
    } else if (entry.endsWith('.js')) {
      // Minify JS file
      try {
        const code = readFileSync(fullPath, 'utf8');
        const result = await minify(code, {
          compress: {
            dead_code: true,
            drop_console: false, // Keep console.log for debugging
            drop_debugger: true,
            pure_funcs: [], // Don't remove any functions
          },
          mangle: {
            keep_classnames: true, // Keep class names for better stack traces
            keep_fnames: false, // Mangle function names
          },
          format: {
            comments: false, // Remove all comments
          },
          module: true, // ESM support
        });

        if (result.code) {
          const originalSize = code.length;
          const minifiedSize = result.code.length;
          const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

          writeFileSync(fullPath, result.code, 'utf8');
          console.log(`✓ ${fullPath} (${savings}% smaller)`);
        }
      } catch (error) {
        console.error(`✗ Failed to minify ${fullPath}:`, error.message);
      }
    }
  }
}

console.log('🔧 Minifying JavaScript files...\n');

// Minify entry point
await minifyDirectory('dist');

// Minify all modules (server, device, game, updater, display)
await minifyDirectory('dist/modules');

// Minify lib
await minifyDirectory('dist/lib');

console.log('\n✅ Minification complete!');
