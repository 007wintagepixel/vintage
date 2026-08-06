// ============================================
// Forgot Password Content (Client Component)
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Dice1, Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const forgotSchema = z.object({
  identifier: z.string().email('Please enter a valid email address'),
});

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ForgotFormData = z.infer<typeof forgotSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/login';
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password

  const forgotForm = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const watch = resetForm.watch;

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: data.identifier }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset email');
      }

      setSuccess(true);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OTP verification
    setStep(3);
  };

  const resetPassword = async (data: ResetFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?reset=success');
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={forgotForm.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="identifier" className="label">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...forgotForm.register('identifier')}
            type="email"
            id="identifier"
            className={`input pl-12 ${forgotForm.formState.errors.identifier ? 'input-error' : ''}`}
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isLoading}
          />
          {forgotForm.formState.errors.identifier && (
            <p className="mt-1.5 text-body-sm text-accent-red">{forgotForm.formState.errors.identifier.message}</p>
          )}
        </div>
      </div>

      <p className="text-body-sm text-text-secondary text-center">
        We&apos;ll send a 6-digit verification code to this email address.
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-4 text-body-lg group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending Code...</span>
          </>
        ) : (
          <>
            <span>Send Reset Code</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 mx-auto rounded-full bg-primary-glow/20 flex items-center justify-center"
      >
        <Mail className="w-8 h-8 text-primary-glow" />
      </motion.div>
      <div>
        <h2 className="font-display text-heading-lg mb-2">Check Your Email</h2>
        <p className="text-text-secondary text-body">
          We&apos;ve sent a 6-digit code to your email. Enter it below to continue.
        </p>
      </div>
      <form onSubmit={verifyOtp} className="space-y-4">
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center text-2xl font-medium input"
              placeholder=""
              autoComplete="one-time-code"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3"
        >
          Verify Code
        </button>
        <p className="text-body-sm text-text-muted">
          Didn&apos;t receive the code? <button className="text-primary-glow hover:underline">Resend</button>
        </p>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <form onSubmit={resetForm.handleSubmit(resetPassword)} className="space-y-6">
      <div>
        <label htmlFor="password" className="label">
          New Password
        </label>
        <div className="relative">
          <input
            {...resetForm.register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`input ${resetForm.formState.errors.password ? 'input-error' : ''}`}
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            disabled={isLoading}
          >
            {showPassword ? '👁️' : '🔒'}
          </button>
          {resetForm.formState.errors.password && (
            <p className="mt-1.5 text-body-sm text-accent-red">{resetForm.formState.errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            {...resetForm.register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === watch('password') || 'Passwords do not match',
            })}
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            className={`input ${resetForm.formState.errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {resetForm.formState.errors.confirmPassword && (
            <p className="mt-1.5 text-body-sm text-accent-red">{resetForm.formState.errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-4 text-body-lg group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Resetting Password...</span>
          </>
        ) : (
          <>
            <span>Reset Password</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-neon-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-glow/10 via-transparent to-accent-magenta/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-3xl animate-float-slow" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-surface-border mx-4 mt-4 rounded-xl max-w-7xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
              <Dice1 className="w-6 h-6 text-text-inverse" />
            </div>
            <span className="font-display text-heading-lg gradient-text">Ludo Nexus</span>
          </Link>
        </div>
      </nav>

      {/* Forgot Password Form */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="glass-card-strong p-8 md:p-10 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-8">
              <Link href="/login" className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-surface-tertiary">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1 text-center">
                <h1 className="font-display text-heading-xl mb-1">Forgot Password?</h1>
                <p className="text-text-secondary text-body">Enter your email to reset your password</p>
              </div>
            </div>

            {(error || success) && step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  success 
                    ? 'bg-accent-green/20 border border-accent-green/30 text-accent-green' 
                    : 'bg-accent-red/20 border border-accent-red/30 text-accent-red'
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Reset code sent! Check your email.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </>
                )}
              </motion.div>
            )}

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <p className="mt-8 text-center text-body-sm text-text-muted">
              Remember your password?{' '}
              <Link href="/login" className="text-primary-glow hover:text-primary font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-body-sm text-text-muted">
          <p>© 2024 Ludo Nexus. Demo mode only. Play responsibly.</p>
        </div>
      </footer>
    </div>
  );
}