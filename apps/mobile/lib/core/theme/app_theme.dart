// ============================================
// App Theme - Cyber Gaming Aesthetic
// ============================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../constants/app_constants.dart';

final appThemeProvider = Provider<AppTheme>((ref) => AppTheme());

class AppTheme {
  // Color Palette - Cyber Gaming Theme
  static const Color backgroundPrimary = Color(0xFF0C0A09);      // Deep premium
  static const Color backgroundSecondary = Color(0xFF111827);    // Dark navy
  static const Color backgroundTertiary = Color(0xFF1F2937);     // Elevated
  static const Color backgroundCard = Color(0xFF1E293B);         // Card background
  
  static const Color primaryDefault = Color(0xFF0EA5E9);         // Trust blue
  static const Color primaryGlow = Color(0xFF22D3EE);            // Cyan glow
  static const Color primaryDark = Color(0xFF0284C7);
  
  static const Color secondaryDefault = Color(0xFFA16207);       // Warm gold
  static const Color secondaryGlow = Color(0xFFFBBF24);          // Gold glow
  static const Color secondaryDark = Color(0xFF854D0E);
  
  static const Color accentCyan = Color(0xFF06B6D4);
  static const Color accentMagenta = Color(0xFFD946EF);
  static const Color accentViolet = Color(0xFF8B5CF6);
  static const Color accentGreen = Color(0xFF16A34A);
  static const Color accentOrange = Color(0xFFEA580C);
  static const Color accentRed = Color(0xFFEF4444);
  
  static const Color surfaceGlass = Color(0xB3111827);           // rgba(17,24,39,0.7)
  static const Color surfaceGlassStrong = Color(0xD9111827);     // rgba(17,24,39,0.85)
  static const Color surfaceBorder = Color(0x3394A3B8);          // rgba(148,163,184,0.2)
  static const Color surfaceBorderGlow = Color(0x4D22D3EE);      // rgba(34,211,238,0.3)
  
  static const Color textPrimary = Color(0xFFF9FAFB);
  static const Color textSecondary = Color(0xFFD1D5DB);
  static const Color textMuted = Color(0xFF9CA3AF);
  static const Color textInverse = Color(0xFF0C0A09);
  
