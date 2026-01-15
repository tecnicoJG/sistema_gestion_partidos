import { PadelGameSession } from '@controller/types';
import { Request, Response } from 'express';
import { GameService } from '../services';

export class GameController {
  static getGameState(_req: Request, res: Response) {
    return res.json(GameService.getSession());
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

    const createdGame = GameService.createSession(newGame);
    return res.status(201).json(createdGame);
  }

  static updateGameState(req: Request, res: Response) {
    GameService.updateSession(req.body);
    return res.json(GameService.getSession());
  }

  static addPoint(req: Request, res: Response) {
    const team = parseInt(req.params['team'] || '');
    if (team !== 0 && team !== 1) {
      return res.status(400).json({ error: 'Team must be 0 or 1' });
    }

    GameService.addPoint(team as 0 | 1);
    return res.json(GameService.getSession());
  }

  static startMatch(_req: Request, res: Response) {
    GameService.startMatch();
    return res.json(GameService.getSession());
  }

  static changeServer(_req: Request, res: Response) {
    GameService.changeServer();
    return res.json(GameService.getSession());
  }

  static resetMatch(_req: Request, res: Response) {
    GameService.reset();
    return res.json(GameService.getSession());
  }

  static async getQRCode(_req: Request, res: Response) {
    try {
      const qrBuffer = await GameService.generateSessionQR();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', qrBuffer.length);
      return res.send(qrBuffer);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }
}
