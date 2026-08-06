// ============================================
// Register Screen
// ============================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/widgets/app_widgets.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _mobileController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _referralController = TextEditingController();
  final _dobController = TextEditingController();
  
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  String? _error;
  String _selectedCountry = 'US';
  DateTime? _selectedDob;

  final List<Map<String, String>> _countries = [
    {'code': 'US', 'name': 'United States (+1)'},
    {'code': 'IN', 'name': 'India (+91)'},
    {'code': 'GB', 'name': 'United Kingdom (+44)'},
    {'code': 'CA', 'name': 'Canada (+1)'},
    {'code': 'AU', 'name': 'Australia (+61)'},
    {'code': 'DE', 'name': 'Germany (+49)'},
    {'code': 'FR', 'name': 'France (+33)'},
    {'code': 'BR', 'name': 'Brazil (+55)'},
    {'code': 'JP', 'name': 'Japan (+81)'},
    {'code': 'SG', 'name': 'Singapore (+65)'},
    {'code': 'AE', 'name': 'UAE (+971)'},
    {'code': 'OTHER', 'name': 'Other'},
  ];

  @override
  void dispose() {
    _usernameController.dispose();
    _fullNameController.dispose();
    _emailController.dispose();
    _mobileController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _referralController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  String? _getPasswordStrength(String password) {
    if (password.isEmpty) return null;
    int score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (RegExp(r'[A-Z]').hasMatch(password)) score++;
    if (RegExp(r'[a-z]').hasMatch(password)) score++;
    if (RegExp(r'\d').hasMatch(password)) score++;
    if (RegExp(r'[@$!%*?&]').hasMatch(password)) score++;
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  }

  Color _getStrengthColor(String? strength) {
    switch (strength) {
      case 'Weak': return AppTheme.accentRed;
      case 'Medium': return AppTheme.secondaryGlow;
      case 'Strong': return AppTheme.accentGreen;
      default: return AppTheme.textMuted;
    }
  }

  Future<void> _selectDateOfBirth() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 18 * 365)),
      firstDate: DateTime(1900),
      lastDate: DateTime.now().subtract(const Duration(days: 18 * 365)),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: Theme.of(context).colorScheme.copyWith(
            primary: AppTheme.primaryDefault,
            onPrimary: AppTheme.textInverse,
            onSurface: AppTheme.textPrimary,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null && mounted) {
      setState(() {
        _selectedDob = picked;
        _dobController.text = '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      });
    }
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedDob == null) {
      setState(() => _error = 'Please select your date of birth');
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      // TODO: Implement actual registration API call
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        context.go('/auth/verify-otp?identifier=${_emailController.text}&type=register');
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
    final strength = _getPasswordStrength(_passwordController.text);
    final strengthColor = _getStrengthColor(strength);
    final strengthPercent = strength == 'Weak' ? 0.33 : strength == 'Medium' ? 0.66 : 1.0;

    return Scaffold(
      body: Stack(
        children: [
          // Background
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
                      // Header
                      _buildHeader()
                          .animate()
                          .fadeIn(duration: 600.ms)
                          .slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 32),
                      
                      // Register Form
                      _buildRegisterForm()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 200.ms)
                          .slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 24),
                      
                      // Terms
                      _buildTerms()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 400.ms),
                      
                      const SizedBox(height: 24),
                      
                      // Register Button
                      _buildRegisterButton()
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 500.ms)
                          .slideY(begin: 0.2, end: 0),
                      
                      const SizedBox(height: 24),
                      
                      // Login Link
                      _buildLoginLink()
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
          child: CustomPaint(painter: _MeshGradientPainter()),
        ),
        Positioned(
          top: -100, left: -100,
          child: Container(
            width: 300, height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(colors: [
                AppTheme.primaryGlow.withValues(alpha: 0.15), Colors.transparent
              ]),
            ),
          ).animate().scale(duration: 2000.ms, curve: Curves.easeInOut),
        ),
        Positioned(
          bottom: -100, right: -100,
          child: Container(
            width: 300, height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(colors: [
                AppTheme.accentMagenta.withValues(alpha: 0.1), Colors.transparent
              ]),
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
          width: 80, height: 80,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: AppTheme.primaryGradient,
            boxShadow: [BoxShadow(
              color: AppTheme.primaryGlow.withValues(alpha: 0.5),
              blurRadius: 30, spreadRadius: 0,
            )],
          ),
          child: const Icon(Icons.casino, size: 48, color: AppTheme.textInverse),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        
        const SizedBox(height: 16),
        
        ShaderMask(
          shaderCallback: (bounds) => AppTheme.accentGradient.createShader(bounds),
          child: Text(
            AppConstants.appName,
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700, color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
        ).animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 8),
        
        Text(
          'Create your account',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: AppTheme.textSecondary,
          ),
          textAlign: TextAlign.center,
        ).animate().fadeIn(duration: 600.ms, delay: 300.ms).slideY(begin: 0.3),
      ],
    );
  }

  Widget _buildRegisterForm() {
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

            // Username
            AppTextField(
              controller: _usernameController,
              label: 'Username',
              hintText: 'Choose a username',
              prefixIcon: Icons.person_outline,
              validator: (v) => v == null || v.isEmpty ? 'Username required' : 
                  v.length < 3 ? 'Min 3 characters' : 
                  v.length > 20 ? 'Max 20 characters' :
                  !RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(v) ? 'Letters, numbers, _ only' : null,
            ),
            const SizedBox(height: 16),

            // Full Name
            AppTextField(
              controller: _fullNameController,
              label: 'Full Name',
              hintText: 'Your full name',
              prefixIcon: Icons.badge_outlined,
              validator: (v) => v == null || v.isEmpty ? 'Full name required' : null,
            ),
            const SizedBox(height: 16),

            // Email
            AppTextField(
              controller: _emailController,
              label: 'Email',
              hintText: 'your@email.com',
              prefixIcon: Icons.alternate_email,
              keyboardType: TextInputType.emailAddress,
              validator: (v) => v == null || v.isEmpty ? 'Email required' :
                  !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(v) ? 'Invalid email' : null,
            ),
            const SizedBox(height: 16),

            // Country & Mobile
            Row(children: [
              Expanded(
                flex: 2,
                child: DropdownButtonFormField<String>(
                  value: _selectedCountry,
                  decoration: InputDecoration(
                    labelText: 'Country',
                    prefixIcon: Icon(Icons.flag, color: AppTheme.textMuted),
                    filled: true,
                    fillColor: AppTheme.backgroundTertiary,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                      borderSide: BorderSide(color: AppTheme.surfaceBorder),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                      borderSide: BorderSide(color: AppTheme.surfaceBorder),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
                      borderSide: BorderSide(color: AppTheme.primaryDefault, width: 2),
                    ),
                  ),
                  items: _countries.map((c) => DropdownMenuItem(
                    value: c['code'], child: Text(c['name']!),
                  )).toList(),
                  onChanged: (v) => setState(() => _selectedCountry = v!),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 3,
                child: AppTextField(
                  controller: _mobileController,
                  label: 'Mobile',
                  hintText: '+1234567890',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: (v) => v == null || v.isEmpty ? 'Mobile required' :
                      !RegExp(r'^\+[1-9]\d{1,14}$').hasMatch(v) ? 'E.164 format (+1234567890)' : null,
                ),
              ),
            ]),
            const SizedBox(height: 16),

            // Date of Birth
            AppTextField(
              controller: _dobController,
              label: 'Date of Birth',
              hintText: 'YYYY-MM-DD',
              prefixIcon: Icons.cake_outlined,
              readOnly: true,
              onTap: _selectDateOfBirth,
              suffixIcon: Icon(Icons.calendar_today, color: AppTheme.textMuted, size: 20),
              validator: (v) => _selectedDob == null ? 'Select date of birth' :
                  DateTime.now().difference(_selectedDob!).inDays < 18 * 365 ? 'Must be 18+' : null,
            ),
            const SizedBox(height: 16),

            // Password
            AppTextField(
              controller: _passwordController,
              label: 'Password',
              hintText: 'Create a strong password',
              prefixIcon: Icons.lock_outline,
              obscureText: _obscurePassword,
              suffixIcon: IconButton(
                icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: AppTheme.textMuted),
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              ),
              onChanged: (v) => setState(() {}),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Password required';
                if (v.length < 8) return 'Min 8 characters';
                if (!RegExp(r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])').hasMatch(v)) {
                  return 'Need upper, lower, number, special char';
                }
                return null;
              },
            ),
            
            // Password Strength
            if (_passwordController.text.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LinearProgressIndicator(
                      value: strength == 'Weak' ? 0.33 : strength == 'Medium' ? 0.66 : 1.0,
                      backgroundColor: AppTheme.backgroundTertiary,
                      valueColor: AlwaysStoppedAnimation(strengthColor),
                      minHeight: 4,
                      borderRadius: BorderRadius.circular(2),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Password strength: $strength',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(color: strengthColor),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 300.ms),

            const SizedBox(height: 16),

            // Confirm Password
            AppTextField(
              controller: _confirmPasswordController,
              label: 'Confirm Password',
              hintText: 'Confirm your password',
              prefixIcon: Icons.lock_outline,
              obscureText: _obscureConfirmPassword,
              suffixIcon: IconButton(
                icon: Icon(_obscureConfirmPassword ? Icons.visibility_off : Icons.visibility, color: AppTheme.textMuted),
                onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
              ),
              validator: (v) => v != _passwordController.text ? 'Passwords do not match' : null,
            ),
            const SizedBox(height: 16),

            // Referral Code
            AppTextField(
              controller: _referralController,
              label: 'Referral Code (Optional)',
              hintText: 'Enter referral code',
              prefixIcon: Icons.card_giftcard_outlined,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTerms() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildCheckbox('acceptTerms', 'I agree to the Terms of Service', '/terms'),
        _buildCheckbox('acceptPrivacy', 'I agree to the Privacy Policy', '/privacy'),
        _buildCheckbox('acceptGaming', 'I agree to Responsible Gaming Policy', '/responsible-gaming'),
        _buildCheckbox('confirmAge', 'I confirm I am 18 years or older', null),
      ],
    );
  }

  Widget _buildCheckbox(String key, String text, String? link) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Checkbox(
            value: true,
            onChanged: (v) {},
            activeColor: AppTheme.primaryDefault,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
          ),
          Expanded(
            child: GestureDetector(
              onTap: link != null ? () => context.push(link) : null,
              child: RichText(
                text: TextSpan(
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.textSecondary),
                  children: [
                    TextSpan(text: 'I '),
                    TextSpan(text: text.replaceFirst('I agree to ', '').replaceFirst('I confirm ', ''),
                      style: TextStyle(
                        color: link != null ? AppTheme.primaryGlow : AppTheme.textSecondary,
                        fontWeight: FontWeight.w600,
                        decoration: link != null ? TextDecoration.underline : null,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterButton() {
    return GradientButton(
      onPressed: _isLoading ? null : _handleRegister,
      isLoading: _isLoading,
      text: 'Create Account',
      icon: Icons.person_add,
      gradient: AppTheme.primaryGradient,
    );
  }

  Widget _buildLoginLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text("Already have an account? ",
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppTheme.textSecondary)),
        TextButton(
          onPressed: () => context.go('/auth/login'),
          child: Text('Sign in',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.primaryGlow, fontWeight: FontWeight.w600)),
        ),
      ],
    );
  }
}

// Background Painter
class _MeshGradientPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;
    paint.shader = RadialGradient(
      center: Alignment.topLeft, radius: 1.5,
      colors: [AppTheme.primaryGlow.withValues(alpha: 0.08), Colors.transparent],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
    paint.shader = RadialGradient(
      center: Alignment.bottomRight, radius: 1.2,
      colors: [AppTheme.accentMagenta.withValues(alpha: 0.06), Colors.transparent],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
    paint.shader = RadialGradient(
      center: Alignment.center, radius: 0.8,
      colors: [AppTheme.secondaryGlow.withValues(alpha: 0.04), Colors.transparent],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }
  @override bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}