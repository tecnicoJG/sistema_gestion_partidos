import { Router } from 'express';
import { DeviceController } from '../controllers/device.controller';

const router = Router();

router.get('/', DeviceController.getConfig);
router.get('/qr', DeviceController.getQRCode);

export default router;
