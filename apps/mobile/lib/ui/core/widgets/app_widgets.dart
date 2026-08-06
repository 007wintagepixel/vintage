// ============================================
// Core UI Components
// ============================================

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';

// Glass Card
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? borderRadius;
  final bool strong;
  final VoidCallback? onTap;
  final Color? borderColor;
  
  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
    this.strong = false,
    this.onTap,
    this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final card = Container(
      margin: margin ?? EdgeInsets.zero,
      padding: padding ?? const EdgeInsets.all(AppConstants.spacingMd),
      decoration: BoxDecoration(
        color: strong 
            ? (isDark ? AppTheme.surfaceGlassStrong : Colors.white.withValues(alpha: 0.9))
            : (isDark ? AppTheme.surfaceGlass : Colors.white.withValues(alpha: 0.7)),
        borderRadius: BorderRadius.circular(borderRadius ?? AppConstants.cardBorderRadius),
        border: Border.all(
          color: borderColor ?? (isDark ? AppTheme.surfaceBorder : Colors.grey[300]!),
          width: 1,
        ),
        boxShadow: strong ? [AppTheme.glassStrongShadow] : [AppTheme.glassShadow],
      ),
      child: child,
    );
    
    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(borderRadius ?? AppConstants.cardBorderRadius),
          child: card,
        ),
      );
    }
    
    return card;
  }
}

// Glass Panel
class GlassPanel extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? borderRadius;
  
  const GlassPanel({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Container(
      margin: margin ?? EdgeInsets.zero,
      padding: padding ?? const EdgeInsets.all(AppConstants.spacingLg),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceGlassStrong : Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(borderRadius ?? AppConstants.panelBorderRadius),
        border: Border.all(
          color: isDark ? AppTheme.surfaceBorderGlow : Colors.grey[300]!,
          width: 1.5,
        ),
        boxShadow: [AppTheme.glassStrongShadow],
      ),
      child: child,
    );
  }
}

// Custom Buttons
class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;
  final bool isLoading;
  final bool fullWidth;
  final double? width;
  final double height;
  
  const PrimaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.isLoading = false,
    this.fullWidth = true,
    this.width,
    this.height = 52,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return SizedBox(
      width: fullWidth ? double.infinity : width,
      height: height,
      child: FilledButton(
        onPressed: isLoading ? null : onPressed,
        style: FilledButton.styleFrom(
          backgroundColor: theme.colorScheme.primary,
          foregroundColor: theme.colorScheme.onPrimary,
          elevation: 0,
          shadowColor: AppTheme.primaryGlow,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        ).copyWith(
          overlayColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.pressed)) {
              return AppTheme.primaryDark.withValues(alpha: 0.3);
            }
            if (states.contains(WidgetState.hovered)) {
              return AppTheme.primaryGlow.withValues(alpha: 0.2);
            }
            return null;
          }),
        ),
        child: isLoading
            ? SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.onPrimary),
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    icon!,
                    const SizedBox(width: 8),
                  ],
                  Text(
                    label,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

class SecondaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;
  final bool fullWidth;
  final double? width;
  final double height;
  
  const SecondaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.fullWidth = true,
    this.width,
    this.height = 52,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return SizedBox(
      width: fullWidth ? double.infinity : width,
      height: height,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: theme.colorScheme.primary,
          side: BorderSide(
            color: theme.colorScheme.primary,
            width: 1.5,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        ).copyWith(
          overlayColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.pressed)) {
              return theme.colorScheme.primary.withValues(alpha: 0.1);
            }
            if (states.contains(WidgetState.hovered)) {
              return theme.colorScheme.primary.withValues(alpha: 0.05);
            }
            return null;
          }),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              icon!,
              const SizedBox(width: 8),
            ],
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class GhostButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;
  final bool fullWidth;
  
  const GhostButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.fullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        minimumSize: fullWidth ? const Size(double.infinity, 48) : const Size(48, 48),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius),
        ),
        foregroundColor: theme.colorScheme.onSurfaceVariant,
      ).copyWith(
        overlayColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.pressed)) {
            return theme.colorScheme.onSurface.withValues(alpha: 0.1);
          }
          return null;
        }),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (icon != null) ...[
            icon!,
            const SizedBox(width: 8),
          ],
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// Custom Icon Button
class AppIconButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Widget icon;
  final double size;
  final Color? backgroundColor;
  final Color? iconColor;
  final String? tooltip;
  
  const AppIconButton({
    super.key,
    required this.onPressed,
    required this.icon,
    this.size = 48,
    this.backgroundColor,
    this.iconColor,
    this.tooltip,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final button = Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: backgroundColor ?? (isDark ? AppTheme.backgroundTertiary : Colors.grey[100]),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? AppTheme.surfaceBorder : Colors.grey[300]!,
              width: 1,
            ),
          ),
          child: Center(
            child: IconTheme(
              data: IconThemeData(
                color: iconColor ?? theme.colorScheme.onSurface,
                size: size * 0.5,
              ),
              child: icon,
            ),
          ),
        ),
      ),
    );
    
    if (tooltip != null) {
      return Tooltip(
        message: tooltip!,
        child: button,
      );
    }
    
    return button;
  }
}

