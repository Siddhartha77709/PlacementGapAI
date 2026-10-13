import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Sparkles, LoaderCircle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function AnalysisPage({ profile, onAnalysisComplete }) {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState(profile?.targetRole || 'Software Engineer');
  const [jobDescription, setJobDescription] = useState(
    'Java, Spring Boot, REST APIs, SQL, Git, Docker, cloud fundamentals, data structures and testing.'
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRun = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Job description is required to run the AI gap analysis.');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        resume: profile?.resumeText || '',
        skills: profile?.skills || '',
        projects: profile?.projectsText || '',
        candidateName: profile?.fullName || '',
        candidateEmail: profile?.email || ''
      };

      const result = await api.analyze(payload);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Gemini analysis failed. Please verify server connectivity and GEMINI_API_KEY.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          EVALUATION / LIVE ANALYSIS
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Analyze Target Job Opportunity
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Compare candidate evidence against employer expectations using Google Gemini AI and persist findings.
        </p>
      </div>

      {success && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-xs">Analysis Complete & Persisted!</div>
              <div className="text-[11px] text-emerald-700">Skill gaps, roadmap items, and readiness metrics have been saved to MySQL.</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/gaps')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span>View Skill Gaps</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRun} className="bg-white border border-[#CBD5E1] rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer (Java / AWS)"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Job Description / Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={10}
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste full job description, required qualifications, key competencies, tech stack..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#2563EB]" />
            <span>Profile Data Attached</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Skills attached: <span className="font-semibold text-slate-700">{profile?.skills || 'Default stack'}</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Resume attached: <span className="font-semibold text-slate-700">{profile?.resumeText ? 'Uploaded resume content' : 'No custom resume text'}</span>
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={busy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60"
          >
            {busy ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                <span>Running Gemini AI Gap Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Run AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
