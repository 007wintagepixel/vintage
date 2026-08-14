// ============================================
// Register Page Content (Client Component)
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
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Globe,
  Star,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    fullName: z.string().min(1, "Full name is required").max(100),
    email: z.string().email("Invalid email address"),
    country: z.string().length(2, "Please select a country"),
    mobileNumber: z
      .string()
      .regex(
        /^\+[1-9]\d{1,14}$/,
        "Phone number must be in E.164 format (e.g., +123****7890)",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string(),
    referralCode: z.string().max(20).optional(),
    dateOfBirth: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date of birth must be in YYYY-MM-DD format",
      ),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
    acceptPrivacy: z.literal(true, {
      errorMap: () => ({ message: "You must accept the privacy policy" }),
    }),
    acceptResponsibleGaming: z.literal(true, {
      errorMap: () => ({
        message: "You must accept responsible gaming policy",
      }),
    }),
    confirmAge: z.literal(true, {
      errorMap: () => ({ message: "You must confirm you are 18+" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const dob = new Date(data.dateOfBirth);
      const age = Math.floor(
        (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );
      return age >= 18;
    },
    {
      message: "You must be at least 18 years old",
      path: ["dateOfBirth"],
    },
  );

type RegisterFormData = z.infer<typeof registerSchema>;

const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "BR", name: "Brazil" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "OTHER", name: "Other" },
];

export default function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: email verification, 3: phone verification

  const {
    register,
    handleSubmit,
    watch,
    // setValue, // destructured but not used - TODO: use for programmatically setting values
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: true,
      acceptPrivacy: true,
      acceptResponsibleGaming: true,
      confirmAge: true,
    },
  });

  const password = watch("password");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    if (score <= 2) return { score, label: "Weak", color: "text-accent-red" };
    if (score <= 4)
      return { score, label: "Medium", color: "text-secondary-glow" };
    return { score, label: "Strong", color: "text-accent-green" };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          deviceId: "web",
          deviceName: navigator.userAgent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // Store tokens
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      setSuccess(true);
      setStep(2); // Move to email verification step
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OTP verification
    setStep(3);
  };

  const verifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OTP verification
    router.push(callbackUrl);
    router.refresh();
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="username" className="label">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("username")}
            type="text"
            id="username"
            className={`input pl-12 ${errors.username ? "input-error" : ""}`}
            placeholder="Choose a username"
            autoComplete="username"
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1.5 text-body-sm text-accent-red">
              {errors.username.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="fullName" className="label">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("fullName")}
            type="text"
            id="fullName"
            className={`input pl-12 ${errors.fullName ? "input-error" : ""}`}
            placeholder="Your full name"
            autoComplete="name"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-body-sm text-accent-red">
              {errors.fullName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("email")}
            type="email"
            id="email"
            className={`input pl-12 ${errors.email ? "input-error" : ""}`}
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1.5 text-body-sm text-accent-red">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="label">
            Country
          </label>
          <select
            {...register("country")}
            id="country"
            className={`input ${errors.country ? "input-error" : ""}`}
            disabled={isLoading}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1.5 text-body-sm text-accent-red">
              {errors.country.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="mobileNumber" className="label">
            Mobile Number
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              {...register("mobileNumber")}
              type="tel"
              id="mobileNumber"
              className={`input pl-12 ${errors.mobileNumber ? "input-error" : ""}`}
              placeholder="+123****7890"
              autoComplete="tel"
              disabled={isLoading}
            />
            {errors.mobileNumber && (
              <p className="mt-1.5 text-body-sm text-accent-red">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="label">
          Date of Birth
        </label>
        <div className="relative">
          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("dateOfBirth")}
            type="date"
            id="dateOfBirth"
            className={`input pl-12 ${errors.dateOfBirth ? "input-error" : ""}`}
            max={
              new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            disabled={isLoading}
          />
          {errors.dateOfBirth && (
            <p className="mt-1.5 text-body-sm text-accent-red">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className={`input pl-12 pr-12 ${errors.password ? "input-error" : ""}`}
            placeholder="Create a strong password"
            autoComplete="new-password"
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
        {password && (
          <div className="mt-2" data-testid="password-strength">
            <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: strength.color.replace("text-", "") }}
              />
            </div>
            <p className={`mt-1 text-body-xs ${strength.color}`}>
              Password strength: {strength.label}
            </p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            className={`input pl-12 ${errors.confirmPassword ? "input-error" : ""}`}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-body-sm text-accent-red">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="referralCode" className="label">
          Referral Code (Optional)
        </label>
        <div className="relative">
          <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            {...register("referralCode")}
            type="text"
            id="referralCode"
            className="input pl-12"
            placeholder="Enter referral code if you have one"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-surface-border pt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("acceptTerms")}
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
            required
          />
          <div className="text-body-sm text-text-secondary">
            I agree to the{" "}
            <Link href="/terms" className="text-primary-glow hover:underline">
              Terms of Service
            </Link>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("acceptPrivacy")}
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
            required
          />
          <div className="text-body-sm text-text-secondary">
            I agree to the{" "}
            <Link href="/privacy" className="text-primary-glow hover:underline">
              Privacy Policy
            </Link>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("acceptResponsibleGaming")}
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
            required
          />
          <div className="text-body-sm text-text-secondary">
            I agree to the{" "}
            <Link
              href="/responsible-gaming"
              className="text-primary-glow hover:underline"
            >
              Responsible Gaming Policy
            </Link>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("confirmAge")}
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
            required
          />
          <div className="text-body-sm text-text-secondary">
            I confirm I am <strong>18 years or older</strong>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-4 text-body-lg group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
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
        <h2 className="font-display text-heading-lg mb-2">Verify Your Email</h2>
        <p className="text-text-secondary text-body">
          We&apos;ve sent a 6-digit code to your email. Enter it below to verify
          your account.
        </p>
      </div>
      <form onSubmit={verifyEmailOtp} className="space-y-4">
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
          Verify Email
        </button>
        <p className="text-body-sm text-text-muted">
          Didn&apos;t receive the code?{" "}
          <button className="text-primary-glow hover:underline">Resend</button>
        </p>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 mx-auto rounded-full bg-accent-cyan/20 flex items-center justify-center"
      >
        <Globe className="w-8 h-8 text-accent-cyan" />
      </motion.div>
      <div>
        <h2 className="font-display text-heading-lg mb-2">Verify Your Phone</h2>
        <p className="text-text-secondary text-body">
          We&apos;ve sent a 6-digit code via SMS. Enter it below to complete
          verification.
        </p>
      </div>
      <form onSubmit={verifyPhoneOtp} className="space-y-4">
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
          Verify Phone & Continue
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-neon-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-glow/10 via-transparent to-accent-magenta/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-glow/5 rounded-full blur-3xl" />

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

      {/* Register Form */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-card-strong p-8 md:p-10 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-8">
              <Link
                href="/login"
                className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-surface-tertiary"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div className="flex-1 text-center">
                <h1 className="font-display text-heading-xl mb-1">
                  Create Account
                </h1>
                <p className="text-text-secondary text-body">
                  Join the future of Ludo gaming
                </p>
              </div>
            </div>

            {(error || success) && step === 1 && (
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
                    <span>Account created! Verify your email to continue.</span>
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-glow hover:text-primary font-medium"
              >
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
