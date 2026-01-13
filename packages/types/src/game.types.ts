interface BasePlayer {
  name?: string;
}

interface AccountPlayer extends BasePlayer {
  type: 'account';
  accountId: string;
}

interface GuestPlayer extends BasePlayer {
  type: 'guest';
  email?: string;
}

type Player = AccountPlayer | GuestPlayer;

type Sports = 'padel';

interface BaseGameSession {
  sport: Sports | null;
  sessionToken: string;
  status: 'idle' | 'pending_start' | 'in_game' | 'finished';
  sessionConfig: {
    startAt?: Date;
    duration?: number;
  };
  preferredTheme?: 'light' | 'dark';
}

interface UncofiguredGameSession extends BaseGameSession {
  sport: null;
}

export interface PadelGameSession extends BaseGameSession {
  sport: 'padel';
  matchState: {
    sets: [number, number][];
    currentSetGames: [number, number];
    currentGamePoints: [number, number];
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

export type GameSession = PadelGameSession | UncofiguredGameSession;
