-- CreateEnum
CREATE TYPE "PlayerColor" AS ENUM ('red', 'green', 'yellow', 'blue');

-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('vs_ai', 'vs_human', 'group', 'private', 'team', 'tournament');

-- CreateEnum
CREATE TYPE "BotDifficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('waiting', 'starting', 'in_progress', 'completed', 'cancelled', 'abandoned');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('lobby', 'starting', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('draft', 'published', 'registration_open', 'registration_closed', 'check_in', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('pending', 'accepted', 'blocked');

-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('pending', 'accepted', 'declined', 'cancelled');

-- CreateEnum
CREATE TYPE "ChatConversationType" AS ENUM ('global', 'match', 'private', 'team', 'support');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'emoji', 'system', 'game_action', 'image');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'withdrawal', 'match', 'tournament', 'bonus', 'refund', 'transfer');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed');

-- CreateEnum
CREATE TYPE "BalanceType" AS ENUM ('available', 'bonus', 'locked', 'pending');

-- CreateEnum
CREATE TYPE "LedgerReferenceType" AS ENUM ('match_entry', 'match_win', 'match_loss', 'match_refund', 'deposit', 'withdrawal', 'bonus', 'promotion', 'referral', 'tournament_prize', 'platform_fee', 'adjustment');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('upi', 'card', 'netbanking', 'wallet', 'demo', 'internal');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('requested', 'under_review', 'approved', 'processing', 'completed', 'rejected', 'reversed', 'cancelled');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('not_started', 'draft', 'submitted', 'under_review', 'additional_info', 'verified', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "KYCDocumentType" AS ENUM ('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'admin', 'moderator', 'support');

-- CreateEnum
CREATE TYPE "FraudAlertType" AS ENUM ('multiple_accounts', 'suspicious_gameplay', 'wallet_manipulation', 'bot_usage', 'collusion', 'other');

-- CreateEnum
CREATE TYPE "FraudAlertSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "FraudAlertStatus" AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "country" CHAR(2) NOT NULL,
    "mobileNumber" VARCHAR(20) NOT NULL,
    "avatarUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycStatus" "KYCStatus" NOT NULL DEFAULT 'not_started',
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "referralCode" VARCHAR(20) NOT NULL,
    "referredById" VARCHAR(36),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "deviceId" VARCHAR(100),
    "deviceName" VARCHAR(100),
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "refreshToken" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36),
    "identifier" VARCHAR(255) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "deviceId" VARCHAR(100) NOT NULL,
    "deviceName" VARCHAR(100),
    "platform" VARCHAR(50),
    "fcmToken" TEXT,
    "apnsToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "displayName" VARCHAR(50),
    "bio" TEXT,
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "privacySettings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "status" "KYCStatus" NOT NULL DEFAULT 'not_started',
    "fullName" VARCHAR(100),
    "dateOfBirth" TIMESTAMP(3),
    "nationality" CHAR(2),
    "address" JSONB,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" VARCHAR(36),
    "rejectionReason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_documents" (
    "id" TEXT NOT NULL,
    "kycId" VARCHAR(36) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "documentType" "KYCDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" VARCHAR(36),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kyc_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "available" BIGINT NOT NULL DEFAULT 0,
    "bonus" BIGINT NOT NULL DEFAULT 0,
    "locked" BIGINT NOT NULL DEFAULT 0,
    "pending" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "walletId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "amount" BIGINT NOT NULL,
    "balanceType" "BalanceType" NOT NULL,
    "referenceType" "LedgerReferenceType" NOT NULL,
    "referenceId" VARCHAR(36),
    "description" VARCHAR(500) NOT NULL,
    "runningBalance" BIGINT NOT NULL,
    "idempotencyKey" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "walletId" VARCHAR(36) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "amount" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL DEFAULT 0,
    "netAmount" BIGINT NOT NULL,
    "balanceType" "BalanceType" NOT NULL,
    "paymentMethod" "PaymentMethod",
    "paymentProvider" VARCHAR(50),
    "paymentReference" VARCHAR(100),
    "description" VARCHAR(500) NOT NULL,
    "metadata" JSONB,
    "idempotencyKey" VARCHAR(100) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "amount" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL,
    "netAmount" BIGINT NOT NULL,
    "destinationMethod" VARCHAR(20) NOT NULL,
    "destinationDetails" JSONB NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'requested',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" VARCHAR(36),
    "processedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "mode" "GameMode" NOT NULL,
    "roomId" VARCHAR(36),
    "tournamentId" VARCHAR(36),
    "entryFee" BIGINT NOT NULL DEFAULT 0,
    "prizePool" BIGINT NOT NULL DEFAULT 0,
    "platformFee" BIGINT NOT NULL DEFAULT 0,
    "status" "MatchStatus" NOT NULL DEFAULT 'waiting',
    "winnerId" VARCHAR(36),
    "gameState" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players" (
    "id" TEXT NOT NULL,
    "matchId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "color" "PlayerColor" NOT NULL,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "botDifficulty" "BotDifficulty",
    "teamId" INTEGER,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "finalRank" INTEGER,
    "coinsWon" BIGINT NOT NULL DEFAULT 0,
    "coinsLost" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_events" (
    "id" TEXT NOT NULL,
    "matchId" VARCHAR(36) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "playerId" VARCHAR(36),
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "hostId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(50),
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "passwordHash" TEXT,
    "maxPlayers" INTEGER NOT NULL DEFAULT 4,
    "entryFee" BIGINT NOT NULL DEFAULT 0,
    "rules" JSONB NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'lobby',
    "matchId" VARCHAR(36),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_players" (
    "id" TEXT NOT NULL,
    "roomId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "color" "PlayerColor",
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "botDifficulty" "BotDifficulty",
    "teamId" INTEGER,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "room_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_invites" (
    "id" TEXT NOT NULL,
    "roomId" VARCHAR(36) NOT NULL,
    "invitedById" VARCHAR(36) NOT NULL,
    "invitedUserId" VARCHAR(36) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_spectators" (
    "id" TEXT NOT NULL,
    "roomId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_spectators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "mode" VARCHAR(20) NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "entryFee" BIGINT NOT NULL DEFAULT 0,
    "prizeBreakdown" JSONB NOT NULL,
    "rules" JSONB NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'draft',
    "registrationOpensAt" TIMESTAMP(3) NOT NULL,
    "registrationClosesAt" TIMESTAMP(3) NOT NULL,
    "checkInStartsAt" TIMESTAMP(3),
    "checkInEndsAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdById" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_registrations" (
    "id" TEXT NOT NULL,
    "tournamentId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "seed" INTEGER,
    "eliminatedAt" TIMESTAMP(3),
    "finalRank" INTEGER,
    "prizeWon" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "tournament_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "friendId" VARCHAR(36) NOT NULL,
    "status" "FriendStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "blockedAt" TIMESTAMP(3),
    "blockedById" VARCHAR(36),

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_requests" (
    "id" TEXT NOT NULL,
    "fromUserId" VARCHAR(36) NOT NULL,
    "toUserId" VARCHAR(36) NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'pending',
    "message" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_users" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "blockedId" VARCHAR(36) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_conversations" (
    "id" TEXT NOT NULL,
    "type" "ChatConversationType" NOT NULL,
    "name" VARCHAR(100),
    "matchId" VARCHAR(36),
    "teamId" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" TEXT NOT NULL,
    "conversationId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "conversationId" VARCHAR(36) NOT NULL,
    "senderId" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'text',
    "replyToId" VARCHAR(36),
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "requirement" JSONB NOT NULL,
    "reward" JSONB NOT NULL,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "achievementId" VARCHAR(36) NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "role" "AdminRole" NOT NULL,
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "adminId" VARCHAR(36),
    "userId" VARCHAR(36),
    "action" VARCHAR(100) NOT NULL,
    "resourceType" VARCHAR(50) NOT NULL,
    "resourceId" VARCHAR(100),
    "oldData" JSONB,
    "newData" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_alerts" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "type" "FraudAlertType" NOT NULL,
    "severity" "FraudAlertSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "status" "FraudAlertStatus" NOT NULL DEFAULT 'open',
    "assignedToId" VARCHAR(36),
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" VARCHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_settings" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" VARCHAR(36) NOT NULL,

    CONSTRAINT "game_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_referralCode_idx" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX "users_kycStatus_idx" ON "users"("kycStatus");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_refreshToken_idx" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "otps_identifier_type_idx" ON "otps"("identifier", "type");

-- CreateIndex
CREATE INDEX "otps_expiresAt_idx" ON "otps"("expiresAt");

-- CreateIndex
CREATE INDEX "user_devices_userId_idx" ON "user_devices"("userId");

-- CreateIndex
CREATE INDEX "user_devices_fcmToken_idx" ON "user_devices"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_devices_userId_deviceId_key" ON "user_devices"("userId", "deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_userId_key" ON "kyc"("userId");

-- CreateIndex
CREATE INDEX "kyc_status_idx" ON "kyc"("status");

-- CreateIndex
CREATE INDEX "kyc_userId_idx" ON "kyc"("userId");

-- CreateIndex
CREATE INDEX "kyc_documents_kycId_idx" ON "kyc_documents"("kycId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_idempotencyKey_key" ON "ledger_entries"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ledger_entries_walletId_idx" ON "ledger_entries"("walletId");

-- CreateIndex
CREATE INDEX "ledger_entries_userId_idx" ON "ledger_entries"("userId");

-- CreateIndex
CREATE INDEX "ledger_entries_referenceType_referenceId_idx" ON "ledger_entries"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "ledger_entries_idempotencyKey_idx" ON "ledger_entries"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ledger_entries_createdAt_idx" ON "ledger_entries"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotencyKey_key" ON "transactions"("idempotencyKey");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_walletId_idx" ON "transactions"("walletId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_idempotencyKey_idx" ON "transactions"("idempotencyKey");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "withdrawals_userId_idx" ON "withdrawals"("userId");

-- CreateIndex
CREATE INDEX "withdrawals_status_idx" ON "withdrawals"("status");

-- CreateIndex
CREATE INDEX "withdrawals_createdAt_idx" ON "withdrawals"("createdAt");

-- CreateIndex
CREATE INDEX "matches_mode_idx" ON "matches"("mode");

-- CreateIndex
CREATE INDEX "matches_roomId_idx" ON "matches"("roomId");

-- CreateIndex
CREATE INDEX "matches_tournamentId_idx" ON "matches"("tournamentId");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE INDEX "matches_winnerId_idx" ON "matches"("winnerId");

-- CreateIndex
CREATE INDEX "matches_createdAt_idx" ON "matches"("createdAt");

-- CreateIndex
CREATE INDEX "match_players_matchId_idx" ON "match_players"("matchId");

-- CreateIndex
CREATE INDEX "match_players_userId_idx" ON "match_players"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "match_players_matchId_userId_key" ON "match_players"("matchId", "userId");

-- CreateIndex
CREATE INDEX "match_events_matchId_idx" ON "match_events"("matchId");

-- CreateIndex
CREATE INDEX "match_events_createdAt_idx" ON "match_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "match_events_matchId_sequence_key" ON "match_events"("matchId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_code_key" ON "rooms"("code");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_matchId_key" ON "rooms"("matchId");

-- CreateIndex
CREATE INDEX "rooms_code_idx" ON "rooms"("code");

-- CreateIndex
CREATE INDEX "rooms_hostId_idx" ON "rooms"("hostId");

-- CreateIndex
CREATE INDEX "rooms_status_idx" ON "rooms"("status");

-- CreateIndex
CREATE INDEX "rooms_expiresAt_idx" ON "rooms"("expiresAt");

-- CreateIndex
CREATE INDEX "room_players_roomId_idx" ON "room_players"("roomId");

-- CreateIndex
CREATE INDEX "room_players_userId_idx" ON "room_players"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "room_players_roomId_userId_key" ON "room_players"("roomId", "userId");

-- CreateIndex
CREATE INDEX "room_invites_roomId_idx" ON "room_invites"("roomId");

-- CreateIndex
CREATE INDEX "room_invites_invitedUserId_idx" ON "room_invites"("invitedUserId");

-- CreateIndex
CREATE INDEX "room_invites_status_idx" ON "room_invites"("status");

-- CreateIndex
CREATE INDEX "room_spectators_roomId_idx" ON "room_spectators"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "room_spectators_roomId_userId_key" ON "room_spectators"("roomId", "userId");

-- CreateIndex
CREATE INDEX "tournaments_status_idx" ON "tournaments"("status");

-- CreateIndex
CREATE INDEX "tournaments_registrationOpensAt_idx" ON "tournaments"("registrationOpensAt");

-- CreateIndex
CREATE INDEX "tournaments_registrationClosesAt_idx" ON "tournaments"("registrationClosesAt");

-- CreateIndex
CREATE INDEX "tournaments_createdById_idx" ON "tournaments"("createdById");

-- CreateIndex
CREATE INDEX "tournament_registrations_tournamentId_idx" ON "tournament_registrations"("tournamentId");

-- CreateIndex
CREATE INDEX "tournament_registrations_userId_idx" ON "tournament_registrations"("userId");

-- CreateIndex
CREATE INDEX "tournament_registrations_seed_idx" ON "tournament_registrations"("seed");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_registrations_tournamentId_userId_key" ON "tournament_registrations"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "friends_userId_idx" ON "friends"("userId");

-- CreateIndex
CREATE INDEX "friends_friendId_idx" ON "friends"("friendId");

-- CreateIndex
CREATE INDEX "friends_status_idx" ON "friends"("status");

-- CreateIndex
CREATE UNIQUE INDEX "friends_userId_friendId_key" ON "friends"("userId", "friendId");

-- CreateIndex
CREATE INDEX "friend_requests_fromUserId_idx" ON "friend_requests"("fromUserId");

-- CreateIndex
CREATE INDEX "friend_requests_toUserId_idx" ON "friend_requests"("toUserId");

-- CreateIndex
CREATE INDEX "friend_requests_status_idx" ON "friend_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_fromUserId_toUserId_key" ON "friend_requests"("fromUserId", "toUserId");

-- CreateIndex
CREATE INDEX "blocked_users_userId_idx" ON "blocked_users"("userId");

-- CreateIndex
CREATE INDEX "blocked_users_blockedId_idx" ON "blocked_users"("blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_users_userId_blockedId_key" ON "blocked_users"("userId", "blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_conversations_matchId_key" ON "chat_conversations"("matchId");

-- CreateIndex
CREATE INDEX "chat_conversations_type_idx" ON "chat_conversations"("type");

-- CreateIndex
CREATE INDEX "chat_conversations_matchId_idx" ON "chat_conversations"("matchId");

-- CreateIndex
CREATE INDEX "chat_conversations_teamId_idx" ON "chat_conversations"("teamId");

-- CreateIndex
CREATE INDEX "chat_conversations_updatedAt_idx" ON "chat_conversations"("updatedAt");

-- CreateIndex
CREATE INDEX "chat_participants_conversationId_idx" ON "chat_participants"("conversationId");

-- CreateIndex
CREATE INDEX "chat_participants_userId_idx" ON "chat_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_conversationId_userId_key" ON "chat_participants"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "chat_messages_conversationId_idx" ON "chat_messages"("conversationId");

-- CreateIndex
CREATE INDEX "chat_messages_senderId_idx" ON "chat_messages"("senderId");

-- CreateIndex
CREATE INDEX "chat_messages_sentAt_idx" ON "chat_messages"("sentAt");

-- CreateIndex
CREATE INDEX "chat_messages_replyToId_idx" ON "chat_messages"("replyToId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_code_key" ON "achievements"("code");

-- CreateIndex
CREATE INDEX "user_achievements_userId_idx" ON "user_achievements"("userId");

-- CreateIndex
CREATE INDEX "user_achievements_achievementId_idx" ON "user_achievements"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE INDEX "audit_logs_adminId_idx" ON "audit_logs"("adminId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_resourceId_idx" ON "audit_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "fraud_alerts_userId_idx" ON "fraud_alerts"("userId");

-- CreateIndex
CREATE INDEX "fraud_alerts_type_idx" ON "fraud_alerts"("type");

-- CreateIndex
CREATE INDEX "fraud_alerts_status_idx" ON "fraud_alerts"("status");

-- CreateIndex
CREATE INDEX "fraud_alerts_severity_idx" ON "fraud_alerts"("severity");

-- CreateIndex
CREATE INDEX "fraud_alerts_createdAt_idx" ON "fraud_alerts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "game_settings_key_key" ON "game_settings"("key");

-- CreateIndex
CREATE INDEX "game_settings_category_idx" ON "game_settings"("category");

-- CreateIndex
CREATE INDEX "game_settings_isPublic_idx" ON "game_settings"("isPublic");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "kyc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_players" ADD CONSTRAINT "room_players_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_players" ADD CONSTRAINT "room_players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_invites" ADD CONSTRAINT "room_invites_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_invites" ADD CONSTRAINT "room_invites_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_invites" ADD CONSTRAINT "room_invites_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_spectators" ADD CONSTRAINT "room_spectators_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_spectators" ADD CONSTRAINT "room_spectators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_alerts" ADD CONSTRAINT "fraud_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_alerts" ADD CONSTRAINT "fraud_alerts_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_alerts" ADD CONSTRAINT "fraud_alerts_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_settings" ADD CONSTRAINT "game_settings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

┌─────────────────────────────────────────────────────────┐
│  Update available 5.22.0 -> 7.9.1                       │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
