import { describe, it, expect, beforeEach } from 'vitest';
import {
  BOARD_SIZE,
  HOME_POSITION,
  FINISHED_POSITION,
  TOKENS_PER_PLAYER,
  PLAYER_COLORS,
  START_POSITIONS,
  HOME_LANE_ENTRY,
  DEFAULT_SAFE_CELLS,
  DEFAULT_GAME_RULES,
  getNextPlayerIndex,
  getAbsolutePosition,
  getRelativePosition,
  getTrackDistance,
  isSafeCell,
  isInHome,
  isInHomeLane,
  isFinished,
  canEnterBoard,
  canEnterHomeLane,
  getHomeLanePosition,
  wouldLandOnSafeCell,
  getLegalMoves,
} from './constants';
import type { GameState, GameRules, PlayerState, TokenState, PlayerColor, Move, DiceRoll } from '@ludo-nexus/shared-types';

// ============================================
// MOCK HELPERS
// ============================================

const createMockToken = (position: number): TokenState => ({
  id: 0,
  position,
  isInHome: position === HOME_POSITION,
  isFinished: position === FINISHED_POSITION,
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

const createMockGameState = (overrides: Partial<GameState> = {}): GameState => {
  const defaultRules: GameRules = { ...DEFAULT_GAME_RULES };
  
  const defaultPlayers: PlayerState[] = PLAYER_COLORS.map((color, i) => 
    createMockPlayer(color, [-1, -1, -1, -1], { userId: `player${i+1}` })
  );

  return {
    matchId: 'test-match',
    roomId: undefined,
    tournamentId: undefined,
    mode: 'vs_human',
    rules: defaultRules,
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

describe('Game Engine Constants', () => {
  describe('Board Constants', () => {
    it('should have correct board size', () => {
      expect(BOARD_SIZE).toBe(52);
    });

    it('should have correct special positions', () => {
      expect(HOME_POSITION).toBe(-1);
      expect(FINISHED_POSITION).toBe(56);
      expect(TOKENS_PER_PLAYER).toBe(4);
    });

    it('should have 4 player colors in correct order', () => {
      expect(PLAYER_COLORS).toEqual(['red', 'green', 'yellow', 'blue']);
    });

    it('should have correct start positions for each color', () => {
      expect(START_POSITIONS.red).toBe(0);
      expect(START_POSITIONS.green).toBe(13);
      expect(START_POSITIONS.yellow).toBe(26);
      expect(START_POSITIONS.blue).toBe(39);
    });

    it('should have correct home lane entries', () => {
      expect(HOME_LANE_ENTRY.red).toBe(51);
      expect(HOME_LANE_ENTRY.green).toBe(12);
      expect(HOME_LANE_ENTRY.yellow).toBe(25);
      expect(HOME_LANE_ENTRY.blue).toBe(38);
    });

    it('should have 8 default safe cells', () => {
      expect(DEFAULT_SAFE_CELLS).toHaveLength(8);
      expect(DEFAULT_SAFE_CELLS).toEqual([0, 8, 13, 21, 26, 34, 39, 47]);
    });
  });

  describe('Default Game Rules', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_GAME_RULES.tokensPerPlayer).toBe(4);
      expect(DEFAULT_GAME_RULES.entryRoll).toBe(6);
      expect(DEFAULT_GAME_RULES.allowThreeSixes).toBe(true);
      expect(DEFAULT_GAME_RULES.extraTurnOnSix).toBe(true);
      expect(DEFAULT_GAME_RULES.extraTurnOnCapture).toBe(true);
      expect(DEFAULT_GAME_RULES.extraTurnOnHome).toBe(true);
      expect(DEFAULT_GAME_RULES.turnTimeSeconds).toBe(30);
      expect(DEFAULT_GAME_RULES.reconnectionGraceSeconds).toBe(30);
      expect(DEFAULT_GAME_RULES.inactivityLimit).toBe(3);
      expect(DEFAULT_GAME_RULES.allowBlockades).toBe(false);
      expect(DEFAULT_GAME_RULES.safeCells).toEqual(DEFAULT_SAFE_CELLS);
      expect(DEFAULT_GAME_RULES.teamMode).toBe(false);
      expect(DEFAULT_GAME_RULES.botDifficulty).toBe('medium');
    });
  });
});

