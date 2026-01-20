import { Router } from 'express';

import { UpdaterController } from '../controllers/index.js';

const router = Router();

router.get('/check', UpdaterController.check);
router.post('/download', UpdaterController.download);
router.post('/install', UpdaterController.install);
router.get('/state', UpdaterController.getState);
router.post('/clear-downloads', UpdaterController.clearDownloads);
router.post('/rollback', UpdaterController.rollback);
router.get('/rollback-info', UpdaterController.getRollbackInfo);
router.post('/clear-backups', UpdaterController.clearBackups);

export default router;
