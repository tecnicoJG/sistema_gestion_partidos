import { Router } from 'express';
import {
  getAPQRCodeSchema,
  getDeviceConfigSchema,
  restartDeviceSchema,
  updateDeviceConfigSchema,
} from '~/lib/validation/index.js';
import { DeviceController } from '../controllers/index.js';
import { validate } from '../middleware/index.js';

const router = Router();

router.get('/config', validate(getDeviceConfigSchema), DeviceController.getConfig);
router.post('/config', validate(updateDeviceConfigSchema), DeviceController.updateConfig);
router.get('/ap-qr', validate(getAPQRCodeSchema), DeviceController.getAPQRCode);
router.post('/restart', validate(restartDeviceSchema), DeviceController.restart);

export default router;
