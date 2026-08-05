import { describe, it, expect, beforeEach } from 'vitest';
import { 
  GameEngineUtils, 
  rollDice, 
  createDiceRoll, 
  createInitialGameState, 
  getLegalMoves, 
  moveToken, 
  applyCaptures,
  calculateNextTurn,
  checkPlayerCompletion,
  checkMatchCompletion,
  validateMove,
  serializePublicState,
  restoreGameState,
  calculateTeamResult
} from '../index';
import type { GameState, GameRules, PlayerState, TokenState, PlayerColor, Move, DiceRoll, MatchStatus, GameMode } from '@ludo-nexus/shared-types';

// ============================================
// MOCK HELPERS
// ============================================

const createMockToken = (position: number): TokenState => ({
  id: 0,
  position,
  isInHome: position === -1,
  isFinished: position === 56,
});

const createMockPlayer = (
  color: PlayerColor,
  tokenPositions: number[],
  overrides: Partial<PlayerState> = {}
): PlayerState => ({
  userId: `user-${color}`,
  color,
  tokens: tokenPositions.map((pos, i) => ({ ...createMockToken(pos), id: i })),
  isActive: true,
  isConnected: true,
  hasRolled: false,
  consecutiveSixes: 0,
  isBot: false,
  ...overrides,
});

const createTestGameState = (overrides: Partial<GameState> = {}): GameState => {
  const defaultPlayers: PlayerState[] = [
    createMockPlayer('red', [-1, -1, -1, -1], { userId: 'player1' }),
    createMockPlayer('green', [-1, -1, -1, -1], { userId: 'player2' }),
    createMockPlayer('yellow', [-1, -1, -1, -1], { userId: 'player3' }),
    createMockPlayer('blue', [-1, -1, -1, -1], { userId: 'player4' }),
  ];

  return {
    matchId: 'test-match',
    roomId: undefined,
    tournamentId: undefined,
    mode: 'vs_human',
    rules: {
      tokensPerPlayer: 4,
      entryRoll: 6,
      allowThreeSixes: true,
      extraTurnOnSix: true,
      extraTurnOnCapture: true,
      extraTurnOnHome: true,
      turnTimeSeconds: 30,
      reconnectionGraceSeconds: 30,
      inactivityLimit: 3,
      allowBlockades: false,
      safeCells: [0, 8, 13, 21, 26, 34, 39, 47],
      teamMode: false,
      botDifficulty: 'medium',
    },
    players: defaultPlayers,
    currentPlayerIndex: 0,
    diceRoll: undefined,
    legalMoves: [],
    moveHistory: [],
    stateVersion: 1,
    status: 'in_progress',
    winner: null,
    rankings: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

// ============================================
// TESTS
// ============================================

describe('GameEngineUtils - Dice Roll', () => {
  it('rollDice should return value between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
      const roll = rollDice();
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    }
  });

  it('createDiceRoll should create proper dice roll object', () => {
    const diceRoll = createDiceRoll('player1');
    expect(diceRoll.value).toBeGreaterThanOrEqual(1);
    expect(diceRoll.value).toBeLessThanOrEqual(6);
    expect(diceRoll.rolledBy).toBe('player1');
    expect(diceRoll.isServerGenerated).toBe(true);
    expect(diceRoll.auditId).toBeDefined();
    expect(typeof diceRoll.auditId).toBe('string');
    expect(diceRoll.rolledAt).toBeDefined();
  });
});

