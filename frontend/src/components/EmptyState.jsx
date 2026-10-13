import React from 'react';
import { NavLink } from 'react-router-dom';
import { Target, ArrowRight, UserRound } from 'lucide-react';

export default function EmptyState({
  title = "No Job Analysis Recorded Yet",
  description = "Complete your candidate profile and run an AI analysis against your target job description to generate personalized gaps and learning roadmaps.",
  actionTo = "/analysis",
  actionText = "Start Job Analysis"
}) {
  return (
    <div className="bg-white border border-[#CBD5E1] rounded-xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm my-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mx-auto mb-4">
        <Target size={28} />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-md mx-auto">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <NavLink
          to="/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-colors"
        >
          <UserRound size={15} />
          <span>Edit Profile</span>
        </NavLink>
        <NavLink
          to={actionTo}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 text-xs font-bold shadow-sm shadow-blue-500/20 transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight size={15} />
        </NavLink>
      </div>
    </div>
  );
}
