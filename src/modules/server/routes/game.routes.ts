import { Router } from 'express';

import { GameController } from '../controllers/index.js';
import { validate } from '../middleware/index.js';

import {
  createGameSchema,
  getGameSchema,
  getSessionCodeSchema,
  resetGameSchema,
  startGameSchema,
} from '~/lib/validation/index.js';

const router = Router();

// Get current game state
router.get('/', validate(getGameSchema), GameController.getGameState);

// Create/Initialize new game
router.post('/', validate(createGameSchema), GameController.createGame);

// Update game state
router.patch('/', GameController.updateGameState);

// Add point to team
router.post('/point/:team', GameController.addPoint);

// Start match
router.post('/start', validate(startGameSchema), GameController.startMatch);

// Change server
router.post('/change-server', GameController.changeServer);

// Reset match
router.post('/reset', validate(resetGameSchema), GameController.resetMatch);

// Session QR Code
router.get('/qr', validate(getSessionCodeSchema), GameController.getQRCode);

export default router;