// Input Field
class AppTextField extends StatelessWidget {
  final TextEditingController? controller;
  final String? label;
  final String? hint;
  final String? errorText;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final bool readOnly;
  final int? maxLines;
  final int? maxLength;
  final TextInputAction? textInputAction;
  final FocusNode? focusNode;
  final bool enabled;
  final String? Function(String?)? validator;
  
  const AppTextField({
    super.key,
    this.controller,
    this.label,
    this.hint,
    this.errorText,
    this.keyboardType,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onChanged,
    this.onTap,
    this.readOnly = false,
    this.maxLines = 1,
    this.maxLength,
    this.textInputAction,
    this.focusNode,
    this.enabled = true,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final hasError = errorText != null;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: controller,
          focusNode: focusNode,
          enabled: enabled,
          readOnly: readOnly,
          obscureText: obscureText,
          keyboardType: keyboardType,
          maxLines: maxLines,
          maxLength: maxLength,
          textInputAction: textInputAction,
          onChanged: onChanged,
          onTap: onTap,
          validator: validator,
          style: GoogleFonts.inter(
            fontSize: 16,
            color: theme.colorScheme.onSurface,
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.inter(
              fontSize: 16,
              color: theme.colorScheme.onSurfaceVariant,
            ),
            errorText: errorText,
            errorStyle: GoogleFonts.inter(
              fontSize: 12,
              color: AppTheme.accentRed,
            ),
            prefixIcon: prefixIcon != null
                ? Padding(
                    padding: const EdgeInsets.all(12),
                    child: IconTheme(
                      data: IconThemeData(
                        color: theme.colorScheme.onSurfaceVariant,
                        size: 22,
                      ),
                      child: prefixIcon!,
                    ),
                  )
                : null,
            suffixIcon: suffixIcon != null
                ? Padding(
                    padding: const EdgeInsets.all(12),
                    child: IconTheme(
                      data: IconThemeData(
                        color: theme.colorScheme.onSurfaceVariant,
                        size: 22,
                      ),
                      child: suffixIcon!,
                    ),
                  )
                : null,
            filled: true,
            fillColor: theme.brightness == Brightness.dark 
                ? AppTheme.backgroundTertiary 
                : Colors.grey[100],
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
              borderSide: BorderSide(
                color: theme.brightness == Brightness.dark 
                    ? AppTheme.surfaceBorder 
                    : Colors.grey[300]!,
                ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
              borderSide: BorderSide(
                color: hasError 
                    ? AppTheme.accentRed 
                    : (theme.brightness == Brightness.dark 
                        ? AppTheme.surfaceBorder 
                        : Colors.grey[300]!),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
              borderSide: BorderSide(
                color: hasError ? AppTheme.accentRed : theme.colorScheme.primary,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
              borderSide: const BorderSide(color: AppTheme.accentRed),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
              borderSide: const BorderSide(color: AppTheme.accentRed, width: 2),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
              borderSide: BorderSide(
                color: (theme.brightness == Brightness.dark 
                    ? AppTheme.surfaceBorder 
                    : Colors.grey[300]!).withValues(alpha: 0.5),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// Token Widget
class TokenWidget extends StatelessWidget {
  final String color;
  final double size;
  final bool isSelected;
  final bool isMoving;
  final VoidCallback? onTap;
  final int? tokenNumber;
  
  const TokenWidget({
    super.key,
    required this.color,
    this.size = 40,
    this.isSelected = false,
    this.isMoving = false,
    this.onTap,
    this.tokenNumber,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorValue = AppConstants.playerColorValues[color] ?? 0xFFEF4444;
    final glowValue = AppConstants.playerColorGlowValues[color] ?? 0xFFF87171;
    
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Color(colorValue),
          border: Border.all(
            color: Color(glowValue),
            width: isSelected ? 4 : 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Color(glowValue).withValues(alpha: isSelected ? 0.6 : 0.3),
              blurRadius: isSelected ? 16 : 8,
              spreadRadius: isSelected ? 2 : 0,
            ),
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.3),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: tokenNumber != null
            ? Center(
                child: Text(
                  tokenNumber.toString(),
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: size * 0.35,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    shadows: [
                      Shadow(
                        color: Colors.black.withValues(alpha: 0.5),
                        offset: const Offset(0, 1),
                        blurRadius: 2,
                      ),
                    ],
                  ),
                )
            : null,
      )
          .animate(
            target: isMoving ? 1 : 0,
          )
          .scale(
            duration: AppConstants.tokenMoveDuration,
            begin: const Offset(1, 1),
            end: const Offset(1.15, 1.15),
            curve: Curves.easeOutCubic,
          )
          .then()
          .scale(
            duration: AppConstants.tokenMoveDuration,
            begin: const Offset(1.15, 1.15),
            end: const Offset(1, 1),
            curve: Curves.easeOutCubic,
          ),
    );
  }
}

// Dice Widget
class DiceWidget extends StatelessWidget {
  final int value;
  final bool isRolling;
  final double size;
  final VoidCallback? onTap;
  
  const DiceWidget({
    super.key,
    required this.value,
    this.isRolling = false,
    this.size = 64,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 100),
        width: size,
        height: size,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              Colors.white,
              Colors.grey[200]!,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          border: Border.all(color: Colors.grey[300]!, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.15),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: Colors.white.withValues(alpha: 0.5),
              blurRadius: 2,
              offset: const Offset(-1, -1),
            ),
          ],
        ),
        child: Center(
          child: _buildDiceFace(value)
              .animate(target: isRolling ? 1 : 0)
              .rotate(
                duration: AppConstants.diceRollDuration,
                begin: 0,
                end: 2,
                curve: Curves.elasticOut,
              )
              .scale(
                duration: AppConstants.diceRollDuration,
                begin: const Offset(1, 1),
                end: const Offset(1.1, 1.1),
                curve: Curves.elasticOut,
              )
              .then()
              .scale(
                duration: const Duration(milliseconds: 200),
                begin: const Offset(1.1, 1.1),
                end: const Offset(1, 1),
                curve: Curves.easeOutCubic,
              ),
        ),
      ),
    );
  }
  
  Widget _buildDiceFace(int value) {
    final dotSize = size * 0.12;
    final spacing = size * 0.22;
    final offset = size * 0.28;
    
    Widget dot = Container(
      width: dotSize,
      height: dotSize,
      decoration: BoxDecoration(
        color: Colors.grey[800],
        shape: BoxShape.circle,
      ),
    );
    
    switch (value) {
      case 1:
        return Center(child: dot);
      case 2:
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Transform.translate(offset: Offset(-offset, -offset), child: dot),
            Transform.translate(offset: Offset(offset, offset), child: dot),
          ],
        );
      case 3:
        return Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, -offset), child: dot),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [dot],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(offset, offset), child: dot),
              ],
            ),
          ],
        );
      case 4:
        return Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, -offset), child: dot),
                Transform.translate(offset: Offset(offset, -offset), child: dot),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, offset), child: dot),
                Transform.translate(offset: Offset(offset, offset), child: dot),
              ],
            ),
          ],
        );
      case 5:
        return Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, -offset), child: dot),
                Transform.translate(offset: Offset(offset, -offset), child: dot),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [dot],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, offset), child: dot),
                Transform.translate(offset: Offset(offset, offset), child: dot),
              ],
            ),
          ],
        );
      case 6:
        return Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, -offset), child: dot),
                Transform.translate(offset: Offset(offset, -offset), child: dot),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, 0), child: dot),
                Transform.translate(offset: Offset(offset, 0), child: dot),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Transform.translate(offset: Offset(-offset, offset), child: dot),
                Transform.translate(offset: Offset(offset, offset), child: dot),
              ],
            ),
          ],
        );
      default:
        return Center(child: Text(value.toString()));
    }
  }
}

