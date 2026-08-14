// ============================================
// Login Page Content (Client Component)
// ============================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Dice1,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(errorParam);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: true },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
          deviceId: "web",
          deviceName: navigator.userAgent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Store tokens
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            <span className="font-display text-heading-lg gradient-text">
              Ludo Nexus
            </span>
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-card-strong p-8 md:p-10 rounded-2xl"
          >
            <div className="text-center mb-8">
              <Link
                href="/"
                className="flex items-center gap-3 justify-center mb-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
                  <Dice1 className="w-7 h-7 text-text-inverse" />
                </div>
                <span className="font-display text-heading-xl gradient-text">
                  Ludo Nexus
                </span>
              </Link>
              <h1 className="font-display text-heading-xl mb-2">
                Welcome Back
              </h1>
              <p className="text-text-secondary text-body">
                Sign in to continue your game
              </p>
            </div>

            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  success
                    ? "bg-accent-green/20 border border-accent-green/30 text-accent-green"
                    : "bg-accent-red/20 border border-accent-red/30 text-accent-red"
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Login successful! Redirecting...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </>
                )}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="label">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    {...register("identifier")}
                    type="text"
                    id="identifier"
                    className={`input pl-12 ${errors.identifier ? "input-error" : ""}`}
                    placeholder="Enter your email or username"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  {errors.identifier && (
                    <p className="mt-1.5 text-body-sm text-accent-red">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`input pl-12 pr-12 ${errors.password ? "input-error" : ""}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    disabled={isLoading}
                    data-testid="toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1.5 text-body-sm text-accent-red">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
                    className="w-4 h-4 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                  />
                  <span className="text-body-sm text-text-secondary">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-body-sm text-primary-glow hover:text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-body-lg group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-border" />
                </div>
                <div className="relative flex justify-center text-body-sm">
                  <span className="px-4 bg-background-DEFAULT text-text-muted">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="btn-ghost justify-center gap-2 border border-surface-borderGlow"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className="btn-ghost justify-center gap-2 border border-surface-borderGlow"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.05 20.19c-.98.96-2.18 1.48-3.55 1.48-2.07 0-3.76-1.43-4.29-3.41-.38-1.41-.55-2.96-.55-4.58s.17-3.16.55-4.59c.53-1.98 2.22-3.41 4.29-3.41 2.66 0 4.58 2.03 4.34 4.39-.1 1.02-.4 2.03-1.06 2.91.82-.6 1.53-1.36 2.03-2.21C21.23 9.52 19.66 8 17.3 8c-3.86 0-7 3.14-7 7s3.14 7 7 7c4.04 0 6.72-2.84 6.72-6.84 0-.46-.03-.91-.1-1.35-.96.62-1.9 1.06-2.97 1.06z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-body-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary-glow hover:text-primary font-medium"
              >
                Sign up
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
