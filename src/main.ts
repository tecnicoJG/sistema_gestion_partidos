import dotenv from 'dotenv';
import { createRequire } from 'module';
import { DeviceService } from '~/modules/device/index.js';
import * as server from '~/modules/server/index.js';

const require = createRequire(import.meta.url);
const Updater = require('./modules/updater/index.js');

dotenv.config();

const PORT = process.env['PORT'] || 3000;
const GITHUB_OWNER = process.env['GITHUB_OWNER'];
const GITHUB_REPO = process.env['GITHUB_REPO'];
const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

try {
  new Updater({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    token: GITHUB_TOKEN,
    preserveOnUpdate: ['.env', '.app_data'],
  });
} catch (error) {
  console.error('Failed to initialize updater:', error);
}

await DeviceService.initialize().catch((error) => {
  console.error('Failed to initialize device:', error);
  process.exit(1);
});

await server.start(PORT).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