// Avatar Widget
class AvatarWidget extends StatelessWidget {
  final String? imageUrl;
  final String? initials;
  final double size;
  final Color? backgroundColor;
  final Color? textColor;
  
  const AvatarWidget({
    super.key,
    this.imageUrl,
    this.initials,
    this.size = 48,
    this.backgroundColor,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: backgroundColor ?? theme.colorScheme.primaryContainer,
        border: Border.all(
          color: theme.colorScheme.outlineVariant,
          width: 1,
        ),
      ),
      child: ClipOval(
        child: imageUrl != null
            ? Image.network(
                imageUrl!,
                width: size,
                height: size,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _buildInitials(theme),
              )
            : _buildInitials(theme),
      ),
    );
  }
  
  Widget _buildInitials(ThemeData theme) {
    return Center(
      child: Text(
        initials ?? '?',
        style: GoogleFonts.spaceGrotesk(
          fontSize: size * 0.4,
          fontWeight: FontWeight.w600,
          color: textColor ?? theme.colorScheme.onPrimaryContainer,
        ),
      ),
    );
  }
}

// Loading Shimmer
class ShimmerLoader extends StatelessWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;
  
  const ShimmerLoader({
    super.key,
    this.width = double.infinity,
    this.height = 20,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(8),
        gradient: LinearGradient(
          colors: [
            Colors.grey[800]!,
            Colors.grey[700]!,
            Colors.grey[800]!,
          ],
          stops: const [0.1, 0.5, 0.9],
        ),
      ),
    ).animate(
      onComplete: (controller) => controller.repeat(),
    ).shimmer(
      duration: const Duration(milliseconds: 1500),
      color: Colors.grey[700]!,
    );
  }
}

