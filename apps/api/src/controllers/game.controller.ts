import { Request, Response } from 'express';
import { PadelGameSession } from '@controller/types';
import { GameService } from '../services';

export class GameController {
  static getGameState(_req: Request, res: Response) {
    if (!GameService.hasActiveGame()) {
      return res.status(404).json({ error: 'No active game session' });
    }
    return res.json(GameService.getState());
  }

  static createGame(req: Request, res: Response) {
    const newGame: PadelGameSession = {
      sessionToken: Math.random().toString(36).substring(7),
      sport: 'padel',
      status: 'idle',
      sessionConfig: {},
      matchState: {
        sets: [],
        currentSetGames: [0, 0],
        currentGamePoints: [0, 0],
        servingTeam: 0,
        servingPlayer: 0,
      },
      players: [
        [
          { type: 'guest', name: 'Player 1' },
          { type: 'guest', name: 'Player 2' },
        ],
        [
          { type: 'guest', name: 'Player 3' },
          { type: 'guest', name: 'Player 4' },
        ],
      ],
      matchConfig: {
        setsToWin: 2,
        gamesToWinSet: 6,
        goldenPointEnabled: false,
        tieBreakEnabled: true,
        superTieBreakEnabled: true,
      },
      ...req.body,
    };

    const createdGame = GameService.createGame(newGame);
    return res.status(201).json(createdGame);
  }

  static updateGameState(req: Request, res: Response) {
    if (!GameService.hasActiveGame()) {
      return res.status(404).json({ error: 'No active game session' });
    }

    GameService.setState(req.body);
    return res.json(GameService.getState());
  }

  static addPoint(req: Request, res: Response) {
    if (!GameService.hasActiveGame()) {
      return res.status(404).json({ error: 'No active game session' });
    }

    const team = parseInt(req.params['team'] || '');
    if (team !== 0 && team !== 1) {
      return res.status(400).json({ error: 'Team must be 0 or 1' });
    }

    GameService.addPoint(team as 0 | 1);
    return res.json(GameService.getState());
  }

  static startMatch(_req: Request, res: Response) {
    if (!GameService.hasActiveGame()) {
      return res.status(404).json({ error: 'No active game session' });
    }

    GameService.startMatch();
    return res.json(GameService.getState());
  }

  static changeServer(_req: Request, res: Response) {
    if (!GameService.hasActiveGame()) {
      return res.status(404).json({ error: 'No active game session' });
    }

    GameService.changeServer();
    return res.json(GameService.getState());
  }

  static resetMatch(_req: Request, res: Response) {
    if (!GameService.hasActiveGame()) {
      return res.status(404).json({ error: 'No active game session' });
    }

    GameService.reset();
    return res.json(GameService.getState());
  }
}
