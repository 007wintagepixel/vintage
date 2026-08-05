// ============================================
// Ludo Nexus - Main Entry Point
// ============================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'core/config/app_config.dart';
import 'core/theme/app_theme.dart';
import 'core/navigation/app_router.dart';
import 'core/constants/app_constants.dart';
import 'ui/core/navigation/navigation_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Initialize intl for date formatting
  await initializeDateFormatting('en_US', null);
  
  // Initialize app config
  await AppConfig.initialize();
  
  // Initialize Hive for local storage
  // await Hive.initFlutter();
  // await _initHiveBoxes();
  
  runApp(
    const ProviderScope(
      child: LudoNexusApp(),
    ),
  );
}

// Future<void> _initHiveBoxes() async {
//   // Register adapters
//   // Hive.registerAdapter(UserAdapter());
//   // Open boxes
//   // await Hive.openBox<AppSettings>('settings');
// }

class LudoNexusApp extends ConsumerWidget {
  const LudoNexusApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final theme = ref.watch(appThemeProvider);
    
    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: theme.lightTheme,
      darkTheme: theme.darkTheme,
      themeMode: ThemeMode.dark, // Default to dark for cyber-gaming aesthetic
      routerConfig: router,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('es', 'ES'),
        Locale('fr', 'FR'),
        Locale('de', 'DE'),
        Locale('hi', 'IN'),
      ],
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: TextScaler.linear(
              MediaQuery.of(context).textScaler.scale(1.0).clamp(0.8, 1.3),
            ),
          ),
          child: child!,
        );
      },
    );
  }
}