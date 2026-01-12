# Court Controller - Webapp Features

## Product Overview
Multi-sport court controller/hub for sports venues. Serves both staff and players with role-based access.

**Initial Focus:** Padel (architecture supports future sports)

## Authentication & Access Control

### Four Permission Levels

1. **Guest** - Unauthenticated access → read-only scoreboard (no sensitive data)
2. **Player** - Token-based authentication → full game control
   - **Session token** (QR scan) → revoked when game ends
   - **Device token** (admin-paired kiosk) → persistent across games
3. **Staff** - Credential login → bookings, reservations, multi-court operations
4. **Administrator** - Credential login → full system config, network, peripherals

### Token Types & Session Management

**Session Token (Mobile Players):**
- Generated per game session
- Accessed via QR code scan
- Auto-revoked when game ends or new players start
- Shared among players/referees of current game

**Device Token (Kiosk Tablet):**
- Admin pairs tablet once via device pairing
- Persistent token stored in device localStorage
- Never expires, survives game transitions
- Allows next players to configure new games
- Optional hardware addon

**Public Access:**
- No authentication required
- Read-only scoreboard visible to anyone on venue LAN
- No player names or sensitive data (privacy)
- Matches physical court scoreboard display

## Core Functionality

### Sport Configuration
- Multi-sport support (UI adapts to active sport)
- Court can support multiple sports (not simultaneously)
- Sport-specific rules, scoring, and UI components
- **v1: Padel only**

### Game State Management
- Start/pause/resume/end game
- Game timer (sport-specific: count up/down)
- Match progress (sets, games, points for Padel)
- Current game status display

### Scoring (Padel-specific initially)
- Point tracking (15-30-40-game)
- Game tracking within sets
- Set tracking (best of 3/5)
- Golden point support
- Score adjustment/correction
- Undo last point

### Player/Team Information
- Team names (Padel: 2v2)
- Player names per team
- Serve tracking
- Side switching (automatic per Padel rules)

### Court Control
- Lighting control (on/off/dimming via relays)
- Court availability status (available/occupied/maintenance)
- Booking integration (future with master)

### Settings
- Sport selection and rules configuration
- Court identification (number/name)
- Device configuration (admin only)
- Network settings (admin only)
- Peripheral device config (admin only)

## UI Requirements

### Public View (Unauthenticated)
- Live scoreboard display
- Current score and timer
- Game progress indicator
- No player names or sensitive data
- No controls (read-only)

### Player View (Session/Device Token)
- Full game controls (start/pause/end/score)
- Score entry and adjustment
- Player/team name management
- Lighting controls (on/off/dimming)
- Timer controls
- QR code generation/sharing
- Serve tracking
- Undo last action
- **Available on:** Mobile (QR scan) or Kiosk (paired tablet)

### Staff View
- All Player features
- Booking management
- Reservation system
- Multi-court overview (if master connected)
- Court status management
- Player session management

### Admin View
- All Staff features
- System configuration
- Network settings
- Peripheral device management (Bluetooth, RS-485, relays)
- Sport configuration
- Kiosk device pairing
- Debug/diagnostics

### Sport-Adaptive UI
- Components render based on active sport
- Padel: sets/games/points layout
- Future: basketball quarter/score, football halves/score, etc.

## Real-time Features
- Live score updates via Socket.IO
- Game state synchronization across multiple connected clients
- Player QR sessions auto-disconnect on game end
- Court status broadcasts

## Future Considerations
- Master server integration (optional, standalone-first)
- Booking system integration
- Historical game data/statistics
- Payment integration
- Multi-court overview (via master)
- Additional sports modules
