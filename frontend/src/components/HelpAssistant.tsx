'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Info, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_AGENTS, MOCK_ASSISTANT_QA, ASSISTANT_FALLBACK } from '@/lib/mock/data';

type Tab = 'assistant' | 'about';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function matchAssistantAnswer(input: string): string {
  const normalized = input.toLowerCase();
  const hit = MOCK_ASSISTANT_QA.find((qa) =>
    qa.question
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .some((word) => normalized.includes(word))
  );
  return hit ? hit.answer : ASSISTANT_FALLBACK;
}

function AssistantTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm0', role: 'assistant', text: "Hi! I'm the RiskOS Copilot. Ask me anything about vendor risk, compliance checks, red-flag auditing, or the 3-skeptic committee." },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: matchAssistantAnswer(trimmed) },
      ]);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: 'linear-gradient(135deg, #0284c7, #1e3a8a)', color: 'white' }
                  : { background: 'rgba(2, 132, 199, 0.06)', color: '#0c2340', border: '1px solid rgba(2, 132, 199, 0.12)' }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-xl px-3 py-2 bg-slate-100">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#0284c7]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length < 3 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {MOCK_ASSISTANT_QA.map((qa) => (
            <button
              key={qa.id}
              onClick={() => send(qa.question)}
              className="text-[10px] px-2 py-1 rounded-full bg-[#0284c7]/10 hover:bg-[#0284c7]/20 text-[#0284c7] font-semibold transition-colors duration-150"
            >
              {qa.question}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 px-3 py-3 border-t border-black/6"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask RiskOS Copilot…"
          aria-label="Ask the RiskOS copilot"
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-100 outline-none focus:ring-1 focus:ring-[#0284c7]/40 text-[#0c2340] placeholder:text-[#94a3b8]"
        />
        <button
          type="submit"
          aria-label="Send"
          className="clay-btn-primary p-2 rounded-lg text-white disabled:opacity-40"
          disabled={!input.trim()}
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="overflow-y-auto scrollbar-thin px-4 py-4 h-full">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={16} className="text-[#0284c7]" />
        <span className="text-xs font-bold text-[#0c2340]">RiskOS — Track 2: AI Risk Manager</span>
      </div>
      <p className="text-xs leading-relaxed text-[#475569] mb-4">
        Autonomous multi-agent risk intelligence platform built for Razorpay. Analyzes counterparty disclosures, verifies MCA & GSTIN standing, audits contracts for liability red flags, and defends pre-flight onboarding before a 3-skeptic committee.
      </p>

      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-3">
        Multi-Agent Risk Architecture
      </p>

      <div className="space-y-2">
        {MOCK_AGENTS.map((agent, i) => (
          <React.Fragment key={agent.id}>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-start gap-3 rounded-xl p-2.5 bg-white/70 border border-slate-200"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold"
                style={{ background: `${agent.color}18`, color: agent.color }}
              >
                0{agent.stage}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#0c2340]">{agent.name}</p>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${agent.color}15`, color: agent.color }}>
                    {agent.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug">{agent.description}</p>
              </div>
            </motion.div>
            {i < MOCK_AGENTS.length - 1 && (
              <div className="flex justify-center">
                <ArrowRight size={10} className="text-[#94a3b8] rotate-90" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function HelpAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('assistant');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="RiskOS Copilot"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="absolute bottom-14 left-0 w-80 max-w-[calc(100vw-2rem)] h-[26rem] max-h-[70vh] rounded-2xl overflow-hidden flex flex-col clay-card"
            style={{
              background: 'rgba(255, 255, 255, 0.94)',
              boxShadow: '0 20px 60px rgba(12, 35, 64, 0.2), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            <div className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0 border-b border-black/6">
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                <button
                  onClick={() => setTab('assistant')}
                  aria-pressed={tab === 'assistant'}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all duration-150"
                  style={tab === 'assistant' ? { background: 'white', color: '#0c2340', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#64748b' }}
                >
                  <MessageCircle size={11} /> Copilot
                </button>
                <button
                  onClick={() => setTab('about')}
                  aria-pressed={tab === 'about'}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all duration-150"
                  style={tab === 'about' ? { background: 'white', color: '#0c2340', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#64748b' }}
                >
                  <Info size={11} /> Swarm
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="p-1 rounded-md text-[#64748b] hover:text-[#0c2340] hover:bg-black/5 transition-colors duration-150"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {tab === 'assistant' ? <AssistantTab /> : <AboutTab />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close RiskOS Copilot' : 'Open RiskOS Copilot'}
        aria-expanded={open}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: open ? 'linear-gradient(135deg, #0284c7, #1e3a8a)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          border: open ? 'none' : '1px solid rgba(2, 132, 199, 0.2)',
          boxShadow: '0 4px 16px rgba(12, 35, 64, 0.12)',
        }}
      >
        <Sparkles size={18} color={open ? 'white' : '#0284c7'} />
      </motion.button>
    </div>
  );
}

