import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartNoAxesCombined, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ProgressPage({ data }) {
  const hasData = data && data.id;

  const chartData = [
    { name: 'Core Learning', value: data?.progress?.learning || 0 },
    { name: 'Projects', value: data?.progress?.projects || 0 },
    { name: 'Interview Prep', value: data?.progress?.interview || 0 }
  ];

  const completedRoadmapItems = (data?.roadmap || []).filter((item) => item.done);
  const totalRoadmapItems = (data?.roadmap || []).length;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            ANALYTICS / PROGRESS TRACKER
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Readiness & Completion Analytics
          </h1>
        </div>
        <EmptyState
          title="No Progress Recorded Yet"
          description="Run an AI job analysis and complete modules on your roadmap to track progress over time."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          ANALYTICS / PROGRESS TRACKER
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Placement Readiness & Module Completion
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time metrics calculated from your verified database progress records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placement Preparedness Card */}
        <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <TrendingUp size={18} className="text-[#2563EB]" />
                <span>Overall Placement Preparedness</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Score
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Score scales up to 100% as you complete your personalized roadmap milestones.
            </p>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  {data?.readiness || 0}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Qualified
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden mt-4 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#06B6D4] to-[#10B981] transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, data?.readiness || 0))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase">Modules Completed</div>
              <div className="font-extrabold text-slate-900 text-base mt-0.5">
                {completedRoadmapItems.length} / {totalRoadmapItems}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase">Role Target</div>
              <div className="font-extrabold text-slate-900 text-base mt-0.5 truncate">
                {data?.jobTitle || 'Target Role'}
              </div>
            </div>
          </div>
        </section>

        {/* Progress By Track Recharts Card */}
        <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <ChartNoAxesCombined size={18} className="text-[#2563EB]" />
              <span>Competency Track Breakdown (%)</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Percentage completion across curriculum learning, coding projects, and interview preparation.
          </p>

          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Completion']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Completion History Table */}
      <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm tracking-tight mb-4 flex items-center gap-2">
          <Award size={18} className="text-[#10B981]" />
          <span>Completed Milestone History</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {completedRoadmapItems.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between text-xs gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{item.category}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Persisted in DB
              </span>
            </div>
          ))}

          {completedRoadmapItems.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              No roadmap modules completed yet. Visit the Learning Roadmap page to begin check-offs.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
