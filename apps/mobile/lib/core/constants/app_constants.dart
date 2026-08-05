// ============================================
// App Constants
// ============================================

class AppConstants {
  static const String appName = 'Ludo Nexus';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  static const String bundleId = 'com.ludonexus.app';
  
  // API
  static const String apiVersion = 'v1';
  static const int apiTimeoutSeconds = 30;
  static const int websocketTimeoutSeconds = 10;
  static const int websocketReconnectIntervalSeconds = 5;
  
  // Game Constants
  static const int boardSize = 52;
  static const int homeLaneLength = 4;
  static const int tokensPerPlayer = 4;
  static const int playersCount = 4;
  static const int entryRoll = 6;
  static const int defaultTurnTimeSeconds = 30;
  static const int reconnectionGraceSeconds = 30;
  static const int inactivityLimit = 3;
  
  // Player Colors
  static const List<String> playerColors = ['red', 'green', 'yellow', 'blue'];
  static const Map<String, int> playerColorValues = {
    'red': 0xFFEF4444,
    'green': 0xFF22C55E,
    'yellow': 0xFFEAB308,
    'blue': 0xFF3B82F6,
  };
  static const Map<String, int> playerColorGlowValues = {
    'red': 0xFFF87171,
    'green': 0xFF4ADE80,
    'yellow': 0xFFFDE047,
    'blue': 0xFF60A5FA,
  };
  
  // Safe Cells (board positions 0-51)
  static const List<int> safeCells = [0, 8, 13, 21, 26, 34, 39, 47];
  
  // Start Positions
  static const Map<String, int> startPositions = {
    'red': 0,
    'green': 13,
    'yellow': 26,
    'blue': 39,
  };
  
  // Home Lane Entry Positions
  static const Map<String, int> homeLaneEntry = {
    'red': 51,
    'green': 12,
    'yellow': 25,
    'blue': 38,
  };
  
  // Animation Durations
  static const Duration diceRollDuration = Duration(milliseconds: 800);
  static const Duration tokenMoveDuration = Duration(milliseconds: 500);
  static const Duration captureAnimationDuration = Duration(milliseconds: 600);
  static const Duration winAnimationDuration = Duration(milliseconds: 1500);
  static const Duration pageTransitionDuration = Duration(milliseconds: 300);
  static const Duration snackbarDuration = Duration(seconds: 3);
  
  // UI Constants
  static const double minTouchTarget = 48.0;
  static const double cardBorderRadius = 20.0;
  static const double panelBorderRadius = 28.0;
  static const double buttonBorderRadius = 16.0;
  static const double inputBorderRadius = 16.0;
  
  // Spacing
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacing2xl = 40.0;
  
  // Breakpoints
  static const double breakpointMobile = 600.0;
  static const double breakpointTablet = 900.0;
  static const double breakpointDesktop = 1200.0;
  
  // Wallet
  static const int minDepositAmount = 10;
  static const int maxDepositAmount = 100000;
  static const int minWithdrawalAmount = 100;
  static const int platformFeePercent = 10;
  
  // Demo Mode
  static const bool isDemoMode = true;
  static const String demoCurrencyLabel = 'Demo Coins';
  static const int startingDemoCoins = 10000;
  
  // KYC
  static const List<String> kycDocumentTypes = [
    'passport',
    'drivers_license',
    'national_id',
    'utility_bill',
    'bank_statement',
  ];
  
  // Chat
  static const int maxMessageLength = 2000;
  static const int chatHistoryLimit = 50;
  
  // Friends
  static const int maxFriends = 500;
  static const int maxFriendRequests = 50;
  
  // Notifications
  static const String notificationChannelId = 'ludo_nexus_notifications';
  static const String notificationChannelName = 'Ludo Nexus';
  static const String notificationChannelDescription = 'Game notifications and updates';
  
  // Deep Links
  static const String deepLinkScheme = 'ludonexus';
  static const String deepLinkHost = 'app.ludonexus.com';
  
  // Analytics Events
  static const String eventGameStart = 'game_start';
  static const String eventGameComplete = 'game_complete';
  static const String eventMatchmakingJoin = 'matchmaking_join';
  static const String eventMatchmakingCancel = 'matchmaking_cancel';
  static const String eventRoomCreate = 'room_create';
  static const String eventRoomJoin = 'room_join';
  static const String eventDeposit = 'deposit';
  static const String eventWithdrawal = 'withdrawal';
  static const String eventAchievementUnlock = 'achievement_unlock';
  static const String eventFriendAdd = 'friend_add';
  static const String eventChatMessage = 'chat_message';
  static const String eventTournamentRegister = 'tournament_register';
  
  // Error Codes
  static const String errorNetwork = 'NETWORK_ERROR';
  static const String errorTimeout = 'TIMEOUT';
  static const String errorUnauthorized = 'UNAUTHORIZED';
  static const String errorForbidden = 'FORBIDDEN';
  static const String errorNotFound = 'NOT_FOUND';
  static const String errorValidation = 'VALIDATION_ERROR';
  static const String errorServer = 'SERVER_ERROR';
  static const String errorMaintenance = 'MAINTENANCE';
  static const String errorVersionMismatch = 'VERSION_MISMATCH';
}