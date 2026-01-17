import { GameSession } from '~/lib/types/index.js';
import QRCode from 'qrcode';
import { DeviceService } from '~/modules/device/index.js';

export class GameService {
  private static session: GameSession | null = null;

  private constructor() {
    // Private constructor prevents instantiation
  }

  static createSession(newSession?: GameSession): void {
    if (!this.session) {
      this.session = newSession || {
        sport: null,
        token: Math.random().toString(36).substring(7),
        config: {},
        status: 'idle',
      };
      console.log('Session initialized');
    } else {
      throw new Error('Session already exists');
    }
  }

  static getSession(): GameSession | null {
    return this.session;
  }

  static updateSession(updates: Partial<GameSession>): void {
    if (!this.session || !this.session.sport) {
      throw new Error('No active session');
    }

    this.session = {
      ...this.session,
      ...updates,
    };
  }

  static deleteSession(): void {
    this.session = null;
  }

  // Start the match
  static startMatch(): void {
    if (!this.session || !this.session.sport) {
      throw new Error('No active game session');
    }

    if (this.session.status === 'idle' || this.session.status === 'pending_start') {
      this.session.status = 'in_game';
    }
  }

  // Reset the match
  static reset(): void {
    if (!this.session) {
      throw new Error('No active game session');
    }

    if (this.session.sport === 'padel') {
      this.session.matchState = {
        sets: [],
        currentSetGames: [0, 0],
        currentGamePoints: [0, 0],
        servingTeam: 0,
        servingPlayer: 0,
      };
      this.session.status = 'pending_start';
    }
    // TODO: Future sports
  }

  // Generate session QR code
  static async generateSessionQR(): Promise<Buffer> {
    const deviceConfig = DeviceService.getConfig();
    const deviceId = deviceConfig.deviceId;
    const sessionToken = this.session?.token;
    const baseUrl = `https://google.com/${deviceId}/`;

    const url = sessionToken ? `${baseUrl}${sessionToken}` : baseUrl;

    try {
      // Generate QR code as PNG buffer
      const qrBuffer = await QRCode.toBuffer(url, {
        type: 'png',
        width: 300,
        margin: 3,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrBuffer;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  // ==============================================================
  // ==============================================================
  // ==============================================================

  // Add a point to a team (sport-specific logic delegation)
  static addPoint(team: 0 | 1): void {
    if (!this.session || !this.session.sport) {
      throw new Error('No active game session');
    }

    if (this.session.sport === 'padel') {
      this.addPadelPoint(team);
    }
    // Future sports can be added here
    // else if (this.session.sport === 'tennis') { ... }
  }

  private static addPadelPoint(team: 0 | 1): void {
    if (!this.session || this.session.sport !== 'padel' || this.session.status !== 'in_game')
      return;

    const points = this.session.matchState.currentGamePoints;
    const otherTeam = team === 0 ? 1 : 0;

    // Increment point
    points[team]++;

    // Check if game is won
    if (this.isPadelGameWon(points, team, otherTeam)) {
      this.winPadelGame(team);
    }
  }

  private static isPadelGameWon(points: [number, number], team: 0 | 1, otherTeam: 0 | 1): boolean {
    if (!this.session || this.session.sport !== 'padel') return false;

    // Standard scoring: 0, 15, 30, 40, game
    // Points: 0=0, 1=15, 2=30, 3=40, 4=game

    // Win at 4 points with at least 2 point lead
    if (points[team] >= 4 && points[team] - points[otherTeam] >= 2) {
      return true;
    }

    // Golden point: if both at 3 (40-40/deuce) and golden point enabled
    if (
      this.session.matchConfig.goldenPointEnabled &&
      points[team] === 4 &&
      points[otherTeam] === 3
    ) {
      return true;
    }

    return false;
  }

  private static winPadelGame(team: 0 | 1): void {
    if (!this.session || this.session.sport !== 'padel' || this.session.status !== 'in_game')
      return;

    // Reset game points
    this.session.matchState.currentGamePoints = [0, 0];

    // Add game to current set
    const games = this.session.matchState.currentSetGames;
    games[team]++;

    // Check if set is won
    if (this.isPadelSetWon(games, team)) {
      this.winPadelSet(team);
    }
  }

  private static isPadelSetWon(games: [number, number], team: 0 | 1): boolean {
    if (!this.session || this.session.sport !== 'padel') return false;

    const otherTeam = team === 0 ? 1 : 0;
    const gamesToWin = this.session.matchConfig.gamesToWinSet;

    // Standard set: win with gamesToWinSet games and at least 2 game lead
    if (games[team] >= gamesToWin && games[team] - games[otherTeam] >= 2) {
      return true;
    }

    // Tiebreak: if enabled and games are tied at gamesToWin
    if (
      this.session.matchConfig.tieBreakEnabled &&
      games[team] === gamesToWin + 1 &&
      games[otherTeam] === gamesToWin
    ) {
      return true;
    }

    return false;
  }

  private static winPadelSet(team: 0 | 1): void {
    if (!this.session || this.session.sport !== 'padel' || this.session.status !== 'in_game')
      return;

    // Save current set scores
    const setScore: [number, number] = [...this.session.matchState.currentSetGames];
    this.session.matchState.sets.push(setScore);

    // Reset games
    this.session.matchState.currentSetGames = [0, 0];

    // Check if match is won
    const setsWon = this.session.matchState.sets.filter(
      (set) => set[team] > set[team === 0 ? 1 : 0]
    ).length;

    if (setsWon >= this.session.matchConfig.setsToWin) {
      this.session.status = 'finished';
    }
  }

  // Change server (sport-agnostic but implementation may vary)
  static changeServer(): void {
    if (!this.session || this.session.status !== 'in_game') {
      throw new Error('No active game session');
    }

    if (this.session.sport === 'padel') {
      this.changePadelServer();
    }
    // Future sports can be added here
  }

  private static changePadelServer(): void {
    if (!this.session || this.session.sport !== 'padel' || this.session.status !== 'in_game')
      return;

    const currentPlayer = this.session.matchState.servingPlayer;
    const currentTeam = this.session.matchState.servingTeam;

    // Rotate: Team1Player1 -> Team1Player2 -> Team2Player1 -> Team2Player2 -> Team1Player1
    if (currentTeam === 0) {
      if (currentPlayer === 0) {
        this.session.matchState.servingPlayer = 1;
      } else {
        this.session.matchState.servingTeam = 1;
        this.session.matchState.servingPlayer = 0;
      }
    } else {
      if (currentPlayer === 0) {
        this.session.matchState.servingPlayer = 1;
      } else {
        this.session.matchState.servingTeam = 0;
        this.session.matchState.servingPlayer = 0;
      }
    }
  }
}
