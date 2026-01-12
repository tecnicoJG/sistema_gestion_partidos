import { PadelGameSession } from '@controller/types';

type SupportedGameSession = PadelGameSession;

export class GameService {
  private static gameState: SupportedGameSession | null = null;

  private constructor() {
    // Private constructor prevents instantiation
  }

  static getState(): SupportedGameSession | null {
    return this.gameState;
  }

  static setState(newState: Partial<SupportedGameSession>): void {
    if (!this.gameState) {
      throw new Error('No active game session');
    }

    this.gameState = {
      ...this.gameState,
      ...newState,
    };
  }

  static createGame(initialState: SupportedGameSession): SupportedGameSession {
    this.gameState = initialState;
    return this.gameState;
  }

  static hasActiveGame(): boolean {
    return this.gameState !== null;
  }

  static clearGame(): void {
    this.gameState = null;
  }

  // Add a point to a team (sport-specific logic delegation)
  static addPoint(team: 0 | 1): void {
    if (!this.gameState) {
      throw new Error('No active game session');
    }

    if (this.gameState.sport === 'padel') {
      this.addPadelPoint(team);
    }
    // Future sports can be added here
    // else if (this.gameState.sport === 'tennis') { ... }
  }

  private static addPadelPoint(team: 0 | 1): void {
    if (!this.gameState || this.gameState.sport !== 'padel') return;

    const points = this.gameState.matchState.currentGamePoints;
    const otherTeam = team === 0 ? 1 : 0;

    // Increment point
    points[team]++;

    // Check if game is won
    if (this.isPadelGameWon(points, team, otherTeam)) {
      this.winPadelGame(team);
    }
  }

  private static isPadelGameWon(
    points: [number, number],
    team: 0 | 1,
    otherTeam: 0 | 1
  ): boolean {
    if (!this.gameState || this.gameState.sport !== 'padel') return false;

    // Standard scoring: 0, 15, 30, 40, game
    // Points: 0=0, 1=15, 2=30, 3=40, 4=game

    // Win at 4 points with at least 2 point lead
    if (points[team] >= 4 && points[team] - points[otherTeam] >= 2) {
      return true;
    }

    // Golden point: if both at 3 (40-40/deuce) and golden point enabled
    if (
      this.gameState.matchConfig.goldenPointEnabled &&
      points[team] === 4 &&
      points[otherTeam] === 3
    ) {
      return true;
    }

    return false;
  }

  private static winPadelGame(team: 0 | 1): void {
    if (!this.gameState || this.gameState.sport !== 'padel') return;

    // Reset game points
    this.gameState.matchState.currentGamePoints = [0, 0];

    // Add game to current set
    const games = this.gameState.matchState.currentSetGames;
    games[team]++;

    // Check if set is won
    if (this.isPadelSetWon(games, team)) {
      this.winPadelSet(team);
    }
  }

  private static isPadelSetWon(games: [number, number], team: 0 | 1): boolean {
    if (!this.gameState || this.gameState.sport !== 'padel') return false;

    const otherTeam = team === 0 ? 1 : 0;
    const gamesToWin = this.gameState.matchConfig.gamesToWinSet;

    // Standard set: win with gamesToWinSet games and at least 2 game lead
    if (games[team] >= gamesToWin && games[team] - games[otherTeam] >= 2) {
      return true;
    }

    // Tiebreak: if enabled and games are tied at gamesToWin
    if (
      this.gameState.matchConfig.tieBreakEnabled &&
      games[team] === gamesToWin + 1 &&
      games[otherTeam] === gamesToWin
    ) {
      return true;
    }

    return false;
  }

  private static winPadelSet(team: 0 | 1): void {
    if (!this.gameState || this.gameState.sport !== 'padel') return;

    // Save current set scores
    const setScore: [number, number] = [...this.gameState.matchState.currentSetGames];
    this.gameState.matchState.sets.push(setScore);

    // Reset games
    this.gameState.matchState.currentSetGames = [0, 0];

    // Check if match is won
    const setsWon = this.gameState.matchState.sets.filter(
      (set) => set[team] > set[team === 0 ? 1 : 0]
    ).length;

    if (setsWon >= this.gameState.matchConfig.setsToWin) {
      this.gameState.status = 'finished';
    }
  }

  // Change server (sport-agnostic but implementation may vary)
  static changeServer(): void {
    if (!this.gameState) {
      throw new Error('No active game session');
    }

    if (this.gameState.sport === 'padel') {
      this.changePadelServer();
    }
    // Future sports can be added here
  }

  private static changePadelServer(): void {
    if (!this.gameState || this.gameState.sport !== 'padel') return;

    const currentPlayer = this.gameState.matchState.servingPlayer;
    const currentTeam = this.gameState.matchState.servingTeam;

    // Rotate: Team1Player1 -> Team1Player2 -> Team2Player1 -> Team2Player2 -> Team1Player1
    if (currentTeam === 0) {
      if (currentPlayer === 0) {
        this.gameState.matchState.servingPlayer = 1;
      } else {
        this.gameState.matchState.servingTeam = 1;
        this.gameState.matchState.servingPlayer = 0;
      }
    } else {
      if (currentPlayer === 0) {
        this.gameState.matchState.servingPlayer = 1;
      } else {
        this.gameState.matchState.servingTeam = 0;
        this.gameState.matchState.servingPlayer = 0;
      }
    }
  }

  // Start the match
  static startMatch(): void {
    if (!this.gameState) {
      throw new Error('No active game session');
    }

    if (this.gameState.status === 'idle' || this.gameState.status === 'pending_start') {
      this.gameState.status = 'in_game';
    }
  }

  // Reset the match
  static reset(): void {
    if (!this.gameState) {
      throw new Error('No active game session');
    }

    if (this.gameState.sport === 'padel') {
      this.gameState.matchState = {
        sets: [],
        currentSetGames: [0, 0],
        currentGamePoints: [0, 0],
        servingTeam: 0,
        servingPlayer: 0,
      };
      this.gameState.status = 'idle';
    }
    // Future sports can be added here
  }
}
