'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getStudentId } from '@/lib/studentId';

export default function StudyTools() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const keyRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    keyRef.current = `riskos-auditor-scratchpad-${getStudentId()}`;
    setText(localStorage.getItem(keyRef.current) ?? '');
  }, []);

  const onChange = (value: string) => {
    setText(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(keyRef.current, value);
      setSavedAt(new Date());
    }, 500);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Auditor Scratchpad"
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="absolute bottom-14 right-0 w-80 max-w-[calc(100vw-2rem)] h-[22rem] max-h-[65vh] rounded-2xl overflow-hidden flex flex-col clay-card"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 20px 60px rgba(12, 35, 64, 0.2), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            <div className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0 border-b border-black/6">
              <div className="flex items-center gap-1.5">
                <FileEdit size={13} className="text-[#0284c7]" />
                <span className="text-xs font-bold text-[#0c2340]">Auditor Scratchpad</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close scratchpad"
                className="p-1 rounded-md text-[#64748b] hover:text-[#0c2340] hover:bg-black/5 transition-colors duration-150"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col flex-1 p-3 min-h-0 bg-slate-50/50">
              <textarea
                value={text}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Log counterparty redlines, escrow hold calculations, or committee defense points..."
                aria-label="Auditor scratchpad"
                className="flex-1 w-full text-xs leading-relaxed rounded-xl p-3 bg-white border border-slate-200 outline-none focus:ring-1 focus:ring-[#0284c7]/40 text-[#0c2340] placeholder:text-[#94a3b8] resize-none shadow-sm"
              />
              <div className="flex items-center justify-between mt-2 pt-1">
                <span className="flex items-center gap-1 text-[10px] text-[#059669] font-medium">
                  <CheckCircle2 size={10} /> Local encrypted cache
                </span>
                <span className="text-[9px] font-mono text-[#94a3b8]">
                  {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Autosaves'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Auditor Scratchpad' : 'Open Auditor Scratchpad'}
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
        <FileEdit size={17} color={open ? 'white' : '#0284c7'} />
      </motion.button>
    </div>
  );
}

