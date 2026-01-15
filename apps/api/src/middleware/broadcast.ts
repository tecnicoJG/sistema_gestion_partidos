import { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';
import { GameService } from '../services';

export function createBroadcastMiddleware(io: Server) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Intercept res.json to broadcast after response
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      // Send response to client first
      const result = originalJson(body);

      // Then broadcast to all connected clients if it's a game state mutation
      if (
        req.method === 'POST' ||
        req.method === 'PATCH' ||
        req.method === 'PUT' ||
        req.method === 'DELETE'
      ) {
        const currentState = GameService.getSession();
        if (currentState) {
          io.emit('gameState', currentState);
        }
      }

      return result;
    };

    next();
  };
}