describe('GameEngineUtils - createInitialGameState', () => {
  it('should create initial state with 4 players', () => {
    const state = createInitialGameState('match1', [
      { userId: 'p1', color: 'red' },
      { userId: 'p2', color: 'green' },
      { userId: 'p3', color: 'yellow' },
      { userId: 'p4', color: 'blue' },
    ]);

    expect(state.matchId).toBe('match1');
    expect(state.players).toHaveLength(4);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.status).toBe('waiting');
    expect(state.diceRoll).toBeUndefined();
    expect(state.moveHistory).toHaveLength(0);
    expect(state.stateVersion).toBe(1);
  });

  it('should initialize all tokens in home', () => {
    const state = createInitialGameState('match1', [
      { userId: 'p1', color: 'red' },
      { userId: 'p2', color: 'green' },
      { userId: 'p3', color: 'yellow' },
      { userId: 'p4', color: 'blue' },
    ]);

    state.players.forEach(player => {
      expect(player.tokens).toHaveLength(4);
      player.tokens.forEach(token => {
        expect(token.position).toBe(-1);
        expect(token.isInHome).toBe(true);
        expect(token.isFinished).toBe(false);
      });
    });
  });

  it('should merge custom rules', () => {
    const state = createInitialGameState('match1', [
      { userId: 'p1', color: 'red' },
      { userId: 'p2', color: 'green' },
      { userId: 'p3', color: 'yellow' },
      { userId: 'p4', color: 'blue' },
    ], { entryRoll: 1, turnTimeSeconds: 60 });

    expect(state.rules.entryRoll).toBe(1);
    expect(state.rules.turnTimeSeconds).toBe(60);
    expect(state.rules.tokensPerPlayer).toBe(4); // Default preserved
  });

  it('should set bot properties when specified', () => {
    const state = createInitialGameState('match1', [
      { userId: 'p1', color: 'red', isBot: true, botDifficulty: 'hard' },
      { userId: 'p2', color: 'green' },
      { userId: 'p3', color: 'yellow' },
      { userId: 'p4', color: 'blue' },
    ]);

    expect(state.players[0].isBot).toBe(true);
    expect(state.players[0].botDifficulty).toBe('hard');
    expect(state.players[1].isBot).toBe(false);
  });

  it('should set team IDs when specified', () => {
    const state = createInitialGameState('match1', [
      { userId: 'p1', color: 'red', teamId: 1 },
      { userId: 'p2', color: 'green', teamId: 2 },
      { userId: 'p3', color: 'yellow', teamId: 1 },
      { userId: 'p4', color: 'blue', teamId: 2 },
    ], { teamMode: true });

    expect(state.rules.teamMode).toBe(true);
    expect(state.players[0].teamId).toBe(1);
    expect(state.players[1].teamId).toBe(2);
    expect(state.players[2].teamId).toBe(1);
    expect(state.players[3].teamId).toBe(2);
  });
});

describe('GameEngineUtils - getLegalMoves', () => {
  it('should return empty array when no dice rolled', () => {
    const state = createTestGameState();
    state.diceRoll = undefined;
    
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(0);
  });

  it('should allow entering token on entry roll (6)', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(4); // All 4 tokens can enter
    moves.forEach(move => {
      expect(move.fromPosition).toBe(-1);
      expect(move.toPosition).toBe(0); // Red start position
    });
  });

  it('should NOT allow entering token on non-entry roll', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(0);
  });

  it('should allow moving token on main track', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 4, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [0, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].tokenId).toBe(0);
    expect(moves[0].fromPosition).toBe(0);
    expect(moves[0].toPosition).toBe(4);
  });

  it('should allow entering home lane when reaching entry', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red at absolute 50 (relative 50), roll 2 -> distance to entry(51)=1, remaining=1 -> position 52
    state.players[0] = createMockPlayer('red', [50, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].fromPosition).toBe(50);
    expect(moves[0].toPosition).toBe(52);
  });

  it('should allow moving within home lane', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [52, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].fromPosition).toBe(52);
    expect(moves[0].toPosition).toBe(54);
  });

  it('should require exact roll to finish', () => {
    const state = createTestGameState();
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [54, -1, -1, -1], { userId: 'player1' });
    
    // Roll 2 - exact, should work
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    let moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].toPosition).toBe(56);
    
    // Roll 3 - overshoot, should NOT work
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    moves = getLegalMoves(state);
    expect(moves.length).toBe(0);
    
    // Roll 1 - under, should work (move to 55)
    state.diceRoll = { value: 1, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].toPosition).toBe(55);
  });

  it('should not allow moving finished tokens', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [56, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(3); // Only 3 tokens in home can enter
    moves.forEach(move => {
      expect(move.tokenId).not.toBe(0);
    });
  });

  it('should respect blockade rule when enabled', () => {
    const state = createTestGameState();
    state.rules.allowBlockades = true;
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Token 0 at 2, token 1 at 5. Token 0 rolls 3 -> destination 5 (occupied by token 1)
    state.players[0] = createMockPlayer('red', [2, 5, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1); // Only token 1 can move to 8
    expect(moves[0].tokenId).toBe(1);
  });
});

