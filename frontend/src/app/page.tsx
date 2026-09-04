'use client';
import React from 'react';
import AppShell from '@/components/AppShell';
import HeroLandingPage from './components/HeroLandingPage';
import SearchHero from './components/SearchHero';
import RecentWorkspaces from './components/RecentWorkspaces';
import FeaturedTopics from './components/FeaturedTopics';
import KeyboardShortcutsPanel from './components/KeyboardShortcutsPanel';

export default function HomePage() {
  return (
    <AppShell topic="Enterprise Counterparty Risk Intake" agentStatus="idle">
      <div className="relative min-h-full pb-20">
        {/* World-Class Hero & Landing Showcase */}
        <HeroLandingPage />

        {/* Live Interactive Intake & Discovery Modules */}
        <div id="search" className="relative z-10 max-w-screen-xl mx-auto px-5 lg:px-8 py-10 border-t border-slate-200/80 mt-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-sky-50 text-[#0284c7] border border-sky-200">
              STATION 01 · INTAKE & INGESTION
            </span>
            <h2 className="text-2xl font-black text-[#0c2340] tracking-tight mt-2">
              Ingest Counterparty via GSTIN or Domain
            </h2>
          </div>
          <SearchHero />
          <RecentWorkspaces />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
            <div className="xl:col-span-2">
              <FeaturedTopics />
            </div>
            <div>
              <KeyboardShortcutsPanel />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}