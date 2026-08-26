'use client';
import React from 'react';

import TopNav from './TopNav';
import Dock from './Dock';
import HelpAssistant from './HelpAssistant';
import StudyTools from './StudyTools';

interface AppShellProps {
  children: React.ReactNode;
  topic?: string;
  agentStatus?: 'idle' | 'running' | 'done' | 'error';
  bouncingDockItem?: string;
}

export default function AppShell({ children, topic, agentStatus = 'idle', bouncingDockItem }: AppShellProps) {
  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #f8fafc 0%, #edf2f7 35%, #f1f5f9 70%, #e2e8f0 100%)',
      }}
    >
      {/* Ambient background blobs with Razorpay navy & emerald lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(2,132,199,0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute top-1/3 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(12,35,64,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />
      </div>

      {/* Top nav */}
      <div className="relative z-40">
        <TopNav topic={topic} agentStatus={agentStatus} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin relative z-10 pb-24">
        {children}
      </main>

      {/* Bottom Dock */}
      <Dock bouncingItem={bouncingDockItem} />

      {/* Help assistant */}
      <HelpAssistant />

      {/* Study tools */}
      <StudyTools />
    </div>
  );
}
