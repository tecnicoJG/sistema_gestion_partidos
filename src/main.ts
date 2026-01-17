import dotenv from 'dotenv';
import { DeviceService } from '~/modules/device/index.js';
import * as server from '~/modules/server/index.js';

dotenv.config();

const PORT = process.env['PORT'] || 3000;

await DeviceService.initialize().catch((error) => {
  console.error('Failed to initialize device:', error);
  process.exit(1);
});

await server.start(PORT).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