describe('GameEngineUtils - moveToken', () => {
  it('should execute valid move and update state', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    
    const result = moveToken(state, 0, 0);
    
    expect(result.gameState).toBeDefined();
    expect(result.move.tokenId).toBe(0);
    expect(result.move.fromPosition).toBe(-1);
    expect(result.move.toPosition).toBe(0);
    expect(result.capturedTokens).toHaveLength(0);
  });

  it('should throw on illegal move', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    
    expect(() => moveToken(state, 0, 0)).toThrow('Illegal move');
  });

  it('should capture opponent tokens', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red token at 2, green token at 5
    state.players[0] = createMockPlayer('red', [2, -1, -1, -1], { userId: 'player1' });
    state.players[1] = createMockPlayer('green', [5, -1, -1, -1], { userId: 'player2' });
    state.players[1].isActive = true;
    
    const result = moveToken(state, 0, 5);
    
    expect(result.capturedTokens.length).toBe(1);
    expect(result.capturedTokens[0].playerId).toBe('player2');
    expect(result.capturedTokens[0].tokenId).toBe(0);
    expect(result.capturedTokens[0].fromPosition).toBe(5);
    
    // Green token should be back home
    expect(result.gameState.players[1].tokens[0].position).toBe(-1);
  });

  it('should NOT capture on safe cells', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 8, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red token at 0, green token at 8 (safe cell)
    state.players[0] = createMockPlayer('red', [0, -1, -1, -1], { userId: 'player1' });
    state.players[1] = createMockPlayer('green', [8, -1, -1, -1], { userId: 'player2' });
    state.players[1].isActive = true;
    
    const result = moveToken(state, 0, 8);
    
    expect(result.capturedTokens.length).toBe(0);
    expect(result.gameState.players[1].tokens[0].position).toBe(8); // Still there
  });

  it('should NOT capture in home lane', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 1, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red token at 52, green token at 52 (same position in home lane - but different colors have different home lanes)
    // Actually home lanes are separate per color, so this shouldn't happen
    // Let's test finish position
    state.players[0] = createMockPlayer('red', [55, -1, -1, -1], { userId: 'player1' });
    state.players[1] = createMockPlayer('green', [55, -1, -1, -1], { userId: 'player2' });
    state.players[1].isActive = true;
    
    const result = moveToken(state, 0, 56);
    
    // Can't capture at finish
    expect(result.capturedTokens.length).toBe(0);
  });

  it('should grant extra turn on six', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.rules.extraTurnOnSix = true;
    
    const result = moveToken(state, 0, 0);
    
    expect(result.move.isExtraTurn).toBe(true);
    expect(result.gameState.currentPlayerIndex).toBe(0); // Same player
  });

  it('should grant extra turn on capture', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.rules.extraTurnOnCapture = true;
    state.players[0] = createMockPlayer('red', [2, -1, -1, -1], { userId: 'player1' });
    state.players[1] = createMockPlayer('green', [5, -1, -1, -1], { userId: 'player2' });
    state.players[1].isActive = true;
    
    const result = moveToken(state, 0, 5);
    
    expect(result.move.isExtraTurn).toBe(true);
    expect(result.gameState.currentPlayerIndex).toBe(0);
  });

  it('should grant extra turn on home entry', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.rules.extraTurnOnHome = true;
    state.players[0] = createMockPlayer('red', [54, -1, -1, -1], { userId: 'player1' });
    
    const result = moveToken(state, 0, 56);
    
    expect(result.move.isExtraTurn).toBe(true);
    expect(result.gameState.currentPlayerIndex).toBe(0);
  });

  it('should handle three consecutive sixes', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.rules.allowThreeSixes = true;
    state.players[0].consecutiveSixes = 2; // Already rolled two sixes
    
    const result = moveToken(state, 0, 0);
    
    // Three sixes - no extra turn, turn passes
    expect(result.move.isExtraTurn).toBe(false);
    expect(result.gameState.players[0].consecutiveSixes).toBe(0);
    expect(result.gameState.currentPlayerIndex).toBe(1); // Next player
  });

  it('should update state version', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 5;
    
    const result = moveToken(state, 0, 0);
    
    expect(result.gameState.stateVersion).toBe(6);
  });

  it('should add move to history', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.moveHistory = [];
    
    const result = moveToken(state, 0, 0);
    
    expect(result.gameState.moveHistory).toHaveLength(1);
    expect(result.gameState.moveHistory[0].tokenId).toBe(0);
    expect(result.gameState.moveHistory[0].gameStateVersion).toBe(1);
  });

  it('should detect win condition', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 1, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [55, 56, 56, 56], { userId: 'player1' }); // 3 finished, 1 at 55
    
    const result = moveToken(state, 0, 56);
    
    expect(result.gameState.status).toBe('completed');
    expect(result.gameState.winner).toBe('player1');
    expect(result.gameState.rankings[0]).toBe('player1');
    expect(result.gameState.completedAt).toBeDefined();
  });
});

