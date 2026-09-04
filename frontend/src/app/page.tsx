'use client';
import React from 'react';
import HeroLandingPage from './components/HeroLandingPage';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#0c2340] selection:bg-sky-500 selection:text-white flex flex-col">
      <main className="flex-1 w-full">
        <HeroLandingPage />
      </main>

      {/* Landing Page Clean Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0c2340]">RiskOS</span>
            <span>· Built for Razorpay Hackathon (Track 2: AI Risk Manager)</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Policy: RiskAuditor-7B-RLVR</span>
            <span>·</span>
            <span>100% Verifiable Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}