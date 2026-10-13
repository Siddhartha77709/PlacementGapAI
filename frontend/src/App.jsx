import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AnalysisPage from './pages/AnalysisPage';
import GapsPage from './pages/GapsPage';
import RoadmapPage from './pages/RoadmapPage';
import ProgressPage from './pages/ProgressPage';
import { api } from './api';

const initialData = {
  id: null,
  readiness: 0,
  skills: { total: 0, missing: 0, weak: 0, mastered: 0 },
  gaps: { missing: [], weak: [], mastered: [] },
  roadmap: [],
  progress: { learning: 0, projects: 0, interview: 0 },
  completedIds: [],
  jobTitle: 'Software Engineer'
};

export default function App() {
  const [data, setData] = useState(initialData);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    targetRole: 'Software Engineer',
    skills: 'Java, React, SQL, Git',
    resumeText: '',
    projectsText: ''
  });
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const [progressRes, profileRes] = await Promise.allSettled([
          api.getProgress(),
          api.getProfile()
        ]);

        if (!mounted) return;

        if (progressRes.status === 'fulfilled' && progressRes.value) {
          setData((prev) => ({
            ...prev,
            ...progressRes.value,
            skills: progressRes.value.skills || prev.skills,
            gaps: progressRes.value.gaps || prev.gaps,
            progress: progressRes.value.progress || prev.progress
          }));
        }

        if (profileRes.status === 'fulfilled' && profileRes.value) {
          setProfile((prev) => ({
            ...prev,
            ...profileRes.value
          }));
        }
      } catch (err) {
        console.error('Initial data fetch notice:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAnalysisComplete = (newAnalysis) => {
    setData((prev) => ({
      ...prev,
      ...newAnalysis
    }));
  };

  const handleCompleteItem = (updatedAnalysis) => {
    setData((prev) => ({
      ...prev,
      ...updatedAnalysis
    }));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#0F172A]">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
        <Navbar
          onOpenMobile={() => setMobileOpen(true)}
          role={profile.targetRole || data.jobTitle || 'Software Engineer'}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage data={data} loading={loading} />} />
            <Route
              path="/profile"
              element={<ProfilePage profile={profile} onProfileUpdate={handleProfileUpdate} />}
            />
            <Route
              path="/analysis"
              element={
                <AnalysisPage
                  profile={profile}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              }
            />
            <Route path="/gaps" element={<GapsPage data={data} />} />
            <Route
              path="/roadmap"
              element={<RoadmapPage data={data} onCompleteItem={handleCompleteItem} />}
            />
            <Route path="/progress" element={<ProgressPage data={data} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
