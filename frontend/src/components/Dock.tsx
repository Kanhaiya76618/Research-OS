'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  GitBranch,
  MessageSquare,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Glasses,
  Landmark,
  LayoutDashboard,
} from 'lucide-react';

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  href: string;
  color: string;
  bgColor: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'home', label: '01 Intake', icon: Home, href: '/', color: '#0284c7', bgColor: 'rgba(2,132,199,0.15)' },
  { id: 'diligence', label: '02 Diligence Trail', icon: Layers, href: '/curriculum-view', color: '#1e3a8a', bgColor: 'rgba(30,58,138,0.15)' },
  { id: 'graph', label: '03 Entity Graph', icon: GitBranch, href: '/curriculum-view#graph', color: '#0d9488', bgColor: 'rgba(13,148,136,0.15)' },
  { id: 'critic', label: '04 Red-Flags', icon: MessageSquare, href: '/curriculum-view#critique', color: '#dc2626', bgColor: 'rgba(220,38,38,0.15)' },
  { id: 'library', label: '05 Disclosures', icon: BookOpen, href: '/paper-reader', color: '#0284c7', bgColor: 'rgba(2,132,199,0.15)' },
  { id: 'preflight', label: '06 Pre-Flight', icon: ClipboardCheck, href: '/preflight', color: '#059669', bgColor: 'rgba(5,150,105,0.15)' },
  { id: 'archive', label: '07 Fraud Archive', icon: FlaskConical, href: '/archive', color: '#d97706', bgColor: 'rgba(217,119,6,0.15)' },
  { id: 'reviewer', label: '08 Auditor Dojo', icon: Glasses, href: '/reviewer', color: '#7c3aed', bgColor: 'rgba(124,58,237,0.15)' },
  { id: 'grantcraft', label: '09 Risk Panel', icon: Landmark, href: '/grantcraft', color: '#0c2340', bgColor: 'rgba(12,35,64,0.15)' },
  { id: 'dashboard', label: '10 CRO Hub', icon: LayoutDashboard, href: '/dashboard', color: '#0284c7', bgColor: 'rgba(2,132,199,0.15)' },
];

const MAGNIFICATION = 1.9;
const BASE_SIZE = 42;
const SPREAD = 90;

function DockIcon({
  item,
  mouseX,
  isActive,
  onBounce,
  samePage,
}: {
  item: DockItem;
  mouseX: number | null;
  isActive: boolean;
  onBounce: boolean;
  samePage: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCenter(rect.left + rect.width / 2);
    }
  });

  const distance = mouseX !== null ? Math.abs(mouseX - center) : SPREAD + 1;
  const scale =
    mouseX !== null
      ? Math.max(1, MAGNIFICATION - (distance / SPREAD) * (MAGNIFICATION - 1))
      : 1;

  const Icon = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (!samePage) return;
    const fragment = item.href.split('#')[1] ?? '';
    e.preventDefault();
    if (window.location.hash === (fragment ? `#${fragment}` : '')) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = fragment;
    }
  };

  return (
    <Link href={item.href} aria-label={item.label} aria-current={isActive ? 'page' : undefined} onClick={handleClick}>
      <motion.div
        ref={ref}
        className="relative flex flex-col items-center cursor-pointer group"
        animate={{
          scale: onBounce ? [1, 1.3, 0.9, 1.1, 1] : scale,
          y: onBounce ? [0, -16, 0, -8, 0] : 0,
        }}
        transition={
          onBounce
            ? { duration: 0.6, times: [0, 0.2, 0.4, 0.6, 1], type: 'tween' }
            : { type: 'spring', stiffness: 400, damping: 25 }
        }
        style={{ transformOrigin: 'bottom center' }}
      >
        {/* Tooltip */}
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#0c2340]/90 backdrop-blur-md text-white text-[10px] font-bold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 border border-white/20">
          {item.label}
        </div>

        {/* Icon container */}
        <div
          className="flex items-center justify-center rounded-2xl transition-all duration-150"
          style={{
            width: BASE_SIZE,
            height: BASE_SIZE,
            background: isActive ? item.bgColor : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isActive
              ? `1.5px solid ${item.color}50`
              : '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: isActive
              ? `0 6px 20px ${item.color}25, inset 1px 1px 2px rgba(255,255,255,0.9), inset -1px -1px 2px ${item.color}20`
              : '3px 3px 8px rgba(148,163,184,0.2), -2px -2px 6px rgba(255,255,255,0.9), inset 1px 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          <Icon
            size={19}
            className="transition-colors duration-150"
            style={{ color: isActive ? item.color : '#64748b' } as React.CSSProperties}
          />
        </div>

        {/* Active indicator dot */}
        {isActive && (
          <div
            className="w-1.5 h-1.5 rounded-full mt-1 shadow-sm"
            style={{ background: item.color }}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Dock({ bouncingItem }: { bouncingItem?: string }) {
  const pathname = usePathname();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hash, setHash] = useState('');
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        ref={dockRef}
        className="flex items-end gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(32px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 12px 40px rgba(12, 35, 64, 0.15), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {DOCK_ITEMS.map((item) => {
          const [itemPath, itemFragment] = item.href.split('#');
          const itemHash = itemFragment ? `#${itemFragment}` : '';
          const isActive = pathname === itemPath && hash === itemHash;
          return (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseX}
              isActive={isActive}
              onBounce={bouncingItem === item.id}
              samePage={pathname === itemPath}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

