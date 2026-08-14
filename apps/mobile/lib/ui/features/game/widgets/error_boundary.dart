// ============================================
// Ludo Nexus - Error Boundary Widget
// ============================================

import 'package:flutter/material.dart';

typedef ErrorWidgetBuilder = Widget Function(FlutterErrorDetails details);

class ErrorBoundary extends StatefulWidget {
  final Widget child;
  final ErrorWidgetBuilder? fallbackBuilder;

  const ErrorBoundary({
    super.key,
    required this.child,
    this.fallbackBuilder,
  });

  @override
  State<ErrorBoundary> createState() => _ErrorBoundaryState();
}

class _ErrorBoundaryState extends State<ErrorBoundary> {
  FlutterErrorDetails? _errorDetails;

  @override
  void initState() {
    super.initState();
    FlutterError.onError = _handleFlutterError;
  }

  @override
  void dispose() {
    FlutterError.onError = null;
    super.dispose();
  }

  void _handleFlutterError(FlutterErrorDetails details) {
    if (mounted) {
      setState(() {
        _errorDetails = details;
      });
    }
    // Also log to console
    FlutterError.dumpErrorToConsole(details);
  }

  @override
  Widget build(BuildContext context) {
    if (_errorDetails != null) {
      if (widget.fallbackBuilder != null) {
        return widget.fallbackBuilder!(_errorDetails!);
      }
      return _defaultErrorWidget(_errorDetails!);
    }
    return widget.child;
  }

  Widget _defaultErrorWidget(FlutterErrorDetails details) {
    return Material(
      color: const Color(0xFF0C0A09),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              const Text(
                'Game Error',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Something went wrong. Your game state is saved on the server.',
                style: TextStyle(color: Colors.grey, fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: () {
                  setState(() {
                    _errorDetails = null;
                  });
                },
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF3B82F6),
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Retry',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}