import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function GapsPage({ data }) {
  const hasGaps =
    data &&
    data.gaps &&
    ((data.gaps.missing && data.gaps.missing.length > 0) ||
      (data.gaps.weak && data.gaps.weak.length > 0) ||
      (data.gaps.mastered && data.gaps.mastered.length > 0));

  if (!hasGaps) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            DIAGNOSTICS / SKILL ASSESSMENT
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Skill Gap Classification
          </h1>
        </div>
        <EmptyState
          title="No Skill Gaps to Display"
          description="Submit a job description on the Analysis page to compare candidate credentials and classify missing, weak, and mastered competencies."
        />
      </div>
    );
  }

  const columns = [
    {
      title: 'Missing Skills',
      count: data.gaps?.missing?.length || 0,
      skills: data.gaps?.missing || [],
      priority: 'HIGH PRIORITY',
      proficiency: 'Proficiency target: Intermediate',
      borderClass: 'border-red-200',
      headerBg: 'bg-red-50 text-red-900',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      icon: ShieldAlert,
      iconColor: '#EF4444'
    },
    {
      title: 'Weak Skills',
      count: data.gaps?.weak?.length || 0,
      skills: data.gaps?.weak || [],
      priority: 'MEDIUM PRIORITY',
      proficiency: 'Proficiency target: Advanced',
      borderClass: 'border-amber-200',
      headerBg: 'bg-amber-50 text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: AlertCircle,
      iconColor: '#F59E0B'
    },
    {
      title: 'Mastered Skills',
      count: data.gaps?.mastered?.length || 0,
      skills: data.gaps?.mastered || [],
      priority: 'VALIDATED',
      proficiency: 'Proficiency target: Maintained',
      borderClass: 'border-emerald-200',
      headerBg: 'bg-emerald-50 text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      iconColor: '#10B981'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          DIAGNOSTICS / SKILL ASSESSMENT
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Skill Gap Classification Report
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Competencies grouped by verified candidate proficiency versus role expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.title}
              className={`bg-white border ${col.borderClass} rounded-2xl shadow-xs overflow-hidden flex flex-col`}
            >
              <div className={`p-4 border-b ${col.borderClass} ${col.headerBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <Icon size={18} color={col.iconColor} />
                  <h3 className="font-bold text-sm tracking-tight">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-white/80 shadow-xs">
                  {col.count}
                </span>
              </div>

              <div className="p-4 flex-1 divide-y divide-slate-100">
                {col.skills.map((skill, idx) => {
                  const skillLabel = typeof skill === 'object' ? (skill.skill || skill.name || '') : String(skill || '');
                  return (
                    <div key={skillLabel || idx} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">{skillLabel}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${col.badgeClass}`}>
                          {col.priority}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">{col.proficiency}</div>
                    </div>
                  );
                })}

                {col.skills.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    No skills in this category.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
