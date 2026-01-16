import { z } from 'zod';

// ============================================================================
// REUSABLE SCHEMAS
// ============================================================================

const playerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('account'),
    accountId: z.string(),
    name: z.string().optional(),
  }),
  z.object({
    type: z.literal('guest'),
    name: z.string().optional(),
    email: z.email().optional(),
  }),
]);

const matchConfigSchema = z.object({
  setsToWin: z.number().int().min(1).max(5),
  gamesToWinSet: z.number().int().min(1).max(10),
  goldenPointEnabled: z.boolean(),
  tieBreakEnabled: z.boolean(),
  superTieBreakEnabled: z.boolean(),
});

const sessionConfigSchema = z.object({
  startAt: z.date().optional(),
  duration: z.number().int().positive().optional(),
});

const teamIndexSchema = z.coerce.number().int().min(0).max(1);
const playerIndexSchema = z.coerce.number().int().min(0).max(1);

// ============================================================================
// GAME SCHEMAS
// ============================================================================

// Route: GET /api/game
export const getGameSchema = z.object({});

// Route: POST /api/game
export const createGameSchema = z.object({
  body: z.object({
    sport: z.enum(['padel']).optional(),
    players: z
      .tuple([z.tuple([playerSchema, playerSchema]), z.tuple([playerSchema, playerSchema])])
      .optional(),
    matchConfig: matchConfigSchema.partial().optional(),
    sessionConfig: sessionConfigSchema.optional(),
    preferredTheme: z.enum(['light', 'dark']).optional(),
  }),
});

// Route: GET /api/game/session-code
export const getSessionCodeSchema = z.object({});

// Route: POST /api/game/start
export const startGameSchema = z.object({});

// Route: POST /api/game/end
export const endGameSchema = z.object({});

// Route: POST /api/game/reset
export const resetGameSchema = z.object({});

// Route: POST /api/game/restart
export const restartGameSchema = z.object({});

// Route: POST /api/game/teams/:team/player/:player
export const addPlayerSchema = z.object({
  params: z.object({
    team: teamIndexSchema,
    player: playerIndexSchema,
  }),
  body: playerSchema,
});

// Route: PATCH /api/game/teams/:team/player/:player
export const updatePlayerSchema = z.object({
  params: z.object({
    team: teamIndexSchema,
    player: playerIndexSchema,
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    type: z.enum(['account', 'guest']).optional(),
    accountId: z.string().optional(),
  }),
});

// Route: DELETE /api/game/teams/:team/player/:player
export const deletePlayerSchema = z.object({
  params: z.object({
    team: teamIndexSchema,
    player: playerIndexSchema,
  }),
});

// Route: POST /api/game/theme
export const setSessionThemeSchema = z.object({
  body: z.object({
    theme: z.enum(['light', 'dark']),
  }),
});

// Route: POST /api/game/teams/:team/points/add
export const addPointSchema = z.object({
  params: z.object({
    team: teamIndexSchema,
  }),
});

// Route: POST /api/game/teams/:team/points/deduct
export const deductPointSchema = z.object({
  params: z.object({
    team: teamIndexSchema,
  }),
});

// Route: PATCH /api/game/teams/:team/score
export const updateGameScoreSchema = z.object({
  params: z.object({
    team: teamIndexSchema,
  }),
  body: z.object({
    points: z.number().int().min(0).optional(),
    games: z.number().int().min(0).optional(),
    sets: z.number().int().min(0).optional(),
  }),
});

// Route: POST /api/game/serving-player
export const setServingPlayerSchema = z.object({
  body: z.object({
    team: teamIndexSchema,
    player: playerIndexSchema,
  }),
});

// ============================================================================
// EXPORTED TYPES (Inferred from Zod schemas)
// ============================================================================

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type AddPlayerInput = z.infer<typeof addPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type DeletePlayerInput = z.infer<typeof deletePlayerSchema>;
export type SetSessionThemeInput = z.infer<typeof setSessionThemeSchema>;
export type AddPointInput = z.infer<typeof addPointSchema>;
export type DeductPointInput = z.infer<typeof deductPointSchema>;
export type UpdateGameScoreInput = z.infer<typeof updateGameScoreSchema>;
export type SetServingPlayerInput = z.infer<typeof setServingPlayerSchema>;
