import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserRound, Save, ArrowRight, CheckCircle2, AlertCircle, LoaderCircle } from 'lucide-react';
import { api } from '../api';

export default function ProfilePage({ profile, onProfileUpdate }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    targetRole: 'Software Engineer',
    skills: 'Java, React, SQL, Git',
    resumeText: '',
    projectsText: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        ...profile,
        skills: profile.skills || prev.skills
      }));
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const saved = await api.saveProfile(form);
      if (onProfileUpdate) onProfileUpdate(saved);
      setSuccessMsg('Candidate profile successfully persisted in the database!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          WORKSPACE / PROFILE CONFIGURATION
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Candidate Profile & Credentials
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Provide your background, self-rated skills, and resume text to give Gemini context for gap analysis.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#CBD5E1] rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName || ''}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Alex Johnson"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. alex@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Career Role
          </label>
          <input
            type="text"
            value={form.targetRole || ''}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            placeholder="e.g. Full Stack Java Developer"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Self-Rated Competencies (Comma-separated)
          </label>
          <input
            type="text"
            value={form.skills || ''}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="Java, Spring Boot, React, SQL, Git, REST APIs"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            List skills you currently possess or have practical experience with.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Resume / Experience Summary
          </label>
          <textarea
            rows={7}
            value={form.resumeText || ''}
            onChange={(e) => setForm({ ...form, resumeText: e.target.value })}
            placeholder="Paste your resume text, summary of internships, education, and technical background..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Projects & Practical Work
          </label>
          <textarea
            rows={4}
            value={form.projectsText || ''}
            onChange={(e) => setForm({ ...form, projectsText: e.target.value })}
            placeholder="Key projects built: tech stack used, architecture decisions, GitHub or live links..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Profile to Database</span>
              </>
            )}
          </button>

          <NavLink
            to="/analysis"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:underline"
          >
            <span>Proceed to Job Analysis</span>
            <ArrowRight size={14} />
          </NavLink>
        </div>
      </form>
    </div>
  );
}