describe('GameEngineUtils - applyCaptures', () => {
  it('should return tokens to home', () => {
    const state = createTestGameState();
    state.players[1] = createMockPlayer('green', [5, -1, -1, -1], { userId: 'player2' });
    state.players[1].isActive = true;
    
    const captured = [{ playerId: 'player2', tokenId: 0, fromPosition: 5 }];
    const newState = applyCaptures(state, captured);
    
    expect(newState.players[1].tokens[0].position).toBe(-1);
    expect(newState.players[1].tokens[0].isInHome).toBe(true);
    expect(newState.players[1].tokens[0].isFinished).toBe(false);
  });

  it('should not affect other players', () => {
    const state = createTestGameState();
    state.players[1] = createMockPlayer('green', [5, -1, -1, -1], { userId: 'player2' });
    state.players[2] = createMockPlayer('yellow', [10, -1, -1, -1], { userId: 'player3' });
    
    const captured = [{ playerId: 'player2', tokenId: 0, fromPosition: 5 }];
    const newState = applyCaptures(state, captured);
    
    expect(newState.players[1].tokens[0].position).toBe(-1);
    expect(newState.players[2].tokens[0].position).toBe(10); // Unchanged
  });
});

describe('GameEngineUtils - calculateNextTurn', () => {
  it('should cycle to next player', () => {
    const state = createTestGameState();
    state.currentPlayerIndex = 0;
    
    const next = calculateNextTurn(state);
    expect(next).toBe(1);
  });

  it('should wrap around', () => {
    const state = createTestGameState();
    state.currentPlayerIndex = 3;
    
    const next = calculateNextTurn(state);
    expect(next).toBe(0);
  });

  it('should skip inactive players', () => {
    const state = createTestGameState();
    state.currentPlayerIndex = 0;
    state.players[1].isActive = false;
    
    const next = calculateNextTurn(state);
    expect(next).toBe(2); // Skip player 1
  });

  it('should not infinite loop if all inactive', () => {
    const state = createTestGameState();
    state.currentPlayerIndex = 0;
    state.players[1].isActive = false;
    state.players[2].isActive = false;
    state.players[3].isActive = false;
    
    const next = calculateNextTurn(state);
    expect(next).toBe(0); // Back to current (only active)
  });
});

describe('GameEngineUtils - checkPlayerCompletion', () => {
  it('should return true when all tokens finished', () => {
    const state = createTestGameState();
    state.players[0] = createMockPlayer('red', [56, 56, 56, 56], { userId: 'player1' });
    
    expect(checkPlayerCompletion(state, 'player1')).toBe(true);
  });

  it('should return false when tokens not finished', () => {
    const state = createTestGameState();
    state.players[0] = createMockPlayer('red', [56, 56, 56, 55], { userId: 'player1' });
    
    expect(checkPlayerCompletion(state, 'player1')).toBe(false);
  });

  it('should return false for non-existent player', () => {
    const state = createTestGameState();
    
    expect(checkPlayerCompletion(state, 'nonexistent')).toBe(false);
  });
});

describe('GameEngineUtils - checkMatchCompletion', () => {
  it('should return true for single winner in standard mode', () => {
    const state = createTestGameState();
    state.rules.teamMode = false;
    state.players[0] = createMockPlayer('red', [56, 56, 56, 56], { userId: 'player1' });
    
    expect(checkMatchCompletion(state, 'player1')).toBe(true);
  });

  it('should return false for incomplete player', () => {
    const state = createTestGameState();
    state.rules.teamMode = false;
    state.players[0] = createMockPlayer('red', [56, 56, 56, 55], { userId: 'player1' });
    
    expect(checkMatchCompletion(state, 'player1')).toBe(false);
  });

  it('should check team completion in team mode', () => {
    const state = createTestGameState();
    state.rules.teamMode = true;
    state.players[0] = createMockPlayer('red', [56, 56, 56, 56], { userId: 'player1', teamId: 1 });
    state.players[2] = createMockPlayer('yellow', [56, 56, 56, 56], { userId: 'player3', teamId: 1 });
    state.players[1] = createMockPlayer('green', [56, 56, 56, 55], { userId: 'player2', teamId: 2 });
    state.players[3] = createMockPlayer('blue', [56, 56, 56, 55], { userId: 'player4', teamId: 2 });
    
    expect(checkMatchCompletion(state, 'player1')).toBe(true); // Team 1 complete
    expect(checkMatchCompletion(state, 'player2')).toBe(false); // Team 2 incomplete
  });
});

