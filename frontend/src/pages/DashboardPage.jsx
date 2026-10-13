import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, AlertTriangle, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import EmptyState from '../components/EmptyState';

export default function DashboardPage({ data, loading }) {
  const hasAnalysis = data && data.id && data.skills && data.skills.total > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          PLACEMENT INTELLIGENCE / WORKSPACE
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Build your placement advantage.
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          A focused view of readiness, skill gaps, and next best career actions.
        </p>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#102E67] via-[#075985] to-[#10B981] rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-200 text-xs font-bold tracking-wide">
            <Sparkles size={13} className="text-cyan-300" />
            <span>AI-POWERED CAREER PLANNING</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
            {hasAnalysis ? `Aligned to: ${data.jobTitle || 'Target Role'}` : 'Your skills, aligned to your dream role.'}
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            {hasAnalysis
              ? `You currently match ${data.readiness}% of target job competencies. Complete recommended roadmap modules to reach full placement preparedness.`
              : 'Analyze a target job, uncover high-priority missing and weak competencies, and follow a roadmap tailored to your profile.'}
          </p>
          <div className="pt-2">
            <NavLink
              to="/analysis"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-transform active:scale-95"
            >
              <span>{hasAnalysis ? 'Re-run Job Analysis' : 'Run Job Analysis'}</span>
              <ArrowUpRight size={16} />
            </NavLink>
          </div>
        </div>

        <div className="shrink-0 bg-slate-900/40 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <ScoreGauge score={data?.readiness || 0} size={130} />
        </div>
      </section>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Skills</span>
          <div className="text-2xl md:text-3xl font-extrabold text-[#2563EB] mt-2">
            {data?.skills?.total || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Evaluated from job spec</span>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Missing Skills</span>
          <div className="text-2xl md:text-3xl font-extrabold text-[#EF4444] mt-2">
            {data?.skills?.missing || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Critical placement gaps</span>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Weak Skills</span>
          <div className="text-2xl md:text-3xl font-extrabold text-[#F59E0B] mt-2">
            {data?.skills?.weak || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Needs practical practice</span>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Mastered Skills</span>
          <div className="text-2xl md:text-3xl font-extrabold text-[#10B981] mt-2">
            {data?.skills?.mastered || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Profile confirmed strong</span>
        </div>
      </div>

      {!hasAnalysis ? (
        <EmptyState
          title="No Analysis Completed Yet"
          description="Your dashboard metrics and gap previews will appear once you submit a job description for AI evaluation."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority Skill Gaps */}
          <section className="bg-white border border-[#CBD5E1] rounded-xl p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <AlertTriangle size={17} className="text-[#EF4444]" />
                <span>Priority Skill Gaps</span>
              </h3>
              <NavLink to="/gaps" className="text-xs font-bold text-[#2563EB] hover:underline">
                View all ({data?.gaps?.missing?.length || 0}) ↗
              </NavLink>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {(data?.gaps?.missing || []).slice(0, 5).map((skill) => (
                <div key={skill} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>{skill}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
                    Missing
                  </span>
                </div>
              ))}
              {(!data?.gaps?.missing || data.gaps.missing.length === 0) && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No missing skill gaps detected! Great job.
                </div>
              )}
            </div>
          </section>

          {/* Roadmap Preview */}
          <section className="bg-white border border-[#CBD5E1] rounded-xl p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <BookOpen size={17} className="text-[#2563EB]" />
                <span>Roadmap Next Steps</span>
              </h3>
              <NavLink to="/roadmap" className="text-xs font-bold text-[#2563EB] hover:underline">
                View Roadmap ({data?.roadmap?.length || 0}) ↗
              </NavLink>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {(data?.roadmap || []).slice(0, 5).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.category}</div>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.done
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {item.done ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
              {(!data?.roadmap || data.roadmap.length === 0) && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No roadmap items generated yet.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
