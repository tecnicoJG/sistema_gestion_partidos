import { Router } from 'express';
import { GameController } from '../controllers/game.controller';

const router = Router();

// Get current game state
router.get('/', GameController.getGameState);

// Create/Initialize new game
router.post('/', GameController.createGame);

// Update game state
router.patch('/', GameController.updateGameState);

// Add point to team
router.post('/point/:team', GameController.addPoint);

// Start match
router.post('/start', GameController.startMatch);

// Change server
router.post('/change-server', GameController.changeServer);

// Reset match
router.post('/reset', GameController.resetMatch);

export default router;
