import { z } from 'zod';
export declare const RoomInviteSchema: z.ZodObject<{
    id: z.ZodString;
    roomId: z.ZodString;
    invitedBy: z.ZodString;
    invitedUserId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "declined", "expired"]>;
    expiresAt: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "expired" | "pending" | "accepted" | "declined";
    id: string;
    roomId: string;
    createdAt: string;
    expiresAt: string;
    invitedBy: string;
    invitedUserId: string;
}, {
    status: "expired" | "pending" | "accepted" | "declined";
    id: string;
    roomId: string;
    createdAt: string;
    expiresAt: string;
    invitedBy: string;
    invitedUserId: string;
}>;
export type RoomInvite = z.infer<typeof RoomInviteSchema>;
export declare const CreateRoomSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    password: z.ZodOptional<z.ZodString>;
    maxPlayers: z.ZodDefault<z.ZodNumber>;
    entryFee: z.ZodDefault<z.ZodNumber>;
    rules: z.ZodOptional<z.ZodObject<{
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
    }>>;
    botFill: z.ZodDefault<z.ZodBoolean>;
    allowSpectators: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    entryFee: number;
    isPublic: boolean;
    maxPlayers: number;
    botFill: boolean;
    allowSpectators: boolean;
    rules?: {
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
    } | undefined;
    name?: string | undefined;
    password?: string | undefined;
}, {
    rules?: {
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
    } | undefined;
    entryFee?: number | undefined;
    name?: string | undefined;
    isPublic?: boolean | undefined;
    maxPlayers?: number | undefined;
    password?: string | undefined;
    botFill?: boolean | undefined;
    allowSpectators?: boolean | undefined;
}>;
export type CreateRoom = z.infer<typeof CreateRoomSchema>;
export declare const JoinRoomSchema: z.ZodObject<{
    roomCode: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    roomCode: string;
    password?: string | undefined;
}, {
    roomCode: string;
    password?: string | undefined;
}>;
export type JoinRoom = z.infer<typeof JoinRoomSchema>;
export declare const RoomActionSchema: z.ZodObject<{
    roomId: z.ZodString;
    action: z.ZodEnum<["ready", "unready", "kick", "transfer_host", "invite", "start"]>;
    targetUserId: z.ZodOptional<z.ZodString>;
    inviteUserId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    roomId: string;
    action: "ready" | "unready" | "kick" | "transfer_host" | "invite" | "start";
    targetUserId?: string | undefined;
    inviteUserId?: string | undefined;
}, {
    roomId: string;
    action: "ready" | "unready" | "kick" | "transfer_host" | "invite" | "start";
    targetUserId?: string | undefined;
    inviteUserId?: string | undefined;
}>;
export type RoomAction = z.infer<typeof RoomActionSchema>;
export declare const CreateTournamentSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
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
    registrationOpensAt: z.ZodString;
    registrationClosesAt: z.ZodString;
    checkInStartsAt: z.ZodOptional<z.ZodString>;
    checkInEndsAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
    description?: string | undefined;
    checkInStartsAt?: string | undefined;
    checkInEndsAt?: string | undefined;
}, {
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
    name: string;
    maxParticipants: number;
    prizeBreakdown: {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }[];
    registrationOpensAt: string;
    registrationClosesAt: string;
    entryFee?: number | undefined;
    description?: string | undefined;
    checkInStartsAt?: string | undefined;
    checkInEndsAt?: string | undefined;
}>, {
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
    description?: string | undefined;
    checkInStartsAt?: string | undefined;
    checkInEndsAt?: string | undefined;
}, {
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
    name: string;
    maxParticipants: number;
    prizeBreakdown: {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }[];
    registrationOpensAt: string;
    registrationClosesAt: string;
    entryFee?: number | undefined;
    description?: string | undefined;
    checkInStartsAt?: string | undefined;
    checkInEndsAt?: string | undefined;
}>, {
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
    description?: string | undefined;
    checkInStartsAt?: string | undefined;
    checkInEndsAt?: string | undefined;
}, {
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
    name: string;
    maxParticipants: number;
    prizeBreakdown: {
        rank: number;
        percentage: number;
        fixedAmount?: number | undefined;
    }[];
    registrationOpensAt: string;
    registrationClosesAt: string;
    entryFee?: number | undefined;
    description?: string | undefined;
    checkInStartsAt?: string | undefined;
    checkInEndsAt?: string | undefined;
}>;
export type CreateTournament = z.infer<typeof CreateTournamentSchema>;
export declare const TournamentActionSchema: z.ZodObject<{
    tournamentId: z.ZodString;
    action: z.ZodEnum<["register", "unregister", "check_in", "cancel", "publish"]>;
}, "strip", z.ZodTypeAny, {
    tournamentId: string;
    action: "check_in" | "register" | "unregister" | "cancel" | "publish";
}, {
    tournamentId: string;
    action: "check_in" | "register" | "unregister" | "cancel" | "publish";
}>;
export type TournamentAction = z.infer<typeof TournamentActionSchema>;
export declare const TournamentBracketSchema: z.ZodObject<{
    tournamentId: z.ZodString;
    rounds: z.ZodArray<z.ZodObject<{
        roundNumber: z.ZodNumber;
        matches: z.ZodArray<z.ZodObject<{
            matchId: z.ZodNullable<z.ZodString>;
            player1: z.ZodNullable<z.ZodObject<{
                registrationId: z.ZodString;
                userId: z.ZodString;
                username: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                userId: string;
                username: string;
                registrationId: string;
            }, {
                userId: string;
                username: string;
                registrationId: string;
            }>>;
            player2: z.ZodNullable<z.ZodObject<{
                registrationId: z.ZodString;
                userId: z.ZodString;
                username: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                userId: string;
                username: string;
                registrationId: string;
            }, {
                userId: string;
                username: string;
                registrationId: string;
            }>>;
            winnerRegistrationId: z.ZodNullable<z.ZodString>;
            status: z.ZodEnum<["pending", "ready", "in_progress", "completed", "walkover"]>;
            scheduledAt: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
            matchId: string | null;
            player1: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            player2: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            winnerRegistrationId: string | null;
            scheduledAt: string | null;
        }, {
            status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
            matchId: string | null;
            player1: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            player2: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            winnerRegistrationId: string | null;
            scheduledAt: string | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        roundNumber: number;
        matches: {
            status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
            matchId: string | null;
            player1: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            player2: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            winnerRegistrationId: string | null;
            scheduledAt: string | null;
        }[];
    }, {
        roundNumber: number;
        matches: {
            status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
            matchId: string | null;
            player1: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            player2: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            winnerRegistrationId: string | null;
            scheduledAt: string | null;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tournamentId: string;
    rounds: {
        roundNumber: number;
        matches: {
            status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
            matchId: string | null;
            player1: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            player2: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            winnerRegistrationId: string | null;
            scheduledAt: string | null;
        }[];
    }[];
}, {
    tournamentId: string;
    rounds: {
        roundNumber: number;
        matches: {
            status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
            matchId: string | null;
            player1: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            player2: {
                userId: string;
                username: string;
                registrationId: string;
            } | null;
            winnerRegistrationId: string | null;
            scheduledAt: string | null;
        }[];
    }[];
}>;
export type TournamentBracket = z.infer<typeof TournamentBracketSchema>;
export declare const RoomSchemas: {
    RoomInvite: z.ZodObject<{
        id: z.ZodString;
        roomId: z.ZodString;
        invitedBy: z.ZodString;
        invitedUserId: z.ZodString;
        status: z.ZodEnum<["pending", "accepted", "declined", "expired"]>;
        expiresAt: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "expired" | "pending" | "accepted" | "declined";
        id: string;
        roomId: string;
        createdAt: string;
        expiresAt: string;
        invitedBy: string;
        invitedUserId: string;
    }, {
        status: "expired" | "pending" | "accepted" | "declined";
        id: string;
        roomId: string;
        createdAt: string;
        expiresAt: string;
        invitedBy: string;
        invitedUserId: string;
    }>;
    CreateRoom: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        isPublic: z.ZodDefault<z.ZodBoolean>;
        password: z.ZodOptional<z.ZodString>;
        maxPlayers: z.ZodDefault<z.ZodNumber>;
        entryFee: z.ZodDefault<z.ZodNumber>;
        rules: z.ZodOptional<z.ZodObject<{
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
        }>>;
        botFill: z.ZodDefault<z.ZodBoolean>;
        allowSpectators: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        entryFee: number;
        isPublic: boolean;
        maxPlayers: number;
        botFill: boolean;
        allowSpectators: boolean;
        rules?: {
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
        } | undefined;
        name?: string | undefined;
        password?: string | undefined;
    }, {
        rules?: {
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
        } | undefined;
        entryFee?: number | undefined;
        name?: string | undefined;
        isPublic?: boolean | undefined;
        maxPlayers?: number | undefined;
        password?: string | undefined;
        botFill?: boolean | undefined;
        allowSpectators?: boolean | undefined;
    }>;
    JoinRoom: z.ZodObject<{
        roomCode: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        roomCode: string;
        password?: string | undefined;
    }, {
        roomCode: string;
        password?: string | undefined;
    }>;
    RoomAction: z.ZodObject<{
        roomId: z.ZodString;
        action: z.ZodEnum<["ready", "unready", "kick", "transfer_host", "invite", "start"]>;
        targetUserId: z.ZodOptional<z.ZodString>;
        inviteUserId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        roomId: string;
        action: "ready" | "unready" | "kick" | "transfer_host" | "invite" | "start";
        targetUserId?: string | undefined;
        inviteUserId?: string | undefined;
    }, {
        roomId: string;
        action: "ready" | "unready" | "kick" | "transfer_host" | "invite" | "start";
        targetUserId?: string | undefined;
        inviteUserId?: string | undefined;
    }>;
};
export declare const TournamentSchemas: {
    CreateTournament: z.ZodEffects<z.ZodEffects<z.ZodObject<{
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
        registrationOpensAt: z.ZodString;
        registrationClosesAt: z.ZodString;
        checkInStartsAt: z.ZodOptional<z.ZodString>;
        checkInEndsAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
        description?: string | undefined;
        checkInStartsAt?: string | undefined;
        checkInEndsAt?: string | undefined;
    }, {
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
        name: string;
        maxParticipants: number;
        prizeBreakdown: {
            rank: number;
            percentage: number;
            fixedAmount?: number | undefined;
        }[];
        registrationOpensAt: string;
        registrationClosesAt: string;
        entryFee?: number | undefined;
        description?: string | undefined;
        checkInStartsAt?: string | undefined;
        checkInEndsAt?: string | undefined;
    }>, {
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
        description?: string | undefined;
        checkInStartsAt?: string | undefined;
        checkInEndsAt?: string | undefined;
    }, {
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
        name: string;
        maxParticipants: number;
        prizeBreakdown: {
            rank: number;
            percentage: number;
            fixedAmount?: number | undefined;
        }[];
        registrationOpensAt: string;
        registrationClosesAt: string;
        entryFee?: number | undefined;
        description?: string | undefined;
        checkInStartsAt?: string | undefined;
        checkInEndsAt?: string | undefined;
    }>, {
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
        description?: string | undefined;
        checkInStartsAt?: string | undefined;
        checkInEndsAt?: string | undefined;
    }, {
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
        name: string;
        maxParticipants: number;
        prizeBreakdown: {
            rank: number;
            percentage: number;
            fixedAmount?: number | undefined;
        }[];
        registrationOpensAt: string;
        registrationClosesAt: string;
        entryFee?: number | undefined;
        description?: string | undefined;
        checkInStartsAt?: string | undefined;
        checkInEndsAt?: string | undefined;
    }>;
    TournamentAction: z.ZodObject<{
        tournamentId: z.ZodString;
        action: z.ZodEnum<["register", "unregister", "check_in", "cancel", "publish"]>;
    }, "strip", z.ZodTypeAny, {
        tournamentId: string;
        action: "check_in" | "register" | "unregister" | "cancel" | "publish";
    }, {
        tournamentId: string;
        action: "check_in" | "register" | "unregister" | "cancel" | "publish";
    }>;
    TournamentBracket: z.ZodObject<{
        tournamentId: z.ZodString;
        rounds: z.ZodArray<z.ZodObject<{
            roundNumber: z.ZodNumber;
            matches: z.ZodArray<z.ZodObject<{
                matchId: z.ZodNullable<z.ZodString>;
                player1: z.ZodNullable<z.ZodObject<{
                    registrationId: z.ZodString;
                    userId: z.ZodString;
                    username: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    username: string;
                    registrationId: string;
                }, {
                    userId: string;
                    username: string;
                    registrationId: string;
                }>>;
                player2: z.ZodNullable<z.ZodObject<{
                    registrationId: z.ZodString;
                    userId: z.ZodString;
                    username: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    username: string;
                    registrationId: string;
                }, {
                    userId: string;
                    username: string;
                    registrationId: string;
                }>>;
                winnerRegistrationId: z.ZodNullable<z.ZodString>;
                status: z.ZodEnum<["pending", "ready", "in_progress", "completed", "walkover"]>;
                scheduledAt: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
                matchId: string | null;
                player1: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                player2: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                winnerRegistrationId: string | null;
                scheduledAt: string | null;
            }, {
                status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
                matchId: string | null;
                player1: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                player2: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                winnerRegistrationId: string | null;
                scheduledAt: string | null;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            roundNumber: number;
            matches: {
                status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
                matchId: string | null;
                player1: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                player2: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                winnerRegistrationId: string | null;
                scheduledAt: string | null;
            }[];
        }, {
            roundNumber: number;
            matches: {
                status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
                matchId: string | null;
                player1: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                player2: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                winnerRegistrationId: string | null;
                scheduledAt: string | null;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        tournamentId: string;
        rounds: {
            roundNumber: number;
            matches: {
                status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
                matchId: string | null;
                player1: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                player2: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                winnerRegistrationId: string | null;
                scheduledAt: string | null;
            }[];
        }[];
    }, {
        tournamentId: string;
        rounds: {
            roundNumber: number;
            matches: {
                status: "in_progress" | "completed" | "pending" | "ready" | "walkover";
                matchId: string | null;
                player1: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                player2: {
                    userId: string;
                    username: string;
                    registrationId: string;
                } | null;
                winnerRegistrationId: string | null;
                scheduledAt: string | null;
            }[];
        }[];
    }>;
};
//# sourceMappingURL=types.d.ts.map