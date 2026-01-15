# Portal SPA Development Plan

## System Architecture Overview

Based on the existing codebase exploration, the controller system is a monorepo using npm workspaces:

```
/
├── apps/
│   ├── api/              # Express.js backend API
│   ├── display/          # Display app (court scoreboard)
│   └── portal/           # (Empty - where portal SPA goes)
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── constants/        # Shared constants
│   └── validation/       # Zod validation schemas
├── config/
│   └── device/
│       └── config.json   # Device configuration
└── package.json          # Root workspace config
```

### Existing API App (apps/api)

**Stack:**
- Express 4.21.0
- Socket.IO 4.8.0
- Zod (validation)
- QRCode generation

**Architecture Layers:**
1. **Routes** (`src/routes/`) - Game and device endpoints
2. **Controllers** (`src/controllers/`) - Request handlers
3. **Services** (`src/services/`) - Business logic
   - `GameService` - Singleton managing game state in memory
   - `DeviceService` - Manages device configuration (JSON file)
4. **Middleware** (`src/middleware/`) - Broadcasting, auth

**API Endpoints:**
```
GET  /api/health                    # Health check
GET  /api/game                      # Get current game state
POST /api/game                      # Create new game
PATCH /api/game                     # Update game state
POST /api/game/point/:team          # Add point to team (0 or 1)
POST /api/game/start                # Start match
POST /api/game/change-server        # Rotate server
POST /api/game/reset                # Reset match
GET  /api/game/qr                   # Get session QR code (PNG)

GET  /api/device                    # Get device config
GET  /api/device/ap-qr              # Get WiFi AP QR code (PNG)
POST /api/device/restart            # Restart device
```

**Socket.IO Events:**
- Server emits `gameState` whenever game state changes
- Clients listen for real-time updates (read-only)

### Existing Display App (apps/display)

Simple vanilla JavaScript court scoreboard:
- Static HTML/CSS/JS served from API server root
- Connects via Socket.IO for real-time score updates
- Multiple view modes: scoreboard, coin toss, QR codes
- Light/dark theme support

### Shared Packages

#### @controller/types - TypeScript Interfaces

**Game Types:**
```typescript
interface GameSession {
  sport: Sports | null;
  sessionToken: string;
  status: 'idle' | 'pending_start' | 'in_game' | 'finished';
  sessionConfig?: { startAt?: Date; duration?: number };
  preferredTheme?: 'light' | 'dark';
}

interface PadelGameSession extends GameSession {
  sport: 'padel';
  matchState: {
    sets: [number, number][];           // Completed sets
    currentSetGames: [number, number];   // Current set score
    currentGamePoints: [number, number]; // Current game points
    servingTeam: 0 | 1;
    servingPlayer: 0 | 1;
  };
  players: [[Player, Player], [Player, Player]]; // 2 teams × 2 players
  matchConfig: {
    setsToWin: number;
    gamesToWinSet: number;
    goldenPointEnabled: boolean;
    tieBreakEnabled: boolean;
    superTieBreakEnabled: boolean;
  };
}

type Player = AccountPlayer | GuestPlayer;
interface AccountPlayer { type: 'account'; accountId: string; name?: string; }
interface GuestPlayer { type: 'guest'; name?: string; email?: string; }
```

**Device Types:**
```typescript
interface DeviceConfiguration {
  deviceFamily: string;      // e.g., "01"
  deviceId: string;          // Generated ID like "010MKCEADZ6Y3"
  status: 'available' | 'occupied' | 'maintenance' | 'setup' | 'warning' | 'error';
  courtName?: string;
  availableSports: Sports[];
  venue?: { name: string; address?: string };
  networkConfig: NetworkConfig;  // AP or client mode
  locale: 'es' | 'en';
  smtpConfig?: SMTPConfig;
  theme: { primaryColor?: string; default: 'light' | 'dark' };
  credentials?: { adminPIN: string; staffPIN?: string };
}

type NetworkConfig = APConfig | ClientConfig;
type AuthContext = SessionAuthContext | DeviceAuthContext;
```

#### @controller/constants
```typescript
export const ROLES = ['guest', 'Player', 'staff', 'admin'];
export const PADEL_POINTS = ['0', '15', '30', '40', 'AD'];
```

#### @controller/validation
Zod schemas for comprehensive API request validation.

---

## Portal SPA Plan

### Technical Stack (Raspberry Pi Optimized)

1. **Build Tool**: **Vite** (fast, minimal overhead)
2. **Framework**: **React 18** with functional components
3. **State Management**: **Zustand** (~1KB, lightweight)
4. **Styling**: **TailwindCSS** (purged CSS, tiny bundle)
5. **HTTP Client**: **fetch** (native)
6. **Socket.IO Client**: `socket.io-client`
7. **Router**: **React Router v6** (code-split routes)
8. **Build Output**: Static files served by Express

**Bundle Size Target**: < 150KB gzipped

---

### Portal Features & Routes

#### Public Access (No Auth)
- `/` - Landing/Status page showing court availability
- `/session/:token` - Join active match session (guest view)

#### Admin/Staff Access (PIN Protected)
- `/admin` - Admin dashboard
- `/admin/device` - Device configuration
- `/admin/match/new` - Create new match
- `/admin/match/:id` - Manage active match
- `/admin/network` - Network settings (WiFi/AP mode)
- `/admin/system` - System controls (restart, logs, theme)

---

### Key Portal Components

#### Match Management
- **Match Creator**: Form to configure new Padel matches
  - Player entry (account/guest selection)
  - Match rules (sets, games, golden point, tiebreak)
  - Session settings (start time, duration, theme)
