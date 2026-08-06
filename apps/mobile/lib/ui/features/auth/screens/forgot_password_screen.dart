// ============================================
// Forgot Password Screen
// ============================================

import 'package:flutter/material.dart' hide IconButton;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../core/widgets/app_widgets.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isLoading = false;
  String? _error;
  bool _success = false;
  int _step = 1; // 1: email, 2: OTP, 3: new password

  final List<TextEditingController> _otpControllers = List.generate(6, (index) => TextEditingController());
  final List<FocusNode> _otpFocusNodes = List.generate(6, (index) => FocusNode());
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  int _resendCooldown = 0;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    for (var c in _otpControllers) c.dispose();
    for (var f in _otpFocusNodes) f.dispose();
    super.dispose();
  }

  void _startResendTimer() {
    _resendCooldown = 60;
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        setState(() => _resendCooldown--);
        return _resendCooldown > 0;
      }
      return false;
    });
  }

  void _onOtpChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _otpFocusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _otpFocusNodes[index - 1].requestFocus();
    }
    
    final otp = _otpControllers.map((c) => c.text).join();
    if (otp.length == 6) {
      _verifyOtp(otp);
    }
  }

  Future<void> _sendResetEmail() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() { _isLoading = true; _error = null; });

    try {
      // TODO: Implement actual forgot password API call
      await Future.delayed(const Duration(seconds: 1));
      
      setState(() {
        _success = true;
        _step = 2;
        _startResendTimer();
      });
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyOtp(String otp) async {
    setState(() => _isLoading = true);
    
    try {
      // TODO: Implement actual OTP verification
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        setState(() => _step = 3);
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _resetPassword() async {
    if (!_resetFormKey.currentState!.validate()) return;

    setState(() { _isLoading = true; _error = null; });

    try {
      // TODO: Implement actual password reset API call
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        context.go('/auth/login?reset=success');
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _resendOtp() async {
    if (_resendCooldown > 0) return;
    
    // TODO: Implement resend OTP API call
    setState(() => _resendCooldown = 60);
    _startResendTimer();
  }

  final _formKey = GlobalKey<FormState>();
  final _resetFormKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _buildBackground(),
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
                      _buildHeader()
                          .animate().fadeIn(duration: 600.ms).slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 48),
                      
                      _buildStepForm()
                          .animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 24),
                      
                      _buildBackLink()
                          .animate().fadeIn(duration: 600.ms, delay: 400.ms),
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

  Widget _buildBackground() => Stack(children: [
    Container(color: AppTheme.backgroundPrimary),
    Positioned.fill(child: CustomPaint(painter: _MeshGradientPainter())),
  ]);

  Widget _buildHeader() {
    return Column(
      children: [
        Container(
          width: 80, height: 80,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: AppTheme.primaryGradient,
            boxShadow: [BoxShadow(color: AppTheme.primaryGlow.withValues(alpha: 0.5), blurRadius: 30)],
          ),
          child: const Icon(Icons.casino, size: 48, color: AppTheme.textInverse),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        
        const SizedBox(height: 16),
        
        ShaderMask(
          shaderCallback: (bounds) => AppTheme.accentGradient.createShader(bounds),
          child: Text(
            AppConstants.appName,
            style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.w700, color: Colors.white),
            textAlign: TextAlign.center,
          ),
        ).animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 8),
        
        Text(
          _getHeaderTitle(),
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppTheme.textSecondary),
          textAlign: TextAlign.center,
        ).animate().fadeIn(duration: 600.ms, delay: 300.ms).slideY(begin: 0.3),
      ],
    );
  }

  String _getHeaderTitle() {
    switch (_step) {
      case 1: return 'Forgot Password?';
      case 2: return 'Check Your Email';
      case 3: return 'New Password';
      default: return 'Reset Password';
    }
  }

  Widget _buildStepForm() {
    switch (_step) {
      case 1: return _buildEmailForm();
      case 2: return _buildOtpForm();
      case 3: return _buildPasswordForm();
      default: return _buildEmailForm();
    }
  }

  Widget _buildEmailForm() {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppTheme.accentRed.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                  border: Border.all(color: AppTheme.accentRed.withValues(alpha: 0.3)),
                ),
                child: Row(children: [
                  Icon(Icons.error_outline, color: AppTheme.accentRed, size: 20),
                  const SizedBox(width: 8),
                  Expanded(child: Text(_error!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.accentRed))),
                ]),
              ).animate().shake(duration: 500.ms),

            if (_success)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppTheme.accentGreen.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                  border: Border.all(color: AppTheme.accentGreen.withValues(alpha: 0.3)),
                ),
                child: Row(children: [
                  Icon(Icons.check_circle, color: AppTheme.accentGreen, size: 20),
                  const SizedBox(width: 8),
                  Expanded(child: Text('Reset code sent! Check your email.', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.accentGreen))),
                ]),
              ).animate().fadeIn(duration: 300.ms),

            AppTextField(
              controller: _emailController,
              label: 'Email Address',
              hint: 'your@email.com',
              prefixIcon: const Icon(Icons.alternate_email),
              keyboardType: TextInputType.emailAddress,
              validator: (v) => v == null || v.isEmpty ? 'Email required' :
                  !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(v) ? 'Invalid email' : null,
            ),
            
            const SizedBox(height: 16),
            
            Text(
              "We'll send a 6-digit verification code to this email.",
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.textMuted),
              textAlign: TextAlign.center,
            ),
            
            const SizedBox(height: 24),
            
            GradientButton(
              onPressed: _isLoading ? null : _sendResetEmail,
              isLoading: _isLoading,
              text: 'Send Reset Code',
              icon: Icons.send,
              gradient: AppTheme.primaryGradient,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOtpForm() {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (_error != null)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: AppTheme.accentRed.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                border: Border.all(color: AppTheme.accentRed.withValues(alpha: 0.3)),
              ),
              child: Row(children: [
                Icon(Icons.error_outline, color: AppTheme.accentRed, size: 20),
                const SizedBox(width: 8),
                Expanded(child: Text(_error!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.accentRed))),
              ]),
            ).animate().shake(duration: 500.ms),

          Text(
            'Enter the 6-digit code sent to your email',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 24),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(6, (index) => SizedBox(
              width: 48, height: 56,
              child: TextFormField(
                controller: TextEditingController(),
                focusNode: FocusNode(),
                textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                maxLength: 1,
                style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.w700),
                decoration: InputDecoration(
                  counterText: '',
                  filled: true,
                  fillColor: Theme.of(context).brightness == Brightness.dark ? AppTheme.backgroundTertiary : Colors.grey[100],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: Theme.of(context).brightness == Brightness.dark ? AppTheme.surfaceBorder : Colors.grey[300]!),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: AppTheme.primaryDefault, width: 2),
                  ),
                ),
                onChanged: (value) {
                  // TODO: Implement OTP handling
                },
              ),
            )),
          ),
          
          const SizedBox(height: 24),
          
          Column(
            children: [
              Text(
                _resendCooldown > 0
                    ? 'Resend code in $_resendCooldown seconds'
                    : "Didn't receive the code?",
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppTheme.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: _resendCooldown > 0 ? null : () {
                  setState(() => _resendCooldown = 60);
                  // TODO: Resend OTP
                },
                child: Text(
                  'Resend Code',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: _resendCooldown > 0 ? AppTheme.textMuted : AppTheme.primaryGlow,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          GradientButton(
            onPressed: _isLoading ? null : () {
              // TODO: Verify OTP and go to step 3
            },
            isLoading: _isLoading,
            text: 'Verify Code',
            icon: Icons.verified,
            gradient: AppTheme.primaryGradient,
          ),
        ],
      ),
    );
  }

  final _resetFormKey = GlobalKey<FormState>();

  Widget _buildPasswordForm() {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _resetFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppTheme.accentRed.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                  border: Border.all(color: AppTheme.accentRed.withValues(alpha: 0.3)),
                ),
                child: Row(children: [
                  Icon(Icons.error_outline, color: AppTheme.accentRed, size: 20),
                  const SizedBox(width: 8),
                  Expanded(child: Text(_error!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.accentRed))),
                ]),
              ).animate().shake(duration: 500.ms),

            AppTextField(
              controller: _passwordController,
              label: 'New Password',
              hint: 'Create a strong password',
              prefixIcon: const Icon(Icons.lock_outline),
              obscureText: true,
              suffixIcon: IconButton(
                icon: const Icon(Icons.visibility_off, color: AppTheme.textMuted, size: 20),
                onPressed: () {},
              ),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Password required';
                if (v.length < 8) return 'Min 8 characters';
                if (!RegExp(r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])').hasMatch(v)) {
                  return 'Need upper, lower, number, special char';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            AppTextField(
              controller: _confirmPasswordController,
              label: 'Confirm New Password',
              hint: 'Confirm your new password',
              prefixIcon: const Icon(Icons.lock_outline),
              obscureText: true,
              validator: (v) => v != _passwordController.text ? 'Passwords do not match' : null,
            ),
            
            const SizedBox(height: 24),
            
            GradientButton(
              onPressed: _isLoading ? null : _resetPassword,
              isLoading: _isLoading,
              text: 'Reset Password',
              icon: Icons.lock_reset,
              gradient: AppTheme.primaryGradient,
            ),
          ],
        ),
      ),
    );
  }

  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  Widget _buildBackLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        TextButton.icon(
          onPressed: () {
            if (_step > 1) {
              setState(() => _step--);
            } else {
              context.go('/auth/login');
            }
          },
          icon: const Icon(Icons.arrow_back, size: 20),
          label: Text(_step > 1 ? 'Back' : 'Back to Login'),
          style: TextButton.styleFrom(foregroundColor: AppTheme.textMuted),
        ),
      ],
    );
  }
}