  // Player Colors
  static const Color playerRed = Color(0xFFEF4444);
  static const Color playerRedGlow = Color(0xFFF87171);
  static const Color playerGreen = Color(0xFF22C55E);
  static const Color playerGreenGlow = Color(0xFF4ADE80);
  static const Color playerYellow = Color(0xFFEAB308);
  static const Color playerYellowGlow = Color(0xFFFDE047);
  static const Color playerBlue = Color(0xFF3B82F6);
  static const Color playerBlueGlow = Color(0xFF60A5FA);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryDefault, accentCyan],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [secondaryDefault, Color(0xFFF59E0B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient accentGradient = LinearGradient(
    colors: [primaryGlow, accentMagenta, secondaryGlow],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient backgroundMesh = LinearGradient(
    colors: [backgroundPrimary, backgroundSecondary, backgroundPrimary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    stops: [0.0, 0.5, 1.0],
  );
  
  // Shadows
  static const BoxShadow glowShadow = BoxShadow(
    color: Color(0x4D22D3EE),
    blurRadius: 20,
    spreadRadius: 0,
  );
  
  static const BoxShadow glowStrongShadow = BoxShadow(
    color: Color(0x7F22D3EE),
    blurRadius: 40,
    spreadRadius: 0,
  );
  
  static const BoxShadow glowGoldShadow = BoxShadow(
    color: Color(0x66FBBF24),
    blurRadius: 20,
    spreadRadius: 0,
  );
  
  static const BoxShadow glassShadow = BoxShadow(
    color: Color(0x66000000),
    blurRadius: 32,
    offset: Offset(0, 8),
  );
  
  static const BoxShadow glassStrongShadow = BoxShadow(
    color: Color(0x80000000),
    blurRadius: 48,
    offset: Offset(0, 16),
  );
  
  // Light Theme (for completeness)
  ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: _lightColorScheme,
    textTheme: _textTheme(brightness: Brightness.light),
    scaffoldBackgroundColor: Colors.white,
    cardColor: Colors.white,
    dividerColor: Colors.grey[300],
    appBarTheme: _appBarTheme(Brightness.light),
    bottomNavigationBarTheme: _bottomNavTheme(Brightness.light),
    navigationBarTheme: _navigationBarTheme(Brightness.light),
    elevatedButtonTheme: _elevatedButtonTheme(Brightness.light),
    outlinedButtonTheme: _outlinedButtonTheme(Brightness.light),
    textButtonTheme: _textButtonTheme(Brightness.light),
    inputDecorationTheme: _inputDecorationTheme(Brightness.light),
    cardTheme: _cardTheme(Brightness.light),
    dialogTheme: _dialogTheme(Brightness.light),
    bottomSheetTheme: _bottomSheetTheme(Brightness.light),
    snackBarTheme: _snackBarTheme(Brightness.light),
    chipTheme: _chipTheme(Brightness.light),
    tabBarTheme: _tabBarTheme(Brightness.light),
    dividerTheme: _dividerTheme(Brightness.light),
    listTileTheme: _listTileTheme(Brightness.light),
    floatingActionButtonTheme: _fabTheme(Brightness.light),
    progressIndicatorTheme: _progressIndicatorTheme(),
    sliderTheme: _sliderTheme(Brightness.light),
    switchTheme: _switchTheme(Brightness.light),
    checkboxTheme: _checkboxTheme(Brightness.light),
    radioTheme: _radioTheme(Brightness.light),
    expansionTileTheme: _expansionTileTheme(Brightness.light),
    tooltipTheme: _tooltipTheme(Brightness.light),
    pageTransitionsTheme: _pageTransitionsTheme(),
  );
  
  // Dark Theme (Default - Cyber Gaming)
  ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: _darkColorScheme,
    textTheme: _textTheme(brightness: Brightness.dark),
    scaffoldBackgroundColor: backgroundPrimary,
    cardColor: backgroundCard,
    dividerColor: surfaceBorder,
    appBarTheme: _appBarTheme(Brightness.dark),
    bottomNavigationBarTheme: _bottomNavTheme(Brightness.dark),
    navigationBarTheme: _navigationBarTheme(Brightness.dark),
    elevatedButtonTheme: _elevatedButtonTheme(Brightness.dark),
    outlinedButtonTheme: _outlinedButtonTheme(Brightness.dark),
    textButtonTheme: _textButtonTheme(Brightness.dark),
    inputDecorationTheme: _inputDecorationTheme(Brightness.dark),
    cardTheme: _cardTheme(Brightness.dark),
    dialogTheme: _dialogTheme(Brightness.dark),
    bottomSheetTheme: _bottomSheetTheme(Brightness.dark),
    snackBarTheme: _snackBarTheme(Brightness.dark),
    chipTheme: _chipTheme(Brightness.dark),
    tabBarTheme: _tabBarTheme(Brightness.dark),
    dividerTheme: _dividerTheme(Brightness.dark),
    listTileTheme: _listTileTheme(Brightness.dark),
    floatingActionButtonTheme: _fabTheme(Brightness.dark),
    progressIndicatorTheme: _progressIndicatorTheme(),
    sliderTheme: _sliderTheme(Brightness.dark),
    switchTheme: _switchTheme(Brightness.dark),
    checkboxTheme: _checkboxTheme(Brightness.dark),
    radioTheme: _radioTheme(Brightness.dark),
    expansionTileTheme: _expansionTileTheme(Brightness.dark),
    tooltipTheme: _tooltipTheme(Brightness.dark),
    pageTransitionsTheme: _pageTransitionsTheme(),
  );
  
  // Color Schemes
  final ColorScheme _lightColorScheme = const ColorScheme.light(
    primary: primaryDefault,
    secondary: secondaryDefault,
    tertiary: accentCyan,
    surface: Colors.white,
    background: Color(0xFFFAFAFA),
    error: accentRed,
    onPrimary: Colors.white,
    onSecondary: Colors.white,
    onSurface: Color(0xFF1F2937),
    onBackground: Color(0xFF1F2937),
    onError: Colors.white,
    brightness: Brightness.light,
  );
  
  final ColorScheme _darkColorScheme = const ColorScheme.dark(
    primary: primaryDefault,
    secondary: secondaryDefault,
    tertiary: accentCyan,
    surface: backgroundCard,
    background: backgroundPrimary,
    error: accentRed,
    onPrimary: textInverse,
    onSecondary: textInverse,
    onSurface: textPrimary,
    onBackground: textPrimary,
    onError: textInverse,
    brightness: Brightness.dark,
  );
  
  // Text Theme
  TextTheme _textTheme({required Brightness brightness}) {
    final isDark = brightness == Brightness.dark;
    final baseColor = isDark ? textPrimary : Color(0xFF1F2937);
    final secondaryColor = isDark ? textSecondary : Color(0xFF6B7280);
    final mutedColor = isDark ? textMuted : Color(0xFF9CA3AF);
    
    return GoogleFonts.interTextTheme().copyWith(
      displayLarge: GoogleFonts.spaceGrotesk(
        fontSize: 57,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.02,
        color: baseColor,
        height: 1.1,
      ),
      displayMedium: GoogleFonts.spaceGrotesk(
        fontSize: 45,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.01,
        color: baseColor,
        height: 1.1,
      ),
      displaySmall: GoogleFonts.spaceGrotesk(
        fontSize: 36,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.2,
      ),
      headlineLarge: GoogleFonts.spaceGrotesk(
        fontSize: 32,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.3,
      ),
      headlineMedium: GoogleFonts.spaceGrotesk(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.3,
      ),
      headlineSmall: GoogleFonts.spaceGrotesk(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.4,
      ),
      titleLarge: GoogleFonts.spaceGrotesk(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.4,
      ),
      titleMedium: GoogleFonts.spaceGrotesk(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.4,
      ),
      titleSmall: GoogleFonts.spaceGrotesk(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.5,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w400,
        color: baseColor,
        height: 1.6,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: baseColor,
        height: 1.6,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: secondaryColor,
        height: 1.5,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: baseColor,
        height: 1.5,
      ),
      labelMedium: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: secondaryColor,
        height: 1.5,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: mutedColor,
        height: 1.5,
      ),
    );
  }
  
  // Component Themes
  AppBarTheme _appBarTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return AppBarTheme(
      centerTitle: false,
      elevation: 0,
      scrolledUnderElevation: 0,
      backgroundColor: isDark ? backgroundPrimary : Colors.white,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: GoogleFonts.spaceGrotesk(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: isDark ? textPrimary : Color(0xFF1F2937),
      ),
      iconTheme: IconThemeData(color: isDark ? textPrimary : Color(0xFF1F2937)),
      actionsIconTheme: IconThemeData(color: isDark ? textPrimary : Color(0xFF1F2937)),
    );
  }
  
  BottomNavigationBarThemeData _bottomNavTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return BottomNavigationBarThemeData(
      type: BottomNavigationBarType.fixed,
      backgroundColor: isDark ? surfaceGlassStrong : Colors.white,
      selectedItemColor: primaryDefault,
      unselectedItemColor: isDark ? textMuted : Colors.grey,
      selectedLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
      unselectedLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500),
      elevation: 8,
      showSelectedLabels: true,
      showUnselectedLabels: true,
    );
  }
  
  NavigationBarThemeData _navigationBarTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return NavigationBarThemeData(
      height: 72,
      backgroundColor: isDark ? surfaceGlassStrong : Colors.white,
      surfaceTintColor: Colors.transparent,
      indicatorColor: primaryDefault.withValues(alpha: 0.15),
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: primaryDefault);
        }
        return GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: isDark ? textMuted : Colors.grey);
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return IconThemeData(color: primaryDefault, size: 24);
        }
        return IconThemeData(color: isDark ? textMuted : Colors.grey, size: 24);
      }),
      shadowColor: isDark ? Colors.black54 : Colors.grey[300],
      elevation: 8,
    );
  }
  
  ElevatedButtonThemeData _elevatedButtonTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        minimumSize: Size(double.infinity, 52),
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius)),
        elevation: 0,
        backgroundColor: primaryDefault,
        foregroundColor: textInverse,
        textStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
        shadowColor: primaryGlow,
      ).copyWith(
        overlayColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.pressed)) {
            return primaryDark.withValues(alpha: 0.3);
          }
          if (states.contains(WidgetState.hovered)) {
            return primaryGlow.withValues(alpha: 0.2);
          }
          return null;
        }),
      ),
    );
  }
  
  OutlinedButtonThemeData _outlinedButtonTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: Size(double.infinity, 52),
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius)),
        side: BorderSide(color: isDark ? surfaceBorderGlow : primaryDefault, width: 1.5),
        foregroundColor: isDark ? primaryGlow : primaryDefault,
        textStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
      ).copyWith(
        overlayColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.pressed)) {
            return primaryDefault.withValues(alpha: 0.1);
          }
          if (states.contains(WidgetState.hovered)) {
            return primaryDefault.withValues(alpha: 0.05);
          }
          return null;
        }),
      ),
    );
  }
  
  TextButtonThemeData _textButtonTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return TextButtonThemeData(
      style: TextButton.styleFrom(
        minimumSize: Size(48, 48),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius)),
        foregroundColor: isDark ? textSecondary : Color(0xFF6B7280),
        textStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600),
      ).copyWith(
        overlayColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.pressed)) {
            return (isDark ? textPrimary : Color(0xFF1F2937)).withValues(alpha: 0.1);
          }
          return null;
        }),
      ),
    );
  }
  
  InputDecorationTheme _inputDecorationTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final fillColor = isDark ? backgroundTertiary : Colors.grey[100]!;
    final borderColor = isDark ? surfaceBorder : Colors.grey[300]!;
    final focusColor = primaryDefault;
    final textColor = isDark ? textPrimary : Color(0xFF1F2937);
    final hintColor = isDark ? textMuted : Colors.grey[500]!;
    
    return InputDecorationTheme(
      filled: true,
      fillColor: fillColor,
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
        borderSide: BorderSide(color: borderColor, width: 1),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
        borderSide: BorderSide(color: borderColor, width: 1),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
        borderSide: BorderSide(color: focusColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
        borderSide: BorderSide(color: accentRed, width: 1),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
        borderSide: BorderSide(color: accentRed, width: 2),
      ),
      disabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
        borderSide: BorderSide(color: borderColor.withValues(alpha: 0.5), width: 1),
      ),
      labelStyle: GoogleFonts.inter(color: hintColor, fontSize: 16),
      hintStyle: GoogleFonts.inter(color: hintColor, fontSize: 16),
      floatingLabelStyle: GoogleFonts.inter(color: focusColor, fontSize: 14),
      errorStyle: GoogleFonts.inter(color: accentRed, fontSize: 12),
      counterStyle: GoogleFonts.inter(color: mutedColor, fontSize: 12),
      prefixIconColor: hintColor,
      suffixIconColor: hintColor,
    );
  }
  
  CardThemeData _cardTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return CardThemeData(
      color: isDark ? backgroundCard : Colors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      shadowColor: isDark ? Colors.black54 : Colors.grey[300],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius),
        side: BorderSide(color: isDark ? surfaceBorder : Colors.grey[200]!, width: 1),
      ),
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
    );
  }
  
  DialogThemeData _dialogTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return DialogThemeData(
      backgroundColor: isDark ? backgroundCard : Colors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 24,
      shadowColor: isDark ? Colors.black54 : Colors.grey[300],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppConstants.panelBorderRadius)),
      titleTextStyle: GoogleFonts.spaceGrotesk(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: isDark ? textPrimary : Color(0xFF1F2937),
      ),
      contentTextStyle: GoogleFonts.inter(
        fontSize: 16,
        color: isDark ? textSecondary : Color(0xFF6B7280),
      ),
    );
  }
  
  BottomSheetThemeData _bottomSheetTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return BottomSheetThemeData(
      backgroundColor: isDark ? backgroundCard : Colors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 24,
      shadowColor: isDark ? Colors.black54 : Colors.grey[300],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppConstants.panelBorderRadius)),
      ),
      modalBackgroundColor: isDark ? backgroundCard : Colors.white,
      clipBehavior: Clip.antiAlias,
      constraints: BoxConstraints(maxWidth: 600),
    );
  }
  
  SnackBarThemeData _snackBarTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return SnackBarThemeData(
      backgroundColor: isDark ? backgroundTertiary : Color(0xFF1F2937),
      contentTextStyle: GoogleFonts.inter(color: isDark ? textPrimary : Colors.white),
      actionTextColor: primaryGlow,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius)),
      elevation: 8,
      padding: EdgeInsets.all(16),
    );
  }
  
  ChipThemeData _chipTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ChipThemeData(
      backgroundColor: isDark ? backgroundTertiary : Colors.grey[100],
      selectedColor: primaryDefault.withValues(alpha: 0.2),
      disabledColor: isDark ? backgroundSecondary : Colors.grey[200],
      labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: isDark ? textSecondary : Color(0xFF6B7280)),
      secondaryLabelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: primaryDefault),
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: isDark ? surfaceBorder : Colors.grey[300]!),
      ),
      brightness: brightness,
    );
  }
  
  TabBarThemeData _tabBarTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return TabBarThemeData(
      labelColor: primaryDefault,
      unselectedLabelColor: isDark ? textMuted : Colors.grey,
      labelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600),
      unselectedLabelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500),
      indicator: UnderlineTabIndicator(
        borderSide: BorderSide(color: primaryDefault, width: 3),
        insets: EdgeInsets.symmetric(horizontal: 16),
      ),
      dividerColor: Colors.transparent,
      overlayColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.pressed)) {
          return primaryDefault.withValues(alpha: 0.1);
        }
        return null;
      }),
    );
  }
  
  DividerThemeData _dividerTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return DividerThemeData(
      color: isDark ? surfaceBorder : Colors.grey[300],
      thickness: 1,
      space: 1,
    );
  }
  
  ListTileThemeData _listTileTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      titleTextStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: isDark ? textPrimary : Color(0xFF1F2937)),
      subtitleTextStyle: GoogleFonts.inter(fontSize: 14, color: isDark ? textSecondary : Color(0xFF6B7280)),
      leadingAndTrailingTextStyle: GoogleFonts.inter(fontSize: 14, color: isDark ? textMuted : Colors.grey),
      iconColor: isDark ? textMuted : Colors.grey,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      tileColor: Colors.transparent,
      selectedTileColor: primaryDefault.withValues(alpha: 0.1),
      horizontalTitleGap: 16,
      minVerticalPadding: 12,
    );
  }
  
  FloatingActionButtonThemeData _fabTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return FloatingActionButtonThemeData(
      backgroundColor: primaryDefault,
      foregroundColor: textInverse,
      elevation: 8,
      focusElevation: 12,
      hoverElevation: 12,
      highlightElevation: 16,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      extendedTextStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
    );
  }
  
  ProgressIndicatorThemeData _progressIndicatorTheme() {
    return ProgressIndicatorThemeData(
      color: primaryDefault,
      linearTrackColor: surfaceBorder,
      circularTrackColor: surfaceBorder,
      refreshBackgroundColor: backgroundSecondary,
    );
  }
  
  SliderThemeData _sliderTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return SliderThemeData(
      activeTrackColor: primaryDefault,
      inactiveTrackColor: isDark ? surfaceBorder : Colors.grey[300],
      thumbColor: primaryDefault,
      overlayColor: primaryDefault.withValues(alpha: 0.2),
      valueIndicatorColor: primaryDefault,
      valueIndicatorTextStyle: GoogleFonts.jetBrainsMono(fontSize: 12, color: textInverse),
      trackHeight: 4,
      thumbShape: RoundSliderThumbShape(enabledThumbRadius: 10),
      overlayShape: RoundSliderOverlayShape(overlayRadius: 20),
    );
  }
  
  SwitchThemeData _switchTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return primaryDefault;
        return isDark ? surfaceBorder : Colors.grey[400];
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return primaryDefault.withValues(alpha: 0.5);
        return isDark ? surfaceBorder : Colors.grey[300];
      }),
      trackOutlineColor: WidgetStateProperty.resolveWith((states) {
        return isDark ? surfaceBorder : Colors.grey[300];
      }),
    );
  }
  
  CheckboxThemeData _checkboxTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return primaryDefault;
        return Colors.transparent;
      }),
      checkColor: WidgetStateProperty.all(textInverse),
      side: BorderSide(color: isDark ? surfaceBorder : Colors.grey[400]!, width: 2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      splashRadius: 20,
    );
  }
  
  RadioThemeData _radioTheme(Brightness brightness) {
    return RadioThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return primaryDefault;
        return Colors.transparent;
      }),
    );
  }
  
  ExpansionTileThemeData _expansionTileTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ExpansionTileThemeData(
      backgroundColor: isDark ? backgroundCard : Colors.white,
      collapsedBackgroundColor: isDark ? backgroundCard : Colors.white,
      textColor: isDark ? textPrimary : Color(0xFF1F2937),
      collapsedTextColor: isDark ? textPrimary : Color(0xFF1F2937),
      iconColor: isDark ? textSecondary : Color(0xFF6B7280),
      collapsedIconColor: isDark ? textMuted : Colors.grey,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: isDark ? surfaceBorder : Colors.grey[300]!),
      ),
      tilePadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      childrenPadding: EdgeInsets.fromLTRB(16, 0, 16, 16),
    );
  }
  
  TooltipThemeData _tooltipTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return TooltipThemeData(
      decoration: BoxDecoration(
        color: isDark ? backgroundTertiary : Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(8),
      ),
      textStyle: GoogleFonts.inter(fontSize: 13, color: isDark ? textPrimary : Colors.white),
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      preferBelow: true,
      verticalOffset: 8,
    );
  }
  
  PageTransitionsTheme _pageTransitionsTheme() {
    return PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
        TargetPlatform.linux: CupertinoPageTransitionsBuilder(),
        TargetPlatform.fuchsia: CupertinoPageTransitionsBuilder(),
      },
    );
  }
}

// Custom Cupertino-like transitions
class CupertinoPageTransitionsBuilder extends PageTransitionsBuilder {
  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(1.0, 0.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic)),
      child: FadeTransition(opacity: animation, child: child),
    );
  }
}