describe('GameEngineUtils - validateMove', () => {
  it('should reject version mismatch', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 5;
    
    const result = validateMove(state, 'player1', 0, 0, 4);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Game state version mismatch');
  });

  it('should reject when game not in progress', () => {
    const state = createTestGameState();
    state.status = 'waiting';
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 1;
    
    const result = validateMove(state, 'player1', 0, 0, 1);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Game is not in progress');
  });

  it('should reject when not player turn', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 1; // Player 2's turn
    state.stateVersion = 1;
    
    const result = validateMove(state, 'player1', 0, 0, 1);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Not your turn');
  });

  it('should reject inactive player', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 1;
    state.players[0].isActive = false;
    
    const result = validateMove(state, 'player1', 0, 0, 1);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Player is not active');
  });

  it('should reject when dice not rolled', () => {
    const state = createTestGameState();
    state.currentPlayerIndex = 0;
    state.stateVersion = 1;
    state.diceRoll = undefined;
    
    const result = validateMove(state, 'player1', 0, 0, 1);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Dice not rolled yet');
  });

  it('should reject invalid token ID', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 1;
    
    const result = validateMove(state, 'player1', 10, 0, 1);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid token');
  });

  it('should reject illegal move', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 1;
    
    const result = validateMove(state, 'player1', 0, 0, 1);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Illegal move');
  });

  it('should accept valid move', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.stateVersion = 1;
    
    const result = validateMove(state, 'player1', 0, 0, 1);
    
    expect(result.valid).toBe(true);
  });
});

describe('GameEngineUtils - serializePublicState', () => {
  it('should return copy of state', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    
    const publicState = serializePublicState(state, 'player1');
    
    expect(publicState).toEqual(state);
    expect(publicState).not.toBe(state); // Different object
  });
});

describe('GameEngineUtils - restoreGameState', () => {
  it('should return copy of state', () => {
    const state = createTestGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'player1', isServerGenerated: true, auditId: '1' };
    
    const restored = restoreGameState(state);
    
    expect(restored).toEqual(state);
    expect(restored).not.toBe(state);
  });
});

describe('GameEngineUtils - calculateTeamResult', () => {
  it('should throw for non-team game', () => {
    const state = createTestGameState();
    state.rules.teamMode = false;
    
    expect(() => calculateTeamResult(state)).toThrow('Not a team game');
  });

  it('should find winning team', () => {
    const state = createTestGameState();
    state.rules.teamMode = true;
    state.players[0] = createMockPlayer('red', [56, 56, 56, 56], { userId: 'player1', teamId: 1 });
    state.players[2] = createMockPlayer('yellow', [56, 56, 56, 56], { userId: 'player3', teamId: 1 });
    state.players[1] = createMockPlayer('green', [56, 56, 56, 55], { userId: 'player2', teamId: 2 });
    state.players[3] = createMockPlayer('blue', [56, 56, 56, 55], { userId: 'player4', teamId: 2 });
    
    const result = calculateTeamResult(state);
    
    expect(result.winningTeam).toBe(1);
    expect(result.teamRankings[0]).toBe(1);
  });

  it('should rank teams by finished players', () => {
    const state = createTestGameState();
    state.rules.teamMode = true;
    state.players[0] = createMockPlayer('red', [56, 56, 56, 56], { userId: 'player1', teamId: 1 });
    state.players[2] = createMockPlayer('yellow', [56, 56, 56, 55], { userId: 'player3', teamId: 1 });
    state.players[1] = createMockPlayer('green', [56, 56, 56, 56], { userId: 'player2', teamId: 2 });
    state.players[3] = createMockPlayer('blue', [56, 56, 56, 56], { userId: 'player4', teamId: 2 });
    
    const result = calculateTeamResult(state);
    
    // Team 2 has 2 finished players, Team 1 has 1
    expect(result.winningTeam).toBe(2);
    expect(result.teamRankings[0]).toBe(2);
    expect(result.teamRankings[1]).toBe(1);
  });
});