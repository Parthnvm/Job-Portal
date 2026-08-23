import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Plus, Sparkles, CheckCircle2, Eye, TrendingUp } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { mockRecruiterApplicants } from '../../data/mockNotifications';
import { AIChatModal } from '../../components/common/AIChatModal';

export const RecruiterDashboardPage = () => {
  const { jobs } = useAppData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-brand-950 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Recruiter Talent Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Recruiter Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Post tech openings, rank candidates with AI ATS scores, and streamline interviews.</p>
            </div>

            <Link
              to="/recruiter/post-job"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Active Job Postings</div>
              <div className="text-2xl font-extrabold text-white mt-1">{jobs.length}</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Total Applicants</div>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">48</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">High Match Candidates</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">18 (85%+)</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Interviews Scheduled</div>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">6</div>
            </div>
          </div>

          {/* Top Candidates Ranked by AI */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Ranked Top Applicants
              </h3>
              <Link to="/recruiter/applicants" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All Applicants →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {mockRecruiterApplicants.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white text-sm">{app.name}</div>
                    <div className="text-slate-400 mt-0.5">{app.role} • {app.experience} exp</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {app.skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                      {app.matchScore}% Match ({app.atsScore}% ATS)
                    </span>
                    <Link
                      to="/recruiter/applicants"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      Review Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
