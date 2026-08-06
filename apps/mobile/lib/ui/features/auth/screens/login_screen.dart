// ============================================
// Login Screen
// ============================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/widgets/app_widgets.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      // TODO: Implement actual login API call
      // final authService = ref.read(authServiceProvider);
      // await authService.login(_identifierController.text, _passwordController.text);
      
      // For now, simulate login
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      setState(() {
        _error = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      body: Stack(
        children: [
          // Background Effects
          _buildBackground(),
          
          // Content
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Logo & Title
                      _buildHeader()
                          .animate()
                          .fadeIn(duration: 600.ms)
                          .slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 48),
                      
                      // Login Form
                      _buildLoginForm()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 200.ms)
                          .slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 24),
                      
                      // Divider
                      _buildDivider()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 400.ms),
                      
                      const SizedBox(height: 24),
                      
                      // Social Login
                      _buildSocialLogin()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 500.ms)
                          .slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 32),
                      
                      // Sign Up Link
                      _buildSignUpLink()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 600.ms),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackground() {
    return Stack(
      children: [
        Container(color: AppTheme.backgroundPrimary),
        Positioned.fill(
          child: CustomPaint(
            painter: _MeshGradientPainter(),
          ),
        ),
        Positioned(
          top: -100,
          left: -100,
          child: Container(
            width: 300,
            height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppTheme.primaryGlow.withValues(alpha: 0.15),
                  Colors.transparent,
                ],
              ),
            ),
          ).animate().scale(duration: 2000.ms, curve: Curves.easeInOut),
        ),
        Positioned(
          bottom: -100,
          right: -100,
          child: Container(
            width: 300,
            height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppTheme.accentMagenta.withValues(alpha: 0.1),
                  Colors.transparent,
                ],
              ),
            ),
          ).animate().scale(duration: 2000.ms, delay: 500.ms, curve: Curves.easeInOut),
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: AppTheme.primaryGradient,
            boxShadow: [
              BoxShadow(
                color: AppTheme.primaryGlow.withValues(alpha: 0.5),
                blurRadius: 30,
                spreadRadius: 0,
              ),
            ],
          ),
          child: const Icon(
            Icons.casino,
            size: 48,
            color: AppTheme.textInverse,
          ),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        
        const SizedBox(height: 16),
        
        ShaderMask(
          shaderCallback: (bounds) => AppTheme.accentGradient.createShader(bounds),
          child: Text(
            AppConstants.appName,
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
        ).animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 8),
        
        Text(
          'Sign in to continue',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: AppTheme.textSecondary,
          ),
          textAlign: TextAlign.center,
        ).animate().fadeIn(duration: 600.ms, delay: 300.ms).slideY(begin: 0.3),
      ],
    );
  }

  Widget _buildLoginForm() {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Error Message
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppTheme.accentRed.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                  border: Border.all(color: AppTheme.accentRed.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, color: AppTheme.accentRed, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _error!,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.accentRed,
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().shake(duration: 500.ms),
            
            // Email/Username Field
            AppTextField(
              controller: _identifierController,
              label: 'Email or Username',
              hintText: 'Enter your email or username',
              prefixIcon: Icons.alternate_email,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your email or username';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 16),
            
            // Password Field
            AppTextField(
              controller: _passwordController,
              label: 'Password',
              hintText: 'Enter your password',
              prefixIcon: Icons.lock_outline,
              obscureText: _obscurePassword,
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                  color: AppTheme.textMuted,
                ),
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              ),
              textInputAction: TextInputAction.done,
              onFieldSubmitted: (_) => _handleLogin(),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your password';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 8),
            
            // Remember Me & Forgot Password
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Checkbox(
                      value: true,
                      onChanged: (value) {},
                      activeColor: AppTheme.primaryDefault,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    Text(
                      'Remember me',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () => context.go('/auth/forgot-password'),
                  child: Text(
                    'Forgot password?',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppTheme.primaryGlow,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Login Button
            AnimatedScale(
              scale: _isLoading ? 0.98 : 1.0,
              duration: 100.ms,
              child: GradientButton(
                onPressed: _isLoading ? null : _handleLogin,
                isLoading: _isLoading,
                text: 'Sign In',
                icon: Icons.login,
                gradient: AppTheme.primaryGradient,
              ),
            ).animate().fadeIn(duration: 600.ms, delay: 400.ms).slideY(begin: 0.2),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Row(
      children: [
        const Expanded(child: Divider(color: AppTheme.surfaceBorder)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Or continue with',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppTheme.textMuted,
            ),
          ),
        ),
        const Expanded(child: Divider(color: AppTheme.surfaceBorder)),
      ],
    );
  }

  Widget _buildSocialLogin() {
    return Row(
      children: [
        Expanded(
          child: SocialLoginButton(
            onPressed: () {}, // TODO: Implement Google login
            icon: _GoogleIcon(),
            label: 'Google',
            isLoading: false,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: SocialLoginButton(
            onPressed: () {}, // TODO: Implement Apple login
            icon: _AppleIcon(),
            label: 'Apple',
            isLoading: false,
          ),
        ),
      ],
    );
  }

  Widget _buildSignUpLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "Don't have an account? ",
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: AppTheme.textSecondary,
          ),
        ),
        TextButton(
          onPressed: () => context.go('/auth/register'),
          child: Text(
            'Sign up',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.primaryGlow,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

// Google Icon
class _GoogleIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 20,
      height: 20,
      child: CustomPaint(painter: _GoogleIconPainter()),
    );
  }
}

