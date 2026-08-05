// ============================================
// App Router Configuration
// ============================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../ui/features/auth/screens/login_screen.dart';
import '../../ui/features/auth/screens/register_screen.dart';
import '../../ui/features/auth/screens/verify_otp_screen.dart';
import '../../ui/features/auth/screens/forgot_password_screen.dart';
import '../../ui/features/auth/screens/reset_password_screen.dart';
import '../../ui/features/home/screens/home_screen.dart';
import '../../ui/features/game/screens/game_mode_selection_screen.dart';
import '../../ui/features/game/screens/matchmaking_screen.dart';
import '../../ui/features/room/screens/room_list_screen.dart';
import '../../ui/features/room/screens/room_create_screen.dart';
import '../../ui/features/room/screens/room_lobby_screen.dart';
import '../../ui/features/game/screens/game_screen.dart';
import '../../ui/features/wallet/screens/wallet_screen.dart';
import '../../ui/features/wallet/screens/deposit_screen.dart';
import '../../ui/features/wallet/screens/withdraw_screen.dart';
import '../../ui/features/wallet/screens/transaction_history_screen.dart';
import '../../ui/features/friends/screens/friends_screen.dart';
import '../../ui/features/chat/screens/chat_list_screen.dart';
import '../../ui/features/chat/screens/chat_screen.dart';
import '../../ui/features/profile/screens/profile_screen.dart';
import '../../ui/features/profile/screens/edit_profile_screen.dart';
import '../../ui/features/profile/screens/achievements_screen.dart';
import '../../ui/features/tournament/screens/tournament_list_screen.dart';
import '../../ui/features/tournament/screens/tournament_detail_screen.dart';
import '../../ui/features/settings/screens/settings_screen.dart';
import '../../ui/features/leaderboard/screens/leaderboard_screen.dart';
import '../../ui/features/kyc/screens/kyc_screen.dart';
import '../../ui/features/support/screens/support_screen.dart';
import '../../ui/core/navigation/navigation_shell.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  
  return GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      final isPublicRoute = state.matchedLocation == '/';
      
      if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
        return '/auth/login';
      }
      
      if (isLoggedIn && isAuthRoute) {
        return '/home';
      }
      
      return null;
    },
    routes: [
      // Public Routes
      GoRoute(
        path: '/',
        name: 'landing',
        builder: (context, state) => const LandingScreen(),
      ),
      
      // Auth Routes
      GoRoute(
        path: '/auth/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/auth/verify-otp',
        name: 'verify-otp',
        builder: (context, state) => VerifyOtpScreen(
          identifier: state.uri.queryParameters['identifier'] ?? '',
          type: state.uri.queryParameters['type'] ?? 'register',
        ),
      ),
      GoRoute(
        path: '/auth/forgot-password',
        name: 'forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/auth/reset-password',
        name: 'reset-password',
        builder: (context, state) => ResetPasswordScreen(
          token: state.uri.queryParameters['token'] ?? '',
        ),
      ),
      
      // Protected Routes (Shell with Bottom Navigation)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return NavigationShell(navigationShell: navigationShell);
        },
        branches: [
          // Home Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                name: 'home',
                builder: (context, state) => const HomeScreen(),
                routes: [
                  GoRoute(
                    path: 'game-modes',
                    name: 'game-modes',
                    builder: (context, state) => const GameModeSelectionScreen(),
                  ),
                  GoRoute(
                    path: 'matchmaking',
                    name: 'matchmaking',
                    builder: (context, state) => const MatchmakingScreen(),
                  ),
                  GoRoute(
                    path: 'rooms',
                    name: 'rooms',
                    builder: (context, state) => const RoomListScreen(),
                  ),
                  GoRoute(
                    path: 'rooms/create',
                    name: 'create-room',
                    builder: (context, state) => const RoomCreateScreen(),
                  ),
                  GoRoute(
                    path: 'rooms/:roomCode',
                    name: 'room-lobby',
                    builder: (context, state) => RoomLobbyScreen(
                      roomCode: state.pathParameters['roomCode']!,
                    ),
                  ),
                  GoRoute(
                    path: 'game/:matchId',
                    name: 'game',
                    builder: (context, state) => GameScreen(
                      matchId: state.pathParameters['matchId']!,
                    ),
                  ),
                ],
              ),
            ],
          ),
          
          // Wallet Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/wallet',
                name: 'wallet',
                builder: (context, state) => const WalletScreen(),
                routes: [
                  GoRoute(
                    path: 'deposit',
                    name: 'deposit',
                    builder: (context, state) => const DepositScreen(),
                  ),
                  GoRoute(
                    path: 'withdraw',
                    name: 'withdraw',
                    builder: (context, state) => const WithdrawScreen(),
                  ),
                  GoRoute(
                    path: 'transactions',
                    name: 'transactions',
                    builder: (context, state) => const TransactionHistoryScreen(),
                  ),
                ],
              ),
            ],
          ),
          
          // Friends/Chat Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/friends',
                name: 'friends',
                builder: (context, state) => const FriendsScreen(),
              ),
              GoRoute(
                path: '/chat',
                name: 'chat-list',
                builder: (context, state) => const ChatListScreen(),
                routes: [
                  GoRoute(
                    path: ':conversationId',
                    name: 'chat',
                    builder: (context, state) => ChatScreen(
                      conversationId: state.pathParameters['conversationId']!,
                    ),
                  ),
                ],
              ),
            ],
          ),
          
          // Profile Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                name: 'profile',
                builder: (context, state) => const ProfileScreen(),
                routes: [
                  GoRoute(
                    path: 'edit',
                    name: 'edit-profile',
                    builder: (context, state) => const EditProfileScreen(),
                  ),
                  GoRoute(
                    path: 'achievements',
                    name: 'achievements',
                    builder: (context, state) => const AchievementsScreen(),
                  ),
                  GoRoute(
                    path: 'settings',
                    name: 'settings',
                    builder: (context, state) => const SettingsScreen(),
                  ),
                  GoRoute(
                    path: 'leaderboard',
                    name: 'leaderboard',
                    builder: (context, state) => const LeaderboardScreen(),
                  ),
                  GoRoute(
                    path: 'kyc',
                    name: 'kyc',
                    builder: (context, state) => const KycScreen(),
                  ),
                  GoRoute(
                    path: 'support',
                    name: 'support',
                    builder: (context, state) => const SupportScreen(),
                  ),
                ],
              ),
            ],
          ),
          
          // Tournament Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/tournaments',
                name: 'tournaments',
                builder: (context, state) => const TournamentListScreen(),
                routes: [
                  GoRoute(
                    path: ':tournamentId',
                    name: 'tournament-detail',
                    builder: (context, state) => TournamentDetailScreen(
                      tournamentId: state.pathParameters['tournamentId']!,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => _ErrorScreen(error: state.error),
  );
});

// Auth state provider (simplified)
final authStateProvider = StateProvider<AuthState>((ref) => AuthState());

class AuthState {
  final bool isAuthenticated;
  final String? userId;
  final String? username;
  
  AuthState({this.isAuthenticated = false, this.userId, this.username});
}

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.casino, size: 100, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 24),
            Text(
              'Ludo Nexus',
              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Premium Multiplayer Ludo',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 48),
            FilledButton.icon(
              onPressed: () => context.go('/auth/login'),
              icon: const Icon(Icons.login),
              label: const Text('Sign In'),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () => context.go('/auth/register'),
              icon: const Icon(Icons.person_add),
              label: const Text('Create Account'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorScreen extends StatelessWidget {
  final Exception? error;
  
  const _ErrorScreen({this.error});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: Theme.of(context).colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                'Something went wrong',
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                error?.toString() ?? 'Unknown error',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: () => context.go('/home'),
                child: const Text('Go Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}