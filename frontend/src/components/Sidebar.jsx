import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserRound,
  Target,
  AlertTriangle,
  Map,
  ChartNoAxesCombined,
  Sparkles,
  X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My Profile / Resume', icon: UserRound },
  { to: '/analysis', label: 'Job Analysis', icon: Target },
  { to: '/gaps', label: 'Skill Gap Report', icon: AlertTriangle },
  { to: '/roadmap', label: 'Learning Roadmap', icon: Map },
  { to: '/progress', label: 'Progress Tracker & Reports', icon: ChartNoAxesCombined },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-200 p-5 flex flex-col transition-transform duration-300 md:translate-x-0 border-r border-slate-800 shadow-xl md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#10B981] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-cyan-500/20">
              P
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-none">PlacementGap AI</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Bridge skills. Build futures.</div>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Section header */}
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 mb-2">
          WORKSPACE
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom card */}
        <div className="mt-auto pt-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1E3A8A]/60 to-[#0F172A] border border-blue-900/40 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
              <Sparkles size={15} />
              <span>Placement Intelligence</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Targeted skill insights powered by Google Gemini and persistent analytics.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