class _GoogleIconPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;
    
    final path1 = Path()
      ..moveTo(size.width * 0.48, size.height * 0.15)
      ..lineTo(size.width * 0.48, size.height * 0.55)
      ..lineTo(size.width * 0.82, size.height * 0.7)
      ..lineTo(size.width * 0.82, size.height * 0.3)
      ..close();
    paint.color = const Color(0xFF4285F4);
    canvas.drawPath(path1, paint);
    
    final path2 = Path()
      ..moveTo(size.width * 0.48, size.height * 0.55)
      ..lineTo(size.width * 0.18, size.height * 0.8)
      ..lineTo(size.width * 0.48, size.height * 1.05)
      ..lineTo(size.width * 0.82, size.height * 0.7)
      ..close();
    paint.color = const Color(0xFF34A853);
    canvas.drawPath(path2, paint);
    
    final path3 = Path()
      ..moveTo(size.width * 0.18, size.height * 0.8)
      ..lineTo(size.width * 0.48, size.height * 0.55)
      ..lineTo(size.width * 0.48, size.height * 0.15)
      ..lineTo(0, size.height * 0.3)
      ..close();
    paint.color = const Color(0xFFFBBC05);
    canvas.drawPath(path3, paint);
    
    final path4 = Path()
      ..moveTo(size.width * 0.18, size.height * 0.8)
      ..lineTo(size.width * 0.48, size.height * 1.05)
      ..lineTo(size.width * 0.18, size.height * 1.3)
      ..close();
    paint.color = const Color(0xFFEA4335);
    canvas.drawPath(path4, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Apple Icon
class _AppleIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Icon(
      Icons.apple,
      size: 20,
      color: Colors.white,
    );
  }
}

// Mesh Gradient Painter
class _MeshGradientPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;
    
    // Top-left glow
    paint.shader = RadialGradient(
      center: Alignment.topLeft,
      radius: 1.5,
      colors: [
        AppTheme.primaryGlow.withValues(alpha: 0.08),
        Colors.transparent,
      ],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
    
    // Bottom-right glow
    paint.shader = RadialGradient(
      center: Alignment.bottomRight,
      radius: 1.2,
      colors: [
        AppTheme.accentMagenta.withValues(alpha: 0.06),
        Colors.transparent,
      ],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
    
    // Center gold glow
    paint.shader = RadialGradient(
      center: Alignment.center,
      radius: 0.8,
      colors: [
        AppTheme.secondaryGlow.withValues(alpha: 0.04),
        Colors.transparent,
      ],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}