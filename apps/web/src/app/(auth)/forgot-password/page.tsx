'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ForgotPasswordContent from './forgot-password-content';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-glow" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}