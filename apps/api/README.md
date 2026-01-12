# Game Controller API

Backend API for managing padel game sessions with real-time updates via Socket.IO.

## Setup

```bash
npm install
npm run build
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Game Management

#### Get Current Game State
- `GET /api/game` - Returns current game session or 404 if none exists

#### Create New Game
- `POST /api/game` - Create a new game session
  - Body (optional): Partial game session configuration
  - Returns: Created game session

#### Update Game State
- `PATCH /api/game` - Update game session properties
  - Body: Partial game session updates
  - Returns: Updated game session

#### Game Actions

- `POST /api/game/start` - Start the match (changes status to 'in_game')
- `POST /api/game/point/:team` - Add a point to team (0 or 1)
  - Automatically handles game/set logic
- `POST /api/game/change-server` - Rotate to next server
- `POST /api/game/reset` - Reset match to initial state

## Socket.IO Events

### Client Events

- `connect` - Client connected to server
- `disconnect` - Client disconnected from server

### Server Events

- `gameState` - Sent whenever game state changes
  - On client connection (current state)
  - After any game state modification

## Game State Structure

```typescript
{
  sessionToken: string;
  sport: 'padel';
  status: 'idle' | 'pending_start' | 'in_game' | 'finished';
  matchState: {
    sets: [number, number][];  // Completed sets
    currentSetGames: [number, number];  // Games in current set
    currentGamePoints: [number, number];  // Points in current game
    servingTeam: 0 | 1;
    servingPlayer: 0 | 1;
  };
  players: [[Player, Player], [Player, Player]];
  matchConfig: {
    setsToWin: number;
    gamesToWinSet: number;
    goldenPointEnabled: boolean;
    tieBreakEnabled: boolean;
    superTieBreakEnabled: boolean;
  };
}
```

## Example Usage

### Create a new game
```bash
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -d '{
    "players": [
      [
        {"type": "guest", "name": "Alice"},
        {"type": "guest", "name": "Bob"}
      ],
      [
        {"type": "guest", "name": "Charlie"},
        {"type": "guest", "name": "David"}
      ]
    ]
  }'
```

### Start the match
```bash
curl -X POST http://localhost:3000/api/game/start
```

### Add a point to team 1
```bash
curl -X POST http://localhost:3000/api/game/point/0
```

### Add a point to team 2
```bash
curl -X POST http://localhost:3000/api/game/point/1
```
