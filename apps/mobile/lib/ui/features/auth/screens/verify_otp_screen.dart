// ============================================
// Verify OTP Screen
// ============================================

import 'package:flutter/material.dart' hide IconButton;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../core/widgets/app_widgets.dart';

class VerifyOtpScreen extends ConsumerStatefulWidget {
  final String identifier;
  final String type;

  const VerifyOtpScreen({
    super.key,
    required this.identifier,
    required this.type,
  });

  @override
  ConsumerState<VerifyOtpScreen> createState() => _VerifyOtpScreenState();
}

class _VerifyOtpScreenState extends ConsumerState<VerifyOtpScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (index) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (index) => FocusNode());
  bool _isLoading = false;
  String? _error;
  int _resendCooldown = 0;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
  }

  @override
  void dispose() {
    for (var c in _controllers) c.dispose();
    for (var f in _focusNodes) f.dispose();
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
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    
    // Check if all filled
    final otp = _controllers.map((c) => c.text).join();
    if (otp.length == 6) {
      _verifyOtp(otp);
    }
  }

  Future<void> _verifyOtp(String otp) async {
    setState(() => _isLoading = true);
    
    try {
      // TODO: Implement actual OTP verification
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        if (widget.type == 'register' || widget.type == 'verify_email') {
          context.go('/auth/verify-otp?identifier=${widget.identifier}&type=verify_phone');
        } else if (widget.type == 'verify_phone') {
          context.go('/home');
        } else if (widget.type == 'reset_password') {
          context.go('/auth/reset-password?token=${_controllers.map((c) => c.text).join()}');
        } else {
          context.go('/home');
        }
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
                      
                      _buildOtpForm()
                          .animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 24),
                      
                      _buildResendSection()
                          .animate().fadeIn(duration: 600.ms, delay: 400.ms),
                      
                      const SizedBox(height: 32),
                      
                      _buildBackLink()
                          .animate().fadeIn(duration: 600.ms, delay: 600.ms),
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
        
        const SizedBox(height: 8),
        
        Text(
          _getSubtitle(),
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppTheme.textMuted),
          textAlign: TextAlign.center,
        ).animate().fadeIn(duration: 600.ms, delay: 400.ms).slideY(begin: 0.3),
      ],
    );
  }

  String _getHeaderTitle() {
    switch (widget.type) {
      case 'register': return 'Verify Your Email';
      case 'verify_email': return 'Verify Your Email';
      case 'verify_phone': return 'Verify Your Phone';
      case 'reset_password': return 'Verify Reset Code';
      case 'login': return 'Verify Login';
      default: return 'Verification';
    }
  }

  String _getSubtitle() {
    switch (widget.type) {
      case 'register': return 'Enter the 6-digit code sent to ${widget.identifier}';
      case 'verify_email': return 'Enter the 6-digit code sent to ${widget.identifier}';
      case 'verify_phone': return 'Enter the 6-digit code sent via SMS to ${widget.identifier}';
      case 'reset_password': return 'Enter the 6-digit code sent to ${widget.identifier}';
      case 'login': return 'Enter the 6-digit code sent to ${widget.identifier}';
      default: return 'Enter the 6-digit code';
    }
  }

  Widget _buildOtpForm() {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Form(
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
              'Enter the 6-digit code',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppTheme.textSecondary),
              textAlign: TextAlign.center,
            ),
            
            const SizedBox(height: 24),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(6, (index) => SizedBox(
                width: 48, height: 56,
                child: TextFormField(
                  controller: _controllers[index],
                  focusNode: _focusNodes[index],
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
                  onChanged: (value) => _onOtpChanged(index, value),
                ),
              )),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResendSection() {
    return Column(
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
          onPressed: _resendCooldown > 0 ? null : _resendOtp,
          child: Text(
            'Resend Code',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: _resendCooldown > 0 ? AppTheme.textMuted : AppTheme.primaryGlow,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBackLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        TextButton.icon(
          onPressed: () => context.go('/auth/login'),
          icon: const Icon(Icons.arrow_back, size: 20),
          label: const Text('Back to Login'),
          style: TextButton.styleFrom(
            foregroundColor: AppTheme.textMuted,
          ),
        ),
      ],
    );
  }
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