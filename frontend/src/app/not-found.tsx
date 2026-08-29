'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(145deg, #f8fafc 0%, #edf2f7 35%, #f1f5f9 70%, #e2e8f0 100%)',
      }}
    >
      <div className="clay-card max-w-md w-full p-8 text-center" style={{ background: 'rgba(255, 255, 255, 0.92)' }}>
        <div className="flex justify-center mb-4">
          <span className="text-8xl font-black text-[#0c2340]/15 tracking-tight font-mono">404</span>
        </div>

        <h2 className="text-xl font-bold text-[#0c2340] mb-2">Workstation Not Found</h2>
        <p className="text-xs text-[#64748b] mb-6 leading-relaxed">
          The requested risk report or diligence workstation does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="clay-btn-secondary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#0c2340]"
          >
            <ArrowLeft size={14} className="text-[#0284c7]" />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="clay-btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md"
          >
            <Home size={14} />
            RiskOS Home
          </button>
        </div>
      </div>
    </div>
  );
}