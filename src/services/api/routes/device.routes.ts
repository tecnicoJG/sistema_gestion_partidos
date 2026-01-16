import { Router } from 'express';
import { DeviceController } from '../controllers/index.js';

const router = Router();

router.get('/', DeviceController.getConfig);
router.get('/ap-qr', DeviceController.getAPQRCode);
router.post('/restart', DeviceController.restart);

export default router;