describe('Helper Functions', () => {
  describe('getNextPlayerIndex', () => {
    it('should cycle through 4 players', () => {
      expect(getNextPlayerIndex(0, 4)).toBe(1);
      expect(getNextPlayerIndex(1, 4)).toBe(2);
      expect(getNextPlayerIndex(2, 4)).toBe(3);
      expect(getNextPlayerIndex(3, 4)).toBe(0);
    });

    it('should work with different player counts', () => {
      expect(getNextPlayerIndex(0, 2)).toBe(1);
      expect(getNextPlayerIndex(1, 2)).toBe(0);
      expect(getNextPlayerIndex(2, 3)).toBe(0);
    });
  });

  describe('getAbsolutePosition', () => {
    it('should calculate correct absolute positions for red', () => {
      expect(getAbsolutePosition('red', 0)).toBe(0);
      expect(getAbsolutePosition('red', 10)).toBe(10);
      expect(getAbsolutePosition('red', 51)).toBe(51);
    });

    it('should calculate correct absolute positions for green', () => {
      expect(getAbsolutePosition('green', 0)).toBe(13);
      expect(getAbsolutePosition('green', 10)).toBe(23);
      expect(getAbsolutePosition('green', 38)).toBe(51);
      expect(getAbsolutePosition('green', 39)).toBe(0); // wrap around
    });

    it('should calculate correct absolute positions for yellow', () => {
      expect(getAbsolutePosition('yellow', 0)).toBe(26);
      expect(getAbsolutePosition('yellow', 25)).toBe(51);
      expect(getAbsolutePosition('yellow', 26)).toBe(0);
    });

    it('should calculate correct absolute positions for blue', () => {
      expect(getAbsolutePosition('blue', 0)).toBe(39);
      expect(getAbsolutePosition('blue', 12)).toBe(51);
      expect(getAbsolutePosition('blue', 13)).toBe(0);
    });
  });

  describe('getRelativePosition', () => {
    it('should calculate correct relative positions for red', () => {
      expect(getRelativePosition('red', 0)).toBe(0);
      expect(getRelativePosition('red', 10)).toBe(10);
      expect(getRelativePosition('red', 51)).toBe(51);
    });

    it('should calculate correct relative positions for green', () => {
      expect(getRelativePosition('green', 13)).toBe(0);
      expect(getRelativePosition('green', 23)).toBe(10);
      expect(getRelativePosition('green', 0)).toBe(39); // wrap around
    });

    it('should calculate correct relative positions for yellow', () => {
      expect(getRelativePosition('yellow', 26)).toBe(0);
      expect(getRelativePosition('yellow', 0)).toBe(26);
    });

    it('should calculate correct relative positions for blue', () => {
      expect(getRelativePosition('blue', 39)).toBe(0);
      expect(getRelativePosition('blue', 0)).toBe(13);
    });
  });

  describe('getTrackDistance', () => {
    it('should calculate forward distance', () => {
      expect(getTrackDistance(0, 5)).toBe(5);
      expect(getTrackDistance(10, 20)).toBe(10);
      expect(getTrackDistance(0, 51)).toBe(51);
    });

    it('should calculate wrap-around distance', () => {
      expect(getTrackDistance(50, 2)).toBe(4); // 50->51(1), 0->2(2) = wait, 52-50=2 + 2 = 4
      expect(getTrackDistance(40, 5)).toBe(17); // 52-40=12 + 5 = 17
      expect(getTrackDistance(51, 0)).toBe(1);
    });

    it('should return 0 for same position', () => {
      expect(getTrackDistance(0, 0)).toBe(0);
      expect(getTrackDistance(25, 25)).toBe(0);
    });

    it('should return 0 for invalid positions', () => {
      expect(getTrackDistance(-1, 5)).toBe(0);
      expect(getTrackDistance(0, 52)).toBe(0);
      expect(getTrackDistance(52, 52)).toBe(0);
    });
  });

  describe('isSafeCell', () => {
    it('should identify default safe cells', () => {
      expect(isSafeCell(0)).toBe(true);
      expect(isSafeCell(8)).toBe(true);
      expect(isSafeCell(13)).toBe(true);
      expect(isSafeCell(21)).toBe(true);
      expect(isSafeCell(26)).toBe(true);
      expect(isSafeCell(34)).toBe(true);
      expect(isSafeCell(39)).toBe(true);
      expect(isSafeCell(47)).toBe(true);
    });

    it('should identify non-safe cells', () => {
      expect(isSafeCell(1)).toBe(false);
      expect(isSafeCell(5)).toBe(false);
      expect(isSafeCell(10)).toBe(false);
      expect(isSafeCell(51)).toBe(false);
    });

    it('should work with custom safe cells', () => {
      expect(isSafeCell(5, [5, 10, 15])).toBe(true);
      expect(isSafeCell(7, [5, 10, 15])).toBe(false);
    });
  });

  describe('Position Type Checks', () => {
    it('should identify home position', () => {
      expect(isInHome(HOME_POSITION)).toBe(true);
      expect(isInHome(0)).toBe(false);
      expect(isInHome(56)).toBe(false);
    });

    it('should identify home lane positions', () => {
      expect(isInHomeLane(52)).toBe(true);
      expect(isInHomeLane(53)).toBe(true);
      expect(isInHomeLane(54)).toBe(true);
      expect(isInHomeLane(55)).toBe(true);
      expect(isInHomeLane(51)).toBe(false);
      expect(isInHomeLane(56)).toBe(false);
      expect(isInHomeLane(-1)).toBe(false);
    });

    it('should identify finished position', () => {
      expect(isFinished(FINISHED_POSITION)).toBe(true);
      expect(isFinished(55)).toBe(false);
      expect(isFinished(-1)).toBe(false);
    });
  });

  describe('canEnterBoard', () => {
    it('should allow entry on correct roll', () => {
      expect(canEnterBoard(6, 6)).toBe(true);
      expect(canEnterBoard(4, 4)).toBe(true);
      expect(canEnterBoard(1, 1)).toBe(true);
    });

    it('should deny entry on wrong roll', () => {
      expect(canEnterBoard(5, 6)).toBe(false);
      expect(canEnterBoard(3, 6)).toBe(false);
      expect(canEnterBoard(1, 6)).toBe(false);
    });
  });

  describe('canEnterHomeLane', () => {
    it('should allow entry when at home lane entry with correct dice', () => {
      // Red at position 51 (home lane entry), roll 1-4 should enter
      expect(canEnterHomeLane('red', 51, 1)).toBe(true);
      expect(canEnterHomeLane('red', 51, 2)).toBe(true);
      expect(canEnterHomeLane('red', 51, 3)).toBe(true);
      expect(canEnterHomeLane('red', 51, 4)).toBe(true);
    });

    it('should deny entry when at home lane entry with roll > 4', () => {
      expect(canEnterHomeLane('red', 51, 5)).toBe(false);
      expect(canEnterHomeLane('red', 51, 6)).toBe(false);
    });

    it('should allow entry when approaching home lane entry', () => {
      // Red at position 50, roll 2 reaches entry (51) then 1 into home lane = position 52
      expect(canEnterHomeLane('red', 50, 2)).toBe(true); // distance 1, roll 2 -> 1 step into home
      expect(canEnterHomeLane('red', 50, 3)).toBe(true); // distance 1, roll 3 -> 2 steps into home
      expect(canEnterHomeLane('red', 50, 4)).toBe(true); // distance 1, roll 4 -> 3 steps into home
      expect(canEnterHomeLane('red', 50, 5)).toBe(true); // distance 1, roll 5 -> 4 steps into home (finish)
    });

    it('should deny entry when too far from home lane', () => {
      expect(canEnterHomeLane('red', 40, 6)).toBe(false); // distance 11, roll 6 can't reach
    });

    it('should work for all colors', () => {
      // Green at 12 (entry), roll 1-4
      expect(canEnterHomeLane('green', 12, 1)).toBe(true);
      expect(canEnterHomeLane('green', 12, 4)).toBe(true);
      expect(canEnterHomeLane('green', 12, 5)).toBe(false);

      // Yellow at 25 (entry)
      expect(canEnterHomeLane('yellow', 25, 1)).toBe(true);

      // Blue at 38 (entry)
      expect(canEnterHomeLane('blue', 38, 1)).toBe(true);
    });
  });

  describe('getHomeLanePosition', () => {
    it('should return correct home lane position for red', () => {
      // At entry (51), roll 1 -> position 52
      expect(getHomeLanePosition('red', 51, 1)).toBe(52);
      expect(getHomeLanePosition('red', 51, 2)).toBe(53);
      expect(getHomeLanePosition('red', 51, 3)).toBe(54);
      expect(getHomeLanePosition('red', 51, 4)).toBe(55);
    });

    it('should return correct home lane position when approaching', () => {
      // At 50, roll 2 -> distance to entry=1, remaining=1 -> position 52
      expect(getHomeLanePosition('red', 50, 2)).toBe(52);
      expect(getHomeLanePosition('red', 50, 3)).toBe(53);
      expect(getHomeLanePosition('red', 50, 4)).toBe(54);
      expect(getHomeLanePosition('red', 50, 5)).toBe(55);
    });

    it('should work for all colors', () => {
      expect(getHomeLanePosition('green', 12, 1)).toBe(52);
      expect(getHomeLanePosition('yellow', 25, 1)).toBe(52);
      expect(getHomeLanePosition('blue', 38, 1)).toBe(52);
    });
  });

  describe('wouldLandOnSafeCell', () => {
    it('should detect landing on safe cell from home', () => {
      // Red entering at 0 (safe cell)
      expect(wouldLandOnSafeCell('red', HOME_POSITION, 6)).toBe(true);
      // Green entering at 13 (safe cell)
      expect(wouldLandOnSafeCell('green', HOME_POSITION, 6)).toBe(true);
    });

    it('should detect landing on safe cell on main track', () => {
      // Red at relative 2, roll 6 -> absolute 8 (safe)
      expect(wouldLandOnSafeCell('red', 2, 6)).toBe(true);
      // Red at relative 15, roll 6 -> absolute 21 (safe)
      expect(wouldLandOnSafeCell('red', 15, 6)).toBe(true);
    });

    it('should not detect safe cell when not landing on one', () => {
      expect(wouldLandOnSafeCell('red', 0, 1)).toBe(false); // lands on 1
      expect(wouldLandOnSafeCell('red', 10, 2)).toBe(false); // lands on 12 (not safe)
      expect(wouldLandOnSafeCell('red', 5, 2)).toBe(false); // lands on 7 (not safe)
      expect(wouldLandOnSafeCell('red', 3, 3)).toBe(false); // lands on 6 (not safe)
    });

    it('should return false for home lane positions', () => {
      expect(wouldLandOnSafeCell('red', 52, 1)).toBe(false);
      expect(wouldLandOnSafeCell('red', 53, 1)).toBe(false);
    });
  });
});

