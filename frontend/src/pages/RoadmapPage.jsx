import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ExternalLink, LoaderCircle, Sparkles, FolderGit2, Users } from 'lucide-react';
import { api } from '../api';
import EmptyState from '../components/EmptyState';

export default function RoadmapPage({ data, onCompleteItem }) {
  const [completingId, setCompletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const roadmapItems = data?.roadmap || [];

  const handleComplete = async (id) => {
    setCompletingId(id);
    setErrorMsg('');
    try {
      const updated = await api.completeItem(id);
      if (onCompleteItem) {
        onCompleteItem(updated);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to mark item complete.');
    } finally {
      setCompletingId(null);
    }
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('project')) {
      return <FolderGit2 size={16} className="text-[#06B6D4]" />;
    }
    if (cat.includes('interview')) {
      return <Users size={16} className="text-[#10B981]" />;
    }
    return <BookOpen size={16} className="text-[#2563EB]" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          CURRICULUM / LEARNING ROADMAP
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Personalized Learning & Execution Roadmap
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Step-by-step roadmap spanning core theory, hands-on portfolio projects, and technical interview preparation.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {roadmapItems.length === 0 ? (
        <EmptyState
          title="No Learning Roadmap Generated Yet"
          description="Submit a job description on the Analysis page to generate structured curriculum modules."
        />
      ) : (
        <div className="space-y-4">
          {roadmapItems.map((item, index) => {
            const isBusy = completingId === item.id;
            return (
              <div
                key={item.id || index}
                className={`bg-white border rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all ${
                  item.done ? 'border-emerald-200 bg-emerald-50/20' : 'border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      item.done
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-50 text-[#2563EB] border border-blue-100'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                        {getCategoryIcon(item.category)}
                        <span>{item.category || 'Learning'}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-sm md:text-base text-slate-900 tracking-tight">
                      {item.title}
                    </h3>

                    {item.detail && (
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {item.detail}
                      </p>
                    )}

                    {item.resource && (
                      <div className="pt-1">
                        <a
                          href={item.resource}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-blue-800 transition-colors"
                        >
                          <span>Open Resource & Documentation</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  {item.done ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleComplete(item.id)}
                      disabled={isBusy}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 active:scale-95 disabled:opacity-60 transition-all"
                    >
                      {isBusy ? (
                        <>
                          <LoaderCircle size={15} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          <span>Mark Complete</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
