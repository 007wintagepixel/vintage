// ============================================
// App Configuration
// ============================================

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  static late SharedPreferences _prefs;
  static bool _initialized = false;
  
  // API Configuration
  static String get apiBaseUrl => _prefs.getString('api_base_url') ?? 
    (kReleaseMode ? 'https://api.ludonexus.com' : 'http://localhost:3001');
  
  static String get websocketUrl => _prefs.getString('websocket_url') ?? 
    (kReleaseMode ? 'wss://api.ludonexus.com' : 'ws://localhost:3001');
  
  static String get cdnUrl => _prefs.getString('cdn_url') ?? 
    (kReleaseMode ? 'https://cdn.ludonexus.com' : 'http://localhost:3000');
  
  // Feature Flags
  static bool get enableRealMoney => _prefs.getBool('enable_real_money') ?? false;
  static bool get enableAnalytics => _prefs.getBool('enable_analytics') ?? true;
  static bool get enableCrashlytics => _prefs.getBool('enable_crashlytics') ?? true;
  static bool get enableNotifications => _prefs.getBool('enable_notifications') ?? true;
  
  // Game Configuration
  static int get defaultTurnTimeSeconds => 30;
  static int get reconnectionGraceSeconds => 30;
  static int get maxReconnectionAttempts => 3;
  
  // Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyUserId = 'user_id';
  static const String keyUsername = 'username';
  static const String keyDeviceId = 'device_id';
  static const String keyFcmToken = 'fcm_token';
  static const String keyLanguage = 'language';
  static const String keyThemeMode = 'theme_mode';
  static const String keySoundEnabled = 'sound_enabled';
  static const String keyMusicEnabled = 'music_enabled';
  static const String keyVibrationEnabled = 'vibration_enabled';
  static const String keyReducedMotion = 'reduced_motion';
  
  static Future<void> initialize() async {
    if (_initialized) return;
    _prefs = await SharedPreferences.getInstance();
    _initialized = true;
  }
  
  // Token Management
  static Future<void> saveAuthTokens(String accessToken, String refreshToken) async {
    await _prefs.setString(keyAuthToken, accessToken);
    await _prefs.setString(keyRefreshToken, refreshToken);
  }
  
  static String? getAuthToken() => _prefs.getString(keyAuthToken);
  static String? getRefreshToken() => _prefs.getString(keyRefreshToken);
  
  static Future<void> clearAuthTokens() async {
    await _prefs.remove(keyAuthToken);
    await _prefs.remove(keyRefreshToken);
    await _prefs.remove(keyUserId);
    await _prefs.remove(keyUsername);
  }
  
  // User Data
  static Future<void> saveUserData(String userId, String username) async {
    await _prefs.setString(keyUserId, userId);
    await _prefs.setString(keyUsername, username);
  }
  
  static String? getUserId() => _prefs.getString(keyUserId);
  static String? getUsername() => _prefs.getString(keyUsername);
  
  // Device ID
  static Future<void> saveDeviceId(String deviceId) async {
    await _prefs.setString(keyDeviceId, deviceId);
  }
  
  static String? getDeviceId() => _prefs.getString(keyDeviceId);
  
  // FCM Token
  static Future<void> saveFcmToken(String token) async {
    await _prefs.setString(keyFcmToken, token);
  }
  
  static String? getFcmToken() => _prefs.getString(keyFcmToken);
  
  // Settings
  static Future<void> setLanguage(String languageCode) async {
    await _prefs.setString(keyLanguage, languageCode);
  }
  
  static String getLanguage() => _prefs.getString(keyLanguage) ?? 'en';
  
  static Future<void> setThemeMode(ThemeMode mode) async {
    await _prefs.setString(keyThemeMode, mode.name);
  }
  
  static ThemeMode getThemeMode() {
    final mode = _prefs.getString(keyThemeMode);
    switch (mode) {
      case 'light': return ThemeMode.light;
      case 'dark': return ThemeMode.dark;
      default: return ThemeMode.system;
    }
  }
  
  static Future<void> setSoundEnabled(bool enabled) async {
    await _prefs.setBool(keySoundEnabled, enabled);
  }
  
  static bool getSoundEnabled() => _prefs.getBool(keySoundEnabled) ?? true;
  
  static Future<void> setMusicEnabled(bool enabled) async {
    await _prefs.setBool(keyMusicEnabled, enabled);
  }
  
  static bool getMusicEnabled() => _prefs.getBool(keyMusicEnabled) ?? true;
  
  static Future<void> setVibrationEnabled(bool enabled) async {
    await _prefs.setBool(keyVibrationEnabled, enabled);
  }
  
  static bool getVibrationEnabled() => _prefs.getBool(keyVibrationEnabled) ?? true;
  
  static Future<void> setReducedMotion(bool enabled) async {
    await _prefs.setBool(keyReducedMotion, enabled);
  }
  
  static bool getReducedMotion() => _prefs.getBool(keyReducedMotion) ?? false;
  
  // API URL Management (for development)
  static Future<void> setApiBaseUrl(String url) async {
    await _prefs.setString('api_base_url', url);
  }
  
  static Future<void> setWebsocketUrl(String url) async {
    await _prefs.setString('websocket_url', url);
  }
  
  static Future<void> setCdnUrl(String url) async {
    await _prefs.setString('cdn_url', url);
  }
  
  // Reset to defaults
  static Future<void> resetToDefaults() async {
    await _prefs.clear();
    _initialized = false;
    await initialize();
  }
}