- **Match Controller**: Real-time match controls
  - Add points to teams
  - Start/pause/reset match
  - Change server manually
  - Live scoreboard view
  - Player substitution
- **Match History**: View past sessions (if persistence added later)

#### Device Configuration
- **Device Info Panel**: Display device ID, status, court name
- **Venue Settings**: Configure venue name, address
- **Network Config**:
  - Toggle AP/Client mode
  - Configure WiFi credentials
  - Display connection QR codes
- **System Settings**:
  - Locale selection (en/es)
  - Theme customization (primary color, default light/dark)
  - SMTP configuration for email notifications
  - PIN management

#### Real-time Dashboard
- Current match status
- Connected clients count (via Socket.IO)
- Device health status
- Quick actions (QR codes, restart)

---

### Project Structure

```
apps/portal/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component with router
│   ├── api/
│   │   ├── client.ts            # Fetch wrapper
│   │   ├── game.api.ts          # Game endpoints
│   │   └── device.api.ts        # Device endpoints
│   ├── hooks/
│   │   ├── useGameState.ts      # Socket.IO game state hook
│   │   ├── useDeviceConfig.ts   # Device config hook
│   │   └── useAuth.ts           # Auth context hook
│   ├── stores/
│   │   └── authStore.ts         # Zustand auth store
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── match/
│   │   │   ├── MatchCreator.tsx
│   │   │   ├── ScoreBoard.tsx
│   │   │   ├── PlayerCard.tsx
│   │   │   └── MatchControls.tsx
│   │   ├── device/
│   │   │   ├── DeviceInfo.tsx
│   │   │   ├── NetworkConfig.tsx
│   │   │   └── QRCodeDisplay.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Card.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── SessionView.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── MatchNew.tsx
│   │   ├── MatchManage.tsx
│   │   ├── DeviceConfig.tsx
│   │   └── NetworkSettings.tsx
│   ├── types/                   # Re-export from @controller/types
│   ├── utils/
│   │   └── formatting.ts        # Date, score formatting
│   └── styles/
│       └── index.css            # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── tailwind.config.js           # (if using Tailwind)
```

---

### Performance Optimizations for Raspberry Pi

1. **Code Splitting**: Lazy-load admin routes
   ```tsx
   const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
   ```

2. **Asset Optimization**:
   - Use WebP images with fallbacks
   - Inline critical CSS
   - Tree-shake unused dependencies
   - Minify with esbuild (Vite default)

3. **Bundle Analysis**: Use `rollup-plugin-visualizer` to monitor bundle size

4. **Minimal Dependencies**:
   - Avoid heavy libraries (moment.js → native Date, lodash → native methods)
   - Use native browser APIs where possible

5. **Server-Side Considerations**:
   - Serve pre-compressed Brotli/Gzip assets
   - HTTP/2 support for multiplexing
   - Aggressive cache headers

---

### Integration with Existing System

1. **Shared Types**: Import from `@controller/types`
   ```tsx
   import type { PadelGameSession, DeviceConfiguration } from '@controller/types'
   ```

2. **API Base URL**: Environment-based configuration
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
   ```

3. **Socket.IO Connection**:
   ```typescript
   const socket = io(API_URL, {
     transports: ['websocket'],
     reconnection: true
   })
   ```

4. **Express Integration**: Serve from `apps/api/src/index.ts`
   ```typescript
   // Serve portal static files
   app.use('/portal', express.static(path.join(__dirname, '../../portal/dist')))

   // Fallback for SPA routing
   app.get('/portal/*', (req, res) => {
     res.sendFile(path.join(__dirname, '../../portal/dist/index.html'))
   })
   ```

---

### Development Workflow

1. **Local Development**:
   - Run API: `npm run dev -w @controller/api` (port 3000)
   - Run Portal: `npm run dev -w @controller/portal` (port 5173)
   - Portal proxies API requests to localhost:3000

2. **Build**: `npm run build -w @controller/portal`
   - Outputs to `apps/portal/dist/`
   - API serves these static files

3. **Testing on Raspberry Pi**:
   - Build portal locally
   - Copy `dist/` to Pi
   - Run API server
   - Access via Pi's IP on port 3000

---

### Implementation Steps

#### Phase 1: Project Setup
- Initialize Vite React + TypeScript project in `apps/portal/`
- Configure package.json with workspace dependencies
- Set up TailwindCSS
- Configure Vite proxy for development
- Set up TypeScript with shared types

#### Phase 2: Core Infrastructure
- API client setup with TypeScript
- Socket.IO hook for real-time updates
- Auth store and routing guards
- Shared component library (Button, Input, Card)
- Layout components (Header, Sidebar)

#### Phase 3: Feature Development (Priority Order)
1. **Device Info Dashboard** (read-only, simple)
2. **Match Viewer** (Socket.IO integration test)
3. **Match Creator** (complex form, validation)
4. **Device Configuration** (network, system settings)

#### Phase 4: API Server Integration
- Add static file serving to Express
- Configure SPA fallback routing
- Test on Raspberry Pi hardware

---

### Data Flow

```
User/Admin Interface (Portal SPA)
         ↓
    REST API Endpoints (Express)
         ↓
    Services (GameService, DeviceService)
         ↓
    In-Memory State / JSON Files
         ↓
    Socket.IO Broadcast Middleware
         ↓
    All Connected Clients (Display, Portal, Mobile)
```

---

### Key Design Principles

1. **Lightweight**: Every dependency must justify its bundle size cost
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Mobile-First**: Responsive design for tablets/phones
4. **Offline-Capable**: Service worker for offline access (optional)
5. **Accessible**: WCAG 2.1 AA compliance
6. **Fast**: Target < 2s initial load on Raspberry Pi WiFi
7. **Maintainable**: Shared types prevent API/UI drift
