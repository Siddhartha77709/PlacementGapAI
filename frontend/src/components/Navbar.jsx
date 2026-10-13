import React from 'react';
import { Menu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onOpenMobile, role = 'Software Engineer' }) {
  return (
    <header className="h-16 bg-white border-b border-[#CBD5E1] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Target Track:</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
            {role || 'Software Engineer'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span>System Active</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-slate-500">
          <Sparkles size={14} className="text-blue-600" />
          <span>AI Engine: Gemini Verified</span>
        </div>
      </div>
    </header>
  );
}