describe('getLegalMoves', () => {
  it('should return empty array when no dice rolled', () => {
    const state = createMockGameState();
    state.diceRoll = undefined;
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(0);
  });

  it('should return empty array when dice value is 0', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 0, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(0);
  });

  it('should allow entering token on entry roll', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0; // Red
    state.players[0] = createMockPlayer('red', [-1, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(4); // All 4 tokens can enter
    moves.forEach(move => {
      expect(move.fromPosition).toBe(HOME_POSITION);
      expect(move.toPosition).toBe(START_POSITIONS.red); // 0
    });
  });

  it('should NOT allow entering token on non-entry roll', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [-1, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(0);
  });

  it('should allow moving token on main track', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 4, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red token at absolute position 0 (relative 0), roll 4 -> absolute 4
    state.players[0] = createMockPlayer('red', [0, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].tokenId).toBe(0);
    expect(moves[0].fromPosition).toBe(0);
    expect(moves[0].toPosition).toBe(4);
  });

  it('should allow entering home lane when reaching entry', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red at relative 50 (absolute 50), roll 2 -> reaches entry (51) + 1 into home lane = 52
    state.players[0] = createMockPlayer('red', [50, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].fromPosition).toBe(50);
    expect(moves[0].toPosition).toBe(52); // First home lane position
  });

  it('should allow moving within home lane', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red token at home lane position 52, roll 2 -> position 54
    state.players[0] = createMockPlayer('red', [52, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].fromPosition).toBe(52);
    expect(moves[0].toPosition).toBe(54);
  });

  it('should require exact roll to finish', () => {
    const state = createMockGameState();
    state.currentPlayerIndex = 0;
    // Red token at home lane position 54, needs 2 to finish (56)
    state.players[0] = createMockPlayer('red', [54, -1, -1, -1], { userId: 'player1' });
    
    // Roll 2 - exact, should work
    state.diceRoll = { value: 2, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    let moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].toPosition).toBe(FINISHED_POSITION);
    
    // Roll 3 - overshoot, should NOT work
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    moves = getLegalMoves(state);
    expect(moves.length).toBe(0);
    
    // Roll 1 - under, should work (move to 55)
    state.diceRoll = { value: 1, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    moves = getLegalMoves(state);
    expect(moves.length).toBe(1);
    expect(moves[0].toPosition).toBe(55);
  });

  it('should not allow moving finished tokens', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [FINISHED_POSITION, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    // Only 3 tokens in home can enter
    expect(moves.length).toBe(3);
    moves.forEach(move => {
      expect(move.tokenId).not.toBe(0); // Token 0 is finished
    });
  });

  it('should handle multiple tokens with legal moves', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red has tokens at positions 0, 5, 10 on main track
    state.players[0] = createMockPlayer('red', [0, 5, 10, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    // Entry roll is 6, so home token can't enter on 3
    // Only the 3 on main track can move
    expect(moves.length).toBe(3);
  });

  it('should respect blockade rule when enabled', () => {
    const state = createMockGameState();
    state.rules.allowBlockades = true;
    state.diceRoll = { value: 3, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Two red tokens at same position (blockade)
    state.players[0] = createMockPlayer('red', [5, 5, -1, -1], { userId: 'player1' });
    
    let moves = getLegalMoves(state);
    // Both tokens at 5, roll 3 -> would go to 8, but blockade prevents moving TO a position occupied by own token
    // Wait, the rule checks if DESTINATION has own token
    // Token 0 at 5 -> would go to 8 (empty), valid
    // Token 1 at 5 -> would go to 8 (empty), valid
    // So both should be valid since destination (8) is empty
    expect(moves.length).toBe(2);
    
    // Now test when destination has own token
    state.players[0] = createMockPlayer('red', [2, 5, -1, -1], { userId: 'player1' });
    // Token 0 at 2, roll 3 -> destination 5 (occupied by token 1)
    // Token 1 at 5, roll 3 -> destination 8 (empty)
    moves = getLegalMoves(state);
    expect(moves.length).toBe(1); // Only token 1 can move
    expect(moves[0].tokenId).toBe(1);
  });

  it('should work for all player colors', () => {
    const testColor = (color: PlayerColor, startPos: number) => {
      const state = createMockGameState();
      state.diceRoll = { value: 4, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
      state.currentPlayerIndex = PLAYER_COLORS.indexOf(color);
      state.players[state.currentPlayerIndex] = createMockPlayer(color, [startPos, -1, -1, -1], { userId: `player-${color}` });
      
      const moves = getLegalMoves(state);
      expect(moves.length).toBe(1);
      expect(moves[0].fromPosition).toBe(startPos);
      // Should move 4 steps forward on track
    };
    
    testColor('red', 0);    // 0 + 4 = 4
    testColor('green', 13); // 13 + 4 = 17
    testColor('yellow', 26); // 26 + 4 = 30
    testColor('blue', 39);  // 39 + 4 = 43
  });
});

describe('Edge Cases', () => {
  it('should handle overshoot on main track', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    // Red at relative 48 (absolute 48), roll 6:
    // distance to home lane entry (51) = 3, remaining = 3 -> enters home lane at position 54 (52 + 2)
    // So this token CAN move (enters home lane)!
    // But 3 tokens in home CAN ALSO enter on roll 6
    // Total = 4 legal moves
    state.players[0] = createMockPlayer('red', [48, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    // Token at 48 enters home lane (54), 3 tokens in home enter at start (0)
    expect(moves.length).toBe(4);
  });

  it('should handle token at position 51 (home lane entry) with roll 6', () => {
    const state = createMockGameState();
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [51, -1, -1, -1], { userId: 'player1' });
    
    const moves = getLegalMoves(state);
    // At entry (51), distance to entry = 0, roll 6 -> steps into home = 6 > 4, invalid for home lane
    // But 3 tokens in home CAN enter on roll 6
    expect(moves.length).toBe(3);
  });

  it('should handle three sixes rule', () => {
    const state = createMockGameState();
    state.rules.allowThreeSixes = true;
    state.diceRoll = { value: 6, rolledAt: new Date().toISOString(), rolledBy: 'p1', isServerGenerated: true, auditId: '1' };
    state.currentPlayerIndex = 0;
    state.players[0] = createMockPlayer('red', [-1, -1, -1, -1], { 
      userId: 'player1', 
      consecutiveSixes: 2, // Already rolled two sixes
      hasRolled: true 
    });
    
    // This test is more about the game engine logic than getLegalMoves
    // getLegalMoves should still return valid moves
    const moves = getLegalMoves(state);
    expect(moves.length).toBe(4); // All tokens can enter
  });
});