import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, TrendingUp, Sliders, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { JobCard } from '../../components/jobs/JobCard';
import { AIChatModal } from '../../components/common/AIChatModal';

export const AIRecommendationsPage = () => {
  const { jobs } = useAppData();

  const recommendations = jobs.map((j) => ({
    ...j,
    reasons: [
      "✓ React.js & JavaScript experience matched",
      "✓ Target salary range & MERN project history",
      "✓ Preferred location match (Bengaluru / Hybrid)",
      "✓ High ATS resume parser score"
    ]
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>AI Neural Recommendation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Jobs Recommended For You</h1>
              <p className="text-xs text-slate-400 mt-1">Ranked by real-time career profile, skill overlap, and resume ATS compatibility.</p>
            </div>

            <Link
              to="/skills/gap-analysis"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <Sliders className="w-4 h-4" />
              <span>Improve Match Score</span>
            </Link>
          </div>

          {/* Recommendation List */}
          <div className="space-y-6">
            {recommendations.map((job) => (
              <div key={job.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 p-1" />
                    <div>
                      <h3 className="text-base font-bold text-white">{job.title}</h3>
                      <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="px-4 py-1.5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold text-sm border border-emerald-500/40">
                      {job.matchScore}% AI Match
                    </div>
                    <Link to={`/jobs/${job.id}`} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold">
                      View Job Match
                    </Link>
                  </div>
                </div>

                {/* Explanation block */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 block mb-2">Why this job was recommended for you:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    {job.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
