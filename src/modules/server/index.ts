import { createServer } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import { Server } from 'socket.io';


import { createBroadcastMiddleware } from './middleware/index.js';
import { deviceRoutes, gameRoutes, updaterRoutes } from './routes/index.js';

import { GameService } from '~/modules/game/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());

// Serve static assets
app.use('/assets', express.static(resolve(__dirname, '../assets')));
app.use('/public', express.static(resolve(__dirname, '../../../.app_data/public')));

// Serve display app
app.use('/display', express.static(resolve(__dirname, '../display')));

// Serve portal app (SPA - all routes return index.html)
const portalPath = resolve(__dirname, '../portal');
app.use(express.static(portalPath));
app.get('*', (req, res, next) => {
  // Skip API routes and other static paths
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/display') ||
    req.path.startsWith('/assets') ||
    req.path.startsWith('/public') ||
    req.path.startsWith('/socket.io')
  ) {
    return next();
  }
  res.sendFile(resolve(portalPath, 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current game state on connection
  const currentState = GameService.getSession();
  if (currentState) {
    socket.emit('gameState', currentState);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Configure API routes
app.use('/api/game', createBroadcastMiddleware(io), gameRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/updater', updaterRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export function start(port: number | string): Promise<void> {
  return new Promise((resolve, reject) => {
    httpServer.listen(port, () => {
      resolve();
    });

    httpServer.on('error', (error) => {
      reject(error);
    });
  });
}