// Empty State
class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? action;
  
  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingXl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: theme.colorScheme.primaryContainer,
              ),
              child: Icon(
                icon,
                size: 40,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: AppConstants.spacingLg),
            Text(
              title,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: AppConstants.spacingSm),
              Text(
                subtitle!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (action != null) ...[
              const SizedBox(height: AppConstants.spacingLg),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}

// Snackbar Helper
class AppSnackBar {
  static void show(
    BuildContext context, {
    required String message,
    String? actionLabel,
    VoidCallback? onActionPressed,
    Duration duration = AppConstants.snackbarDuration,
    SnackBarType type = SnackBarType.info,
  }) {
    final theme = Theme.of(context);
    
    Color backgroundColor;
    IconData icon;
    
    switch (type) {
      case SnackBarType.success:
        backgroundColor = AppTheme.accentGreen;
        icon = Icons.check_circle;
        break;
      case SnackBarType.error:
        backgroundColor = AppTheme.accentRed;
        icon = Icons.error;
        break;
      case SnackBarType.warning:
        backgroundColor = AppTheme.accentOrange;
        icon = Icons.warning;
        break;
      case SnackBarType.info:
      default:
        backgroundColor = AppTheme.primaryDefault;
        icon = Icons.info;
        break;
    }
    
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: GoogleFonts.inter(color: Colors.white),
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius),
        ),
        duration: duration,
        action: actionLabel != null && onActionPressed != null
            ? SnackBarAction(
                label: actionLabel,
                textColor: Colors.white,
                onPressed: onActionPressed,
              )
            : null,
      ),
    );
  }
}

enum SnackBarType { info, success, error, warning }

// Safe Area Wrapper
class SafeScreen extends StatelessWidget {
  final Widget child;
  final Color? backgroundColor;
  final bool resizeToAvoidBottomInset;
  
  const SafeScreen({
    super.key,
    required this.child,
    this.backgroundColor,
    this.resizeToAvoidBottomInset = true,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      body: SafeArea(
        child: child,
      ),
    );
  }
}