import { create } from "zustand";

interface Player {
  id: string;
  username: string;
  color: "red" | "green" | "yellow" | "blue";
  tokens: number[]; // positions: -1 = home, 0-51 = track, 52+ = home stretch
  isBot: boolean;
  isOnline: boolean;
}

interface GameState {
  matchId: string | null;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  isMyTurn: boolean;
  winner: string | null;
  // Actions
  setMatch: (matchId: string, players: Player[]) => void;
  rollDice: () => void;
  setDiceValue: (value: number) => void;
  moveToken: (
    playerIndex: number,
    tokenIndex: number,
    position: number,
  ) => void;
  nextTurn: () => void;
  setWinner: (playerId: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  matchId: null,
  players: [],
  currentPlayerIndex: 0,
  diceValue: null,
  isRolling: false,
  isMyTurn: false,
  winner: null,
  setMatch: (matchId, players) =>
    set({ matchId, players, currentPlayerIndex: 0, winner: null }),
  rollDice: () => set({ isRolling: true, diceValue: null }),
  setDiceValue: (value) => set({ isRolling: false, diceValue: value }),
  moveToken: (playerIndex, tokenIndex, position) =>
    set((state) => {
      const players = [...state.players];
      players[playerIndex] = {
        ...players[playerIndex],
        tokens: players[playerIndex].tokens.map((t, i) =>
          i === tokenIndex ? position : t,
        ),
      };
      return { players };
    }),
  nextTurn: () =>
    set((state) => ({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      diceValue: null,
    })),
  setWinner: (playerId) => set({ winner: playerId }),
  reset: () =>
    set({
      matchId: null,
      players: [],
      currentPlayerIndex: 0,
      diceValue: null,
      isRolling: false,
      winner: null,
    }),
}));

export type { Player, GameState };
