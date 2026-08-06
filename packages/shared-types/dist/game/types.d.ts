import { z } from 'zod';
export declare const UUIDSchema: z.ZodString;
export type UUID = z.infer<typeof UUIDSchema>;
export declare const TimestampSchema: z.ZodString;
export type Timestamp = z.infer<typeof TimestampSchema>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type Pagination = z.infer<typeof PaginationSchema>;
export declare const PaginatedResponseSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    data: z.ZodArray<T, "many">;
    meta: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: T["_output"][];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}, {
    data: T["_input"][];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
export declare const PlayerColorSchema: z.ZodEnum<["red", "green", "yellow", "blue"]>;
export type PlayerColor = z.infer<typeof PlayerColorSchema>;
export declare const GameModeSchema: z.ZodEnum<["vs_ai", "vs_human", "group", "private", "team", "tournament"]>;
export type GameMode = z.infer<typeof GameModeSchema>;
export declare const BotDifficultySchema: z.ZodEnum<["easy", "medium", "hard"]>;
export type BotDifficulty = z.infer<typeof BotDifficultySchema>;
export declare const MatchStatusSchema: z.ZodEnum<["waiting", "starting", "in_progress", "completed", "cancelled", "abandoned"]>;
export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export declare const RoomStatusSchema: z.ZodEnum<["lobby", "starting", "in_progress", "completed"]>;
export type RoomStatus = z.infer<typeof RoomStatusSchema>;
export declare const TournamentStatusSchema: z.ZodEnum<["draft", "published", "registration_open", "registration_closed", "check_in", "in_progress", "completed", "cancelled"]>;
export type TournamentStatus = z.infer<typeof TournamentStatusSchema>;
export declare const GameRulesSchema: z.ZodObject<{
    tokensPerPlayer: z.ZodDefault<z.ZodNumber>;
    entryRoll: z.ZodDefault<z.ZodNumber>;
    allowThreeSixes: z.ZodDefault<z.ZodBoolean>;
    extraTurnOnSix: z.ZodDefault<z.ZodBoolean>;
    extraTurnOnCapture: z.ZodDefault<z.ZodBoolean>;
    extraTurnOnHome: z.ZodDefault<z.ZodBoolean>;
    turnTimeSeconds: z.ZodDefault<z.ZodNumber>;
    reconnectionGraceSeconds: z.ZodDefault<z.ZodNumber>;
    inactivityLimit: z.ZodDefault<z.ZodNumber>;
    allowBlockades: z.ZodDefault<z.ZodBoolean>;
    safeCells: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
    teamMode: z.ZodDefault<z.ZodBoolean>;
    botDifficulty: z.ZodDefault<z.ZodEnum<["easy", "medium", "hard"]>>;
}, "strip", z.ZodTypeAny, {
    tokensPerPlayer: number;
    entryRoll: number;
    allowThreeSixes: boolean;
    extraTurnOnSix: boolean;
    extraTurnOnCapture: boolean;
    extraTurnOnHome: boolean;
    turnTimeSeconds: number;
    reconnectionGraceSeconds: number;
    inactivityLimit: number;
    allowBlockades: boolean;
    safeCells: number[];
    teamMode: boolean;
    botDifficulty: "easy" | "medium" | "hard";
}, {
    tokensPerPlayer?: number | undefined;
    entryRoll?: number | undefined;
    allowThreeSixes?: boolean | undefined;
    extraTurnOnSix?: boolean | undefined;
    extraTurnOnCapture?: boolean | undefined;
    extraTurnOnHome?: boolean | undefined;
    turnTimeSeconds?: number | undefined;
    reconnectionGraceSeconds?: number | undefined;
    inactivityLimit?: number | undefined;
    allowBlockades?: boolean | undefined;
    safeCells?: number[] | undefined;
    teamMode?: boolean | undefined;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
}>;
export type GameRules = z.infer<typeof GameRulesSchema>;
export declare const TokenStateSchema: z.ZodObject<{
    id: z.ZodNumber;
    position: z.ZodNumber;
    isInHome: z.ZodBoolean;
    isFinished: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: number;
    position: number;
    isInHome: boolean;
    isFinished: boolean;
}, {
    id: number;
    position: number;
    isInHome: boolean;
    isFinished: boolean;
}>;
export type TokenState = z.infer<typeof TokenStateSchema>;
export declare const PlayerStateSchema: z.ZodObject<{
    userId: z.ZodString;
    color: z.ZodEnum<["red", "green", "yellow", "blue"]>;
    tokens: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        position: z.ZodNumber;
        isInHome: z.ZodBoolean;
        isFinished: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: number;
        position: number;
        isInHome: boolean;
        isFinished: boolean;
    }, {
        id: number;
        position: number;
        isInHome: boolean;
        isFinished: boolean;
    }>, "many">;
    isActive: z.ZodBoolean;
    isConnected: z.ZodBoolean;
    hasRolled: z.ZodBoolean;
    lastMoveAt: z.ZodOptional<z.ZodString>;
    consecutiveSixes: z.ZodDefault<z.ZodNumber>;
    isBot: z.ZodDefault<z.ZodBoolean>;
    botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    teamId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    color: "red" | "green" | "yellow" | "blue";
    tokens: {
        id: number;
        position: number;
        isInHome: boolean;
        isFinished: boolean;
    }[];
    isActive: boolean;
    isConnected: boolean;
    hasRolled: boolean;
    consecutiveSixes: number;
    isBot: boolean;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
    lastMoveAt?: string | undefined;
    teamId?: number | undefined;
}, {
    userId: string;
    color: "red" | "green" | "yellow" | "blue";
    tokens: {
        id: number;
        position: number;
        isInHome: boolean;
        isFinished: boolean;
    }[];
    isActive: boolean;
    isConnected: boolean;
    hasRolled: boolean;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
    lastMoveAt?: string | undefined;
    consecutiveSixes?: number | undefined;
    isBot?: boolean | undefined;
    teamId?: number | undefined;
}>;
export type PlayerState = z.infer<typeof PlayerStateSchema>;
export declare const DiceRollSchema: z.ZodObject<{
    value: z.ZodNumber;
    rolledAt: z.ZodString;
    rolledBy: z.ZodString;
    isServerGenerated: z.ZodDefault<z.ZodBoolean>;
    auditId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: number;
    rolledAt: string;
    rolledBy: string;
    isServerGenerated: boolean;
    auditId: string;
}, {
    value: number;
    rolledAt: string;
    rolledBy: string;
    auditId: string;
    isServerGenerated?: boolean | undefined;
}>;
export type DiceRoll = z.infer<typeof DiceRollSchema>;
export declare const MoveSchema: z.ZodObject<{
    tokenId: z.ZodNumber;
    fromPosition: z.ZodNumber;
    toPosition: z.ZodNumber;
    capturedTokens: z.ZodArray<z.ZodObject<{
        playerId: z.ZodString;
        tokenId: z.ZodNumber;
        fromPosition: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tokenId: number;
        fromPosition: number;
        playerId: string;
    }, {
        tokenId: number;
        fromPosition: number;
        playerId: string;
    }>, "many">;
    isExtraTurn: z.ZodBoolean;
    gameStateVersion: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    tokenId: number;
    fromPosition: number;
    toPosition: number;
    capturedTokens: {
        tokenId: number;
        fromPosition: number;
        playerId: string;
    }[];
    isExtraTurn: boolean;
    gameStateVersion: number;
}, {
    tokenId: number;
    fromPosition: number;
    toPosition: number;
    capturedTokens: {
        tokenId: number;
        fromPosition: number;
        playerId: string;
    }[];
    isExtraTurn: boolean;
    gameStateVersion: number;
}>;
export type Move = z.infer<typeof MoveSchema>;
export declare const GameStateSchema: z.ZodObject<{
    matchId: z.ZodString;
    roomId: z.ZodOptional<z.ZodString>;
    tournamentId: z.ZodOptional<z.ZodString>;
    mode: z.ZodEnum<["vs_ai", "vs_human", "group", "private", "team", "tournament"]>;
    rules: z.ZodObject<{
        tokensPerPlayer: z.ZodDefault<z.ZodNumber>;
        entryRoll: z.ZodDefault<z.ZodNumber>;
        allowThreeSixes: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnSix: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnCapture: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnHome: z.ZodDefault<z.ZodBoolean>;
        turnTimeSeconds: z.ZodDefault<z.ZodNumber>;
        reconnectionGraceSeconds: z.ZodDefault<z.ZodNumber>;
        inactivityLimit: z.ZodDefault<z.ZodNumber>;
        allowBlockades: z.ZodDefault<z.ZodBoolean>;
        safeCells: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        teamMode: z.ZodDefault<z.ZodBoolean>;
        botDifficulty: z.ZodDefault<z.ZodEnum<["easy", "medium", "hard"]>>;
    }, "strip", z.ZodTypeAny, {
        tokensPerPlayer: number;
        entryRoll: number;
        allowThreeSixes: boolean;
        extraTurnOnSix: boolean;
        extraTurnOnCapture: boolean;
        extraTurnOnHome: boolean;
        turnTimeSeconds: number;
        reconnectionGraceSeconds: number;
        inactivityLimit: number;
        allowBlockades: boolean;
        safeCells: number[];
        teamMode: boolean;
        botDifficulty: "easy" | "medium" | "hard";
    }, {
        tokensPerPlayer?: number | undefined;
        entryRoll?: number | undefined;
        allowThreeSixes?: boolean | undefined;
        extraTurnOnSix?: boolean | undefined;
        extraTurnOnCapture?: boolean | undefined;
        extraTurnOnHome?: boolean | undefined;
        turnTimeSeconds?: number | undefined;
        reconnectionGraceSeconds?: number | undefined;
        inactivityLimit?: number | undefined;
        allowBlockades?: boolean | undefined;
        safeCells?: number[] | undefined;
        teamMode?: boolean | undefined;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    }>;
    players: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        color: z.ZodEnum<["red", "green", "yellow", "blue"]>;
        tokens: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            position: z.ZodNumber;
            isInHome: z.ZodBoolean;
            isFinished: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            id: number;
            position: number;
            isInHome: boolean;
            isFinished: boolean;
        }, {
            id: number;
            position: number;
            isInHome: boolean;
            isFinished: boolean;
        }>, "many">;
        isActive: z.ZodBoolean;
        isConnected: z.ZodBoolean;
        hasRolled: z.ZodBoolean;
        lastMoveAt: z.ZodOptional<z.ZodString>;
        consecutiveSixes: z.ZodDefault<z.ZodNumber>;
        isBot: z.ZodDefault<z.ZodBoolean>;
        botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        teamId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        tokens: {
            id: number;
            position: number;
            isInHome: boolean;
            isFinished: boolean;
        }[];
        isActive: boolean;
        isConnected: boolean;
        hasRolled: boolean;
        consecutiveSixes: number;
        isBot: boolean;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        lastMoveAt?: string | undefined;
        teamId?: number | undefined;
    }, {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        tokens: {
            id: number;
            position: number;
            isInHome: boolean;
            isFinished: boolean;
        }[];
        isActive: boolean;
        isConnected: boolean;
        hasRolled: boolean;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        lastMoveAt?: string | undefined;
        consecutiveSixes?: number | undefined;
        isBot?: boolean | undefined;
        teamId?: number | undefined;
    }>, "many">;
    currentPlayerIndex: z.ZodNumber;
    diceRoll: z.ZodOptional<z.ZodObject<{
        value: z.ZodNumber;
        rolledAt: z.ZodString;
        rolledBy: z.ZodString;
        isServerGenerated: z.ZodDefault<z.ZodBoolean>;
        auditId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: number;
        rolledAt: string;
        rolledBy: string;
        isServerGenerated: boolean;
        auditId: string;
    }, {
        value: number;
        rolledAt: string;
        rolledBy: string;
        auditId: string;
        isServerGenerated?: boolean | undefined;
    }>>;
    legalMoves: z.ZodArray<z.ZodObject<{
        tokenId: z.ZodNumber;
        fromPosition: z.ZodNumber;
        toPosition: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
    }, {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
    }>, "many">;
    moveHistory: z.ZodArray<z.ZodObject<{
        tokenId: z.ZodNumber;
        fromPosition: z.ZodNumber;
        toPosition: z.ZodNumber;
        capturedTokens: z.ZodArray<z.ZodObject<{
            playerId: z.ZodString;
            tokenId: z.ZodNumber;
            fromPosition: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tokenId: number;
            fromPosition: number;
            playerId: string;
        }, {
            tokenId: number;
            fromPosition: number;
            playerId: string;
        }>, "many">;
        isExtraTurn: z.ZodBoolean;
        gameStateVersion: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
        capturedTokens: {
            tokenId: number;
            fromPosition: number;
            playerId: string;
        }[];
        isExtraTurn: boolean;
        gameStateVersion: number;
    }, {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
        capturedTokens: {
            tokenId: number;
            fromPosition: number;
            playerId: string;
        }[];
        isExtraTurn: boolean;
        gameStateVersion: number;
    }>, "many">;
    stateVersion: z.ZodDefault<z.ZodNumber>;
    status: z.ZodEnum<["waiting", "starting", "in_progress", "completed", "cancelled", "abandoned"]>;
    winner: z.ZodNullable<z.ZodString>;
    rankings: z.ZodArray<z.ZodString, "many">;
    startedAt: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
    matchId: string;
    mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
    rules: {
        tokensPerPlayer: number;
        entryRoll: number;
        allowThreeSixes: boolean;
        extraTurnOnSix: boolean;
        extraTurnOnCapture: boolean;
        extraTurnOnHome: boolean;
        turnTimeSeconds: number;
        reconnectionGraceSeconds: number;
        inactivityLimit: number;
        allowBlockades: boolean;
        safeCells: number[];
        teamMode: boolean;
        botDifficulty: "easy" | "medium" | "hard";
    };
    players: {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        tokens: {
            id: number;
            position: number;
            isInHome: boolean;
            isFinished: boolean;
        }[];
        isActive: boolean;
        isConnected: boolean;
        hasRolled: boolean;
        consecutiveSixes: number;
        isBot: boolean;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        lastMoveAt?: string | undefined;
        teamId?: number | undefined;
    }[];
    currentPlayerIndex: number;
    legalMoves: {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
    }[];
    moveHistory: {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
        capturedTokens: {
            tokenId: number;
            fromPosition: number;
            playerId: string;
        }[];
        isExtraTurn: boolean;
        gameStateVersion: number;
    }[];
    stateVersion: number;
    winner: string | null;
    rankings: string[];
    createdAt: string;
    roomId?: string | undefined;
    tournamentId?: string | undefined;
    diceRoll?: {
        value: number;
        rolledAt: string;
        rolledBy: string;
        isServerGenerated: boolean;
        auditId: string;
    } | undefined;
    startedAt?: string | undefined;
    completedAt?: string | undefined;
}, {
    status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
    matchId: string;
    mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
    rules: {
        tokensPerPlayer?: number | undefined;
        entryRoll?: number | undefined;
        allowThreeSixes?: boolean | undefined;
        extraTurnOnSix?: boolean | undefined;
        extraTurnOnCapture?: boolean | undefined;
        extraTurnOnHome?: boolean | undefined;
        turnTimeSeconds?: number | undefined;
        reconnectionGraceSeconds?: number | undefined;
        inactivityLimit?: number | undefined;
        allowBlockades?: boolean | undefined;
        safeCells?: number[] | undefined;
        teamMode?: boolean | undefined;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    };
    players: {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        tokens: {
            id: number;
            position: number;
            isInHome: boolean;
            isFinished: boolean;
        }[];
        isActive: boolean;
        isConnected: boolean;
        hasRolled: boolean;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        lastMoveAt?: string | undefined;
        consecutiveSixes?: number | undefined;
        isBot?: boolean | undefined;
        teamId?: number | undefined;
    }[];
    currentPlayerIndex: number;
    legalMoves: {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
    }[];
    moveHistory: {
        tokenId: number;
        fromPosition: number;
        toPosition: number;
        capturedTokens: {
            tokenId: number;
            fromPosition: number;
            playerId: string;
        }[];
        isExtraTurn: boolean;
        gameStateVersion: number;
    }[];
    winner: string | null;
    rankings: string[];
    createdAt: string;
    roomId?: string | undefined;
    tournamentId?: string | undefined;
    diceRoll?: {
        value: number;
        rolledAt: string;
        rolledBy: string;
        auditId: string;
        isServerGenerated?: boolean | undefined;
    } | undefined;
    stateVersion?: number | undefined;
    startedAt?: string | undefined;
    completedAt?: string | undefined;
}>;
export type GameState = z.infer<typeof GameStateSchema>;
export declare const MatchPlayerSchema: z.ZodObject<{
    userId: z.ZodString;
    color: z.ZodEnum<["red", "green", "yellow", "blue"]>;
    isBot: z.ZodDefault<z.ZodBoolean>;
    botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    teamId: z.ZodOptional<z.ZodNumber>;
    joinedAt: z.ZodString;
    leftAt: z.ZodNullable<z.ZodString>;
    finalRank: z.ZodNullable<z.ZodNumber>;
    coinsWon: z.ZodDefault<z.ZodNumber>;
    coinsLost: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    color: "red" | "green" | "yellow" | "blue";
    isBot: boolean;
    joinedAt: string;
    leftAt: string | null;
    finalRank: number | null;
    coinsWon: number;
    coinsLost: number;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
    teamId?: number | undefined;
}, {
    userId: string;
    color: "red" | "green" | "yellow" | "blue";
    joinedAt: string;
    leftAt: string | null;
    finalRank: number | null;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
    isBot?: boolean | undefined;
    teamId?: number | undefined;
    coinsWon?: number | undefined;
    coinsLost?: number | undefined;
}>;
export type MatchPlayer = z.infer<typeof MatchPlayerSchema>;
export declare const MatchSchema: z.ZodObject<{
    id: z.ZodString;
    mode: z.ZodEnum<["vs_ai", "vs_human", "group", "private", "team", "tournament"]>;
    roomId: z.ZodNullable<z.ZodString>;
    tournamentId: z.ZodNullable<z.ZodString>;
    players: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        color: z.ZodEnum<["red", "green", "yellow", "blue"]>;
        isBot: z.ZodDefault<z.ZodBoolean>;
        botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        teamId: z.ZodOptional<z.ZodNumber>;
        joinedAt: z.ZodString;
        leftAt: z.ZodNullable<z.ZodString>;
        finalRank: z.ZodNullable<z.ZodNumber>;
        coinsWon: z.ZodDefault<z.ZodNumber>;
        coinsLost: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        isBot: boolean;
        joinedAt: string;
        leftAt: string | null;
        finalRank: number | null;
        coinsWon: number;
        coinsLost: number;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        teamId?: number | undefined;
    }, {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        joinedAt: string;
        leftAt: string | null;
        finalRank: number | null;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        isBot?: boolean | undefined;
        teamId?: number | undefined;
        coinsWon?: number | undefined;
        coinsLost?: number | undefined;
    }>, "many">;
    entryFee: z.ZodDefault<z.ZodNumber>;
    prizePool: z.ZodDefault<z.ZodNumber>;
    platformFee: z.ZodDefault<z.ZodNumber>;
    status: z.ZodEnum<["waiting", "starting", "in_progress", "completed", "cancelled", "abandoned"]>;
    winnerId: z.ZodNullable<z.ZodString>;
    gameState: z.ZodNullable<z.ZodObject<{
        matchId: z.ZodString;
        roomId: z.ZodOptional<z.ZodString>;
        tournamentId: z.ZodOptional<z.ZodString>;
        mode: z.ZodEnum<["vs_ai", "vs_human", "group", "private", "team", "tournament"]>;
        rules: z.ZodObject<{
            tokensPerPlayer: z.ZodDefault<z.ZodNumber>;
            entryRoll: z.ZodDefault<z.ZodNumber>;
            allowThreeSixes: z.ZodDefault<z.ZodBoolean>;
            extraTurnOnSix: z.ZodDefault<z.ZodBoolean>;
            extraTurnOnCapture: z.ZodDefault<z.ZodBoolean>;
            extraTurnOnHome: z.ZodDefault<z.ZodBoolean>;
            turnTimeSeconds: z.ZodDefault<z.ZodNumber>;
            reconnectionGraceSeconds: z.ZodDefault<z.ZodNumber>;
            inactivityLimit: z.ZodDefault<z.ZodNumber>;
            allowBlockades: z.ZodDefault<z.ZodBoolean>;
            safeCells: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
            teamMode: z.ZodDefault<z.ZodBoolean>;
            botDifficulty: z.ZodDefault<z.ZodEnum<["easy", "medium", "hard"]>>;
        }, "strip", z.ZodTypeAny, {
            tokensPerPlayer: number;
            entryRoll: number;
            allowThreeSixes: boolean;
            extraTurnOnSix: boolean;
            extraTurnOnCapture: boolean;
            extraTurnOnHome: boolean;
            turnTimeSeconds: number;
            reconnectionGraceSeconds: number;
            inactivityLimit: number;
            allowBlockades: boolean;
            safeCells: number[];
            teamMode: boolean;
            botDifficulty: "easy" | "medium" | "hard";
        }, {
            tokensPerPlayer?: number | undefined;
            entryRoll?: number | undefined;
            allowThreeSixes?: boolean | undefined;
            extraTurnOnSix?: boolean | undefined;
            extraTurnOnCapture?: boolean | undefined;
            extraTurnOnHome?: boolean | undefined;
            turnTimeSeconds?: number | undefined;
            reconnectionGraceSeconds?: number | undefined;
            inactivityLimit?: number | undefined;
            allowBlockades?: boolean | undefined;
            safeCells?: number[] | undefined;
            teamMode?: boolean | undefined;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
        }>;
        players: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            color: z.ZodEnum<["red", "green", "yellow", "blue"]>;
            tokens: z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                position: z.ZodNumber;
                isInHome: z.ZodBoolean;
                isFinished: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }, {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }>, "many">;
            isActive: z.ZodBoolean;
            isConnected: z.ZodBoolean;
            hasRolled: z.ZodBoolean;
            lastMoveAt: z.ZodOptional<z.ZodString>;
            consecutiveSixes: z.ZodDefault<z.ZodNumber>;
            isBot: z.ZodDefault<z.ZodBoolean>;
            botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
            teamId: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            color: "red" | "green" | "yellow" | "blue";
            tokens: {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }[];
            isActive: boolean;
            isConnected: boolean;
            hasRolled: boolean;
            consecutiveSixes: number;
            isBot: boolean;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
            lastMoveAt?: string | undefined;
            teamId?: number | undefined;
        }, {
            userId: string;
            color: "red" | "green" | "yellow" | "blue";
            tokens: {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }[];
            isActive: boolean;
            isConnected: boolean;
            hasRolled: boolean;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
            lastMoveAt?: string | undefined;
            consecutiveSixes?: number | undefined;
            isBot?: boolean | undefined;
            teamId?: number | undefined;
        }>, "many">;
        currentPlayerIndex: z.ZodNumber;
        diceRoll: z.ZodOptional<z.ZodObject<{
            value: z.ZodNumber;
            rolledAt: z.ZodString;
            rolledBy: z.ZodString;
            isServerGenerated: z.ZodDefault<z.ZodBoolean>;
            auditId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: number;
            rolledAt: string;
            rolledBy: string;
            isServerGenerated: boolean;
            auditId: string;
        }, {
            value: number;
            rolledAt: string;
            rolledBy: string;
            auditId: string;
            isServerGenerated?: boolean | undefined;
        }>>;
        legalMoves: z.ZodArray<z.ZodObject<{
            tokenId: z.ZodNumber;
            fromPosition: z.ZodNumber;
            toPosition: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
        }, {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
        }>, "many">;
        moveHistory: z.ZodArray<z.ZodObject<{
            tokenId: z.ZodNumber;
            fromPosition: z.ZodNumber;
            toPosition: z.ZodNumber;
            capturedTokens: z.ZodArray<z.ZodObject<{
                playerId: z.ZodString;
                tokenId: z.ZodNumber;
                fromPosition: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }, {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }>, "many">;
            isExtraTurn: z.ZodBoolean;
            gameStateVersion: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
            capturedTokens: {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }[];
            isExtraTurn: boolean;
            gameStateVersion: number;
        }, {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
            capturedTokens: {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }[];
            isExtraTurn: boolean;
            gameStateVersion: number;
        }>, "many">;
        stateVersion: z.ZodDefault<z.ZodNumber>;
        status: z.ZodEnum<["waiting", "starting", "in_progress", "completed", "cancelled", "abandoned"]>;
        winner: z.ZodNullable<z.ZodString>;
        rankings: z.ZodArray<z.ZodString, "many">;
        startedAt: z.ZodOptional<z.ZodString>;
        completedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
        matchId: string;
        mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
        rules: {
            tokensPerPlayer: number;
            entryRoll: number;
            allowThreeSixes: boolean;
            extraTurnOnSix: boolean;
            extraTurnOnCapture: boolean;
            extraTurnOnHome: boolean;
            turnTimeSeconds: number;
            reconnectionGraceSeconds: number;
            inactivityLimit: number;
            allowBlockades: boolean;
            safeCells: number[];
            teamMode: boolean;
            botDifficulty: "easy" | "medium" | "hard";
        };
        players: {
            userId: string;
            color: "red" | "green" | "yellow" | "blue";
            tokens: {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }[];
            isActive: boolean;
            isConnected: boolean;
            hasRolled: boolean;
            consecutiveSixes: number;
            isBot: boolean;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
            lastMoveAt?: string | undefined;
            teamId?: number | undefined;
        }[];
        currentPlayerIndex: number;
        legalMoves: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
        }[];
        moveHistory: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
            capturedTokens: {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }[];
            isExtraTurn: boolean;
            gameStateVersion: number;
        }[];
        stateVersion: number;
        winner: string | null;
        rankings: string[];
        createdAt: string;
        roomId?: string | undefined;
        tournamentId?: string | undefined;
        diceRoll?: {
            value: number;
            rolledAt: string;
            rolledBy: string;
            isServerGenerated: boolean;
            auditId: string;
        } | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
    }, {
        status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
        matchId: string;
        mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
        rules: {
            tokensPerPlayer?: number | undefined;
            entryRoll?: number | undefined;
            allowThreeSixes?: boolean | undefined;
            extraTurnOnSix?: boolean | undefined;
            extraTurnOnCapture?: boolean | undefined;
            extraTurnOnHome?: boolean | undefined;
            turnTimeSeconds?: number | undefined;
            reconnectionGraceSeconds?: number | undefined;
            inactivityLimit?: number | undefined;
            allowBlockades?: boolean | undefined;
            safeCells?: number[] | undefined;
            teamMode?: boolean | undefined;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
        };
        players: {
            userId: string;
            color: "red" | "green" | "yellow" | "blue";
            tokens: {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }[];
            isActive: boolean;
            isConnected: boolean;
            hasRolled: boolean;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
            lastMoveAt?: string | undefined;
            consecutiveSixes?: number | undefined;
            isBot?: boolean | undefined;
            teamId?: number | undefined;
        }[];
        currentPlayerIndex: number;
        legalMoves: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
        }[];
        moveHistory: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
            capturedTokens: {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }[];
            isExtraTurn: boolean;
            gameStateVersion: number;
        }[];
        winner: string | null;
        rankings: string[];
        createdAt: string;
        roomId?: string | undefined;
        tournamentId?: string | undefined;
        diceRoll?: {
            value: number;
            rolledAt: string;
            rolledBy: string;
            auditId: string;
            isServerGenerated?: boolean | undefined;
        } | undefined;
        stateVersion?: number | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
    }>>;
    startedAt: z.ZodNullable<z.ZodString>;
    completedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
    id: string;
    roomId: string | null;
    tournamentId: string | null;
    mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
    players: {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        isBot: boolean;
        joinedAt: string;
        leftAt: string | null;
        finalRank: number | null;
        coinsWon: number;
        coinsLost: number;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        teamId?: number | undefined;
    }[];
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    entryFee: number;
    prizePool: number;
    platformFee: number;
    winnerId: string | null;
    gameState: {
        status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
        matchId: string;
        mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
        rules: {
            tokensPerPlayer: number;
            entryRoll: number;
            allowThreeSixes: boolean;
            extraTurnOnSix: boolean;
            extraTurnOnCapture: boolean;
            extraTurnOnHome: boolean;
            turnTimeSeconds: number;
            reconnectionGraceSeconds: number;
            inactivityLimit: number;
            allowBlockades: boolean;
            safeCells: number[];
            teamMode: boolean;
            botDifficulty: "easy" | "medium" | "hard";
        };
        players: {
            userId: string;
            color: "red" | "green" | "yellow" | "blue";
            tokens: {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }[];
            isActive: boolean;
            isConnected: boolean;
            hasRolled: boolean;
            consecutiveSixes: number;
            isBot: boolean;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
            lastMoveAt?: string | undefined;
            teamId?: number | undefined;
        }[];
        currentPlayerIndex: number;
        legalMoves: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
        }[];
        moveHistory: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
            capturedTokens: {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }[];
            isExtraTurn: boolean;
            gameStateVersion: number;
        }[];
        stateVersion: number;
        winner: string | null;
        rankings: string[];
        createdAt: string;
        roomId?: string | undefined;
        tournamentId?: string | undefined;
        diceRoll?: {
            value: number;
            rolledAt: string;
            rolledBy: string;
            isServerGenerated: boolean;
            auditId: string;
        } | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
    } | null;
}, {
    status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
    id: string;
    roomId: string | null;
    tournamentId: string | null;
    mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
    players: {
        userId: string;
        color: "red" | "green" | "yellow" | "blue";
        joinedAt: string;
        leftAt: string | null;
        finalRank: number | null;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        isBot?: boolean | undefined;
        teamId?: number | undefined;
        coinsWon?: number | undefined;
        coinsLost?: number | undefined;
    }[];
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    winnerId: string | null;
    gameState: {
        status: "waiting" | "starting" | "in_progress" | "completed" | "cancelled" | "abandoned";
        matchId: string;
        mode: "vs_ai" | "vs_human" | "group" | "private" | "team" | "tournament";
        rules: {
            tokensPerPlayer?: number | undefined;
            entryRoll?: number | undefined;
            allowThreeSixes?: boolean | undefined;
            extraTurnOnSix?: boolean | undefined;
            extraTurnOnCapture?: boolean | undefined;
            extraTurnOnHome?: boolean | undefined;
            turnTimeSeconds?: number | undefined;
            reconnectionGraceSeconds?: number | undefined;
            inactivityLimit?: number | undefined;
            allowBlockades?: boolean | undefined;
            safeCells?: number[] | undefined;
            teamMode?: boolean | undefined;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
        };
        players: {
            userId: string;
            color: "red" | "green" | "yellow" | "blue";
            tokens: {
                id: number;
                position: number;
                isInHome: boolean;
                isFinished: boolean;
            }[];
            isActive: boolean;
            isConnected: boolean;
            hasRolled: boolean;
            botDifficulty?: "easy" | "medium" | "hard" | undefined;
            lastMoveAt?: string | undefined;
            consecutiveSixes?: number | undefined;
            isBot?: boolean | undefined;
            teamId?: number | undefined;
        }[];
        currentPlayerIndex: number;
        legalMoves: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
        }[];
        moveHistory: {
            tokenId: number;
            fromPosition: number;
            toPosition: number;
            capturedTokens: {
                tokenId: number;
                fromPosition: number;
                playerId: string;
            }[];
            isExtraTurn: boolean;
            gameStateVersion: number;
        }[];
        winner: string | null;
        rankings: string[];
        createdAt: string;
        roomId?: string | undefined;
        tournamentId?: string | undefined;
        diceRoll?: {
            value: number;
            rolledAt: string;
            rolledBy: string;
            auditId: string;
            isServerGenerated?: boolean | undefined;
        } | undefined;
        stateVersion?: number | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
    } | null;
    entryFee?: number | undefined;
    prizePool?: number | undefined;
    platformFee?: number | undefined;
}>;
export type Match = z.infer<typeof MatchSchema>;
export declare const RoomPlayerSchema: z.ZodObject<{
    userId: z.ZodString;
    color: z.ZodNullable<z.ZodEnum<["red", "green", "yellow", "blue"]>>;
    isHost: z.ZodDefault<z.ZodBoolean>;
    isReady: z.ZodDefault<z.ZodBoolean>;
    isBot: z.ZodDefault<z.ZodBoolean>;
    botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    teamId: z.ZodNullable<z.ZodNumber>;
    joinedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    color: "red" | "green" | "yellow" | "blue" | null;
    isBot: boolean;
    teamId: number | null;
    joinedAt: string;
    isHost: boolean;
    isReady: boolean;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
}, {
    userId: string;
    color: "red" | "green" | "yellow" | "blue" | null;
    teamId: number | null;
    joinedAt: string;
    botDifficulty?: "easy" | "medium" | "hard" | undefined;
    isBot?: boolean | undefined;
    isHost?: boolean | undefined;
    isReady?: boolean | undefined;
}>;
export type RoomPlayer = z.infer<typeof RoomPlayerSchema>;
export declare const RoomSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    hostId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    hasPassword: z.ZodDefault<z.ZodBoolean>;
    passwordHash: z.ZodNullable<z.ZodString>;
    maxPlayers: z.ZodDefault<z.ZodNumber>;
    entryFee: z.ZodDefault<z.ZodNumber>;
    rules: z.ZodObject<{
        tokensPerPlayer: z.ZodDefault<z.ZodNumber>;
        entryRoll: z.ZodDefault<z.ZodNumber>;
        allowThreeSixes: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnSix: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnCapture: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnHome: z.ZodDefault<z.ZodBoolean>;
        turnTimeSeconds: z.ZodDefault<z.ZodNumber>;
        reconnectionGraceSeconds: z.ZodDefault<z.ZodNumber>;
        inactivityLimit: z.ZodDefault<z.ZodNumber>;
        allowBlockades: z.ZodDefault<z.ZodBoolean>;
        safeCells: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        teamMode: z.ZodDefault<z.ZodBoolean>;
        botDifficulty: z.ZodDefault<z.ZodEnum<["easy", "medium", "hard"]>>;
    }, "strip", z.ZodTypeAny, {
        tokensPerPlayer: number;
        entryRoll: number;
        allowThreeSixes: boolean;
        extraTurnOnSix: boolean;
        extraTurnOnCapture: boolean;
        extraTurnOnHome: boolean;
        turnTimeSeconds: number;
        reconnectionGraceSeconds: number;
        inactivityLimit: number;
        allowBlockades: boolean;
        safeCells: number[];
        teamMode: boolean;
        botDifficulty: "easy" | "medium" | "hard";
    }, {
        tokensPerPlayer?: number | undefined;
        entryRoll?: number | undefined;
        allowThreeSixes?: boolean | undefined;
        extraTurnOnSix?: boolean | undefined;
        extraTurnOnCapture?: boolean | undefined;
        extraTurnOnHome?: boolean | undefined;
        turnTimeSeconds?: number | undefined;
        reconnectionGraceSeconds?: number | undefined;
        inactivityLimit?: number | undefined;
        allowBlockades?: boolean | undefined;
        safeCells?: number[] | undefined;
        teamMode?: boolean | undefined;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    }>;
    status: z.ZodEnum<["lobby", "starting", "in_progress", "completed"]>;
    players: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        color: z.ZodNullable<z.ZodEnum<["red", "green", "yellow", "blue"]>>;
        isHost: z.ZodDefault<z.ZodBoolean>;
        isReady: z.ZodDefault<z.ZodBoolean>;
        isBot: z.ZodDefault<z.ZodBoolean>;
        botDifficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        teamId: z.ZodNullable<z.ZodNumber>;
        joinedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        color: "red" | "green" | "yellow" | "blue" | null;
        isBot: boolean;
        teamId: number | null;
        joinedAt: string;
        isHost: boolean;
        isReady: boolean;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    }, {
        userId: string;
        color: "red" | "green" | "yellow" | "blue" | null;
        teamId: number | null;
        joinedAt: string;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        isBot?: boolean | undefined;
        isHost?: boolean | undefined;
        isReady?: boolean | undefined;
    }>, "many">;
    spectators: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    matchId: z.ZodNullable<z.ZodString>;
    expiresAt: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: "starting" | "in_progress" | "completed" | "lobby";
    id: string;
    matchId: string | null;
    rules: {
        tokensPerPlayer: number;
        entryRoll: number;
        allowThreeSixes: boolean;
        extraTurnOnSix: boolean;
        extraTurnOnCapture: boolean;
        extraTurnOnHome: boolean;
        turnTimeSeconds: number;
        reconnectionGraceSeconds: number;
        inactivityLimit: number;
        allowBlockades: boolean;
        safeCells: number[];
        teamMode: boolean;
        botDifficulty: "easy" | "medium" | "hard";
    };
    players: {
        userId: string;
        color: "red" | "green" | "yellow" | "blue" | null;
        isBot: boolean;
        teamId: number | null;
        joinedAt: string;
        isHost: boolean;
        isReady: boolean;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    }[];
    createdAt: string;
    entryFee: number;
    hostId: string;
    isPublic: boolean;
    hasPassword: boolean;
    passwordHash: string | null;
    maxPlayers: number;
    spectators: string[];
    expiresAt: string;
    name?: string | undefined;
}, {
    code: string;
    status: "starting" | "in_progress" | "completed" | "lobby";
    id: string;
    matchId: string | null;
    rules: {
        tokensPerPlayer?: number | undefined;
        entryRoll?: number | undefined;
        allowThreeSixes?: boolean | undefined;
        extraTurnOnSix?: boolean | undefined;
        extraTurnOnCapture?: boolean | undefined;
        extraTurnOnHome?: boolean | undefined;
        turnTimeSeconds?: number | undefined;
        reconnectionGraceSeconds?: number | undefined;
        inactivityLimit?: number | undefined;
        allowBlockades?: boolean | undefined;
        safeCells?: number[] | undefined;
        teamMode?: boolean | undefined;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    };
    players: {
        userId: string;
        color: "red" | "green" | "yellow" | "blue" | null;
        teamId: number | null;
        joinedAt: string;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
        isBot?: boolean | undefined;
        isHost?: boolean | undefined;
        isReady?: boolean | undefined;
    }[];
    createdAt: string;
    hostId: string;
    passwordHash: string | null;
    expiresAt: string;
    entryFee?: number | undefined;
    name?: string | undefined;
    isPublic?: boolean | undefined;
    hasPassword?: boolean | undefined;
    maxPlayers?: number | undefined;
    spectators?: string[] | undefined;
}>;
export type Room = z.infer<typeof RoomSchema>;
export declare const TournamentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mode: z.ZodEnum<["knockout", "scheduled"]>;
    maxParticipants: z.ZodNumber;
    entryFee: z.ZodDefault<z.ZodNumber>;
    prizeBreakdown: z.ZodArray<z.ZodObject<{
        rank: z.ZodNumber;
        percentage: z.ZodNumber;
        fixedAmount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }, {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }>, "many">;
    rules: z.ZodObject<{
        tokensPerPlayer: z.ZodDefault<z.ZodNumber>;
        entryRoll: z.ZodDefault<z.ZodNumber>;
        allowThreeSixes: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnSix: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnCapture: z.ZodDefault<z.ZodBoolean>;
        extraTurnOnHome: z.ZodDefault<z.ZodBoolean>;
        turnTimeSeconds: z.ZodDefault<z.ZodNumber>;
        reconnectionGraceSeconds: z.ZodDefault<z.ZodNumber>;
        inactivityLimit: z.ZodDefault<z.ZodNumber>;
        allowBlockades: z.ZodDefault<z.ZodBoolean>;
        safeCells: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        teamMode: z.ZodDefault<z.ZodBoolean>;
        botDifficulty: z.ZodDefault<z.ZodEnum<["easy", "medium", "hard"]>>;
    }, "strip", z.ZodTypeAny, {
        tokensPerPlayer: number;
        entryRoll: number;
        allowThreeSixes: boolean;
        extraTurnOnSix: boolean;
        extraTurnOnCapture: boolean;
        extraTurnOnHome: boolean;
        turnTimeSeconds: number;
        reconnectionGraceSeconds: number;
        inactivityLimit: number;
        allowBlockades: boolean;
        safeCells: number[];
        teamMode: boolean;
        botDifficulty: "easy" | "medium" | "hard";
    }, {
        tokensPerPlayer?: number | undefined;
        entryRoll?: number | undefined;
        allowThreeSixes?: boolean | undefined;
        extraTurnOnSix?: boolean | undefined;
        extraTurnOnCapture?: boolean | undefined;
        extraTurnOnHome?: boolean | undefined;
        turnTimeSeconds?: number | undefined;
        reconnectionGraceSeconds?: number | undefined;
        inactivityLimit?: number | undefined;
        allowBlockades?: boolean | undefined;
        safeCells?: number[] | undefined;
        teamMode?: boolean | undefined;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    }>;
    status: z.ZodEnum<["draft", "published", "registration_open", "registration_closed", "check_in", "in_progress", "completed", "cancelled"]>;
    registrationOpensAt: z.ZodString;
    registrationClosesAt: z.ZodString;
    checkInStartsAt: z.ZodNullable<z.ZodString>;
    checkInEndsAt: z.ZodNullable<z.ZodString>;
    startedAt: z.ZodNullable<z.ZodString>;
    completedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    createdBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "in_progress" | "completed" | "cancelled" | "draft" | "published" | "registration_open" | "registration_closed" | "check_in";
    id: string;
    mode: "knockout" | "scheduled";
    rules: {
        tokensPerPlayer: number;
        entryRoll: number;
        allowThreeSixes: boolean;
        extraTurnOnSix: boolean;
        extraTurnOnCapture: boolean;
        extraTurnOnHome: boolean;
        turnTimeSeconds: number;
        reconnectionGraceSeconds: number;
        inactivityLimit: number;
        allowBlockades: boolean;
        safeCells: number[];
        teamMode: boolean;
        botDifficulty: "easy" | "medium" | "hard";
    };
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    entryFee: number;
    name: string;
    maxParticipants: number;
    prizeBreakdown: {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }[];
    registrationOpensAt: string;
    registrationClosesAt: string;
    checkInStartsAt: string | null;
    checkInEndsAt: string | null;
    createdBy: string;
    description?: string | undefined;
}, {
    status: "in_progress" | "completed" | "cancelled" | "draft" | "published" | "registration_open" | "registration_closed" | "check_in";
    id: string;
    mode: "knockout" | "scheduled";
    rules: {
        tokensPerPlayer?: number | undefined;
        entryRoll?: number | undefined;
        allowThreeSixes?: boolean | undefined;
        extraTurnOnSix?: boolean | undefined;
        extraTurnOnCapture?: boolean | undefined;
        extraTurnOnHome?: boolean | undefined;
        turnTimeSeconds?: number | undefined;
        reconnectionGraceSeconds?: number | undefined;
        inactivityLimit?: number | undefined;
        allowBlockades?: boolean | undefined;
        safeCells?: number[] | undefined;
        teamMode?: boolean | undefined;
        botDifficulty?: "easy" | "medium" | "hard" | undefined;
    };
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    name: string;
    maxParticipants: number;
    prizeBreakdown: {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }[];
    registrationOpensAt: string;
    registrationClosesAt: string;
    checkInStartsAt: string | null;
    checkInEndsAt: string | null;
    createdBy: string;
    entryFee?: number | undefined;
    description?: string | undefined;
}>;
export type Tournament = z.infer<typeof TournamentSchema>;
export declare const TournamentRegistrationSchema: z.ZodObject<{
    id: z.ZodString;
    tournamentId: z.ZodString;
    userId: z.ZodString;
    registeredAt: z.ZodString;
    checkedIn: z.ZodDefault<z.ZodBoolean>;
    checkedInAt: z.ZodNullable<z.ZodString>;
    seed: z.ZodNullable<z.ZodNumber>;
    eliminatedAt: z.ZodNullable<z.ZodString>;
    finalRank: z.ZodNullable<z.ZodNumber>;
    prizeWon: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    tournamentId: string;
    finalRank: number | null;
    registeredAt: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    seed: number | null;
    eliminatedAt: string | null;
    prizeWon: number;
}, {
    id: string;
    userId: string;
    tournamentId: string;
    finalRank: number | null;
    registeredAt: string;
    checkedInAt: string | null;
    seed: number | null;
    eliminatedAt: string | null;
    checkedIn?: boolean | undefined;
    prizeWon?: number | undefined;
}>;
export type TournamentRegistration = z.infer<typeof TournamentRegistrationSchema>;
export declare const WSEventTypeSchema: z.ZodEnum<["connect", "disconnect", "authenticate", "authenticated", "auth_failed", "join_queue", "leave_queue", "queue_update", "match_found", "match_ready", "create_room", "join_room", "leave_room", "room_update", "room_player_ready", "room_kick_player", "room_transfer_host", "room_invite", "room_start", "game_state", "roll_dice", "dice_rolled", "move_token", "move_result", "turn_change", "player_disconnected", "player_reconnected", "game_completed", "game_abandoned", "send_message", "new_message", "typing_start", "typing_stop", "message_read", "notification", "friend_request", "friend_accepted", "invite_received", "tournament_register", "tournament_check_in", "tournament_bracket_update", "tournament_match_ready", "error"]>;
export type WSEventType = z.infer<typeof WSEventTypeSchema>;
export declare const WSEventSchema: z.ZodObject<{
    type: z.ZodEnum<["connect", "disconnect", "authenticate", "authenticated", "auth_failed", "join_queue", "leave_queue", "queue_update", "match_found", "match_ready", "create_room", "join_room", "leave_room", "room_update", "room_player_ready", "room_kick_player", "room_transfer_host", "room_invite", "room_start", "game_state", "roll_dice", "dice_rolled", "move_token", "move_result", "turn_change", "player_disconnected", "player_reconnected", "game_completed", "game_abandoned", "send_message", "new_message", "typing_start", "typing_stop", "message_read", "notification", "friend_request", "friend_accepted", "invite_received", "tournament_register", "tournament_check_in", "tournament_bracket_update", "tournament_match_ready", "error"]>;
    payload: z.ZodUnknown;
    timestamp: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "connect" | "disconnect" | "authenticate" | "authenticated" | "auth_failed" | "join_queue" | "leave_queue" | "queue_update" | "match_found" | "match_ready" | "create_room" | "join_room" | "leave_room" | "room_update" | "room_player_ready" | "room_kick_player" | "room_transfer_host" | "room_invite" | "room_start" | "game_state" | "roll_dice" | "dice_rolled" | "move_token" | "move_result" | "turn_change" | "player_disconnected" | "player_reconnected" | "game_completed" | "game_abandoned" | "send_message" | "new_message" | "typing_start" | "typing_stop" | "message_read" | "notification" | "friend_request" | "friend_accepted" | "invite_received" | "tournament_register" | "tournament_check_in" | "tournament_bracket_update" | "tournament_match_ready" | "error";
    timestamp: string;
    payload?: unknown;
    requestId?: string | undefined;
}, {
    type: "connect" | "disconnect" | "authenticate" | "authenticated" | "auth_failed" | "join_queue" | "leave_queue" | "queue_update" | "match_found" | "match_ready" | "create_room" | "join_room" | "leave_room" | "room_update" | "room_player_ready" | "room_kick_player" | "room_transfer_host" | "room_invite" | "room_start" | "game_state" | "roll_dice" | "dice_rolled" | "move_token" | "move_result" | "turn_change" | "player_disconnected" | "player_reconnected" | "game_completed" | "game_abandoned" | "send_message" | "new_message" | "typing_start" | "typing_stop" | "message_read" | "notification" | "friend_request" | "friend_accepted" | "invite_received" | "tournament_register" | "tournament_check_in" | "tournament_bracket_update" | "tournament_match_ready" | "error";
    timestamp: string;
    payload?: unknown;
    requestId?: string | undefined;
}>;
export type WSEvent = z.infer<typeof WSEventSchema>;
export declare const ApiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }>>;
    meta: z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId: string;
    }, {
        timestamp: string;
        requestId: string;
    }>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }>>;
    meta: z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId: string;
    }, {
        timestamp: string;
        requestId: string;
    }>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }>>;
    meta: z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId: string;
    }, {
        timestamp: string;
        requestId: string;
    }>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodTypeAny>>>;
//# sourceMappingURL=types.d.ts.map