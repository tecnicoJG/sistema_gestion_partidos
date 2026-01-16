import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createBroadcastMiddleware } from './middleware/index.js';
import { deviceRoutes, gameRoutes } from './routes/index.js';
import { DeviceService, GameService } from './services/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());

// Serve display app
app.use(express.static(resolve(__dirname, '../display')));

const PORT = process.env['PORT'] || 3000;

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

// Apply broadcast middleware to game routes
app.use('/api/game', createBroadcastMiddleware(io), gameRoutes);

// Device routes
app.use('/api/device', deviceRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Initialize device and start the server
(async () => {
  try {
    await DeviceService.initialize();

    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