Widget _buildBackground() => Stack(children: [
  Container(color: AppTheme.backgroundPrimary),
  Positioned.fill(child: CustomPaint(painter: _MeshGradientPainter())),
]);

Widget _buildHeader() {
  return Column(
    children: [
      Container(
        width: 80, height: 80,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: AppTheme.primaryGradient,
          boxShadow: [BoxShadow(color: AppTheme.primaryGlow.withValues(alpha: 0.5), blurRadius: 30)],
        ),
        child: const Icon(Icons.casino, size: 48, color: AppTheme.textInverse),
      ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
      
      const SizedBox(height: 16),
      
      ShaderMask(
        shaderCallback: (bounds) => AppTheme.accentGradient.createShader(bounds),
        child: Text(
          'Ludo Nexus',
          style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.w700, color: Colors.white),
          textAlign: TextAlign.center,
        ),
      ).animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.3),
      
      const SizedBox(height: 8),
      
      Text(
        'Reset your password',
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppTheme.textSecondary),
        textAlign: TextAlign.center,
      ).animate().fadeIn(duration: 600.ms, delay: 300.ms).slideY(begin: 0.3),
    ],
  );
}

class _MeshGradientPainter extends CustomPainter {
  @override void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;
    paint.shader = RadialGradient(center: Alignment.topLeft, radius: 1.5, colors: [
      AppTheme.primaryGlow.withValues(alpha: 0.08), Colors.transparent]).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
    paint.shader = RadialGradient(center: Alignment.bottomRight, radius: 1.2, colors: [
      AppTheme.accentMagenta.withValues(alpha: 0.06), Colors.transparent]).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }
  @override bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}