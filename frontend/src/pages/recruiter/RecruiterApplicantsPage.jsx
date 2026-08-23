import React, { useState } from 'react';
import { Users, Sparkles, CheckCircle2, XCircle, Search, Filter, FileText } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { mockRecruiterApplicants } from '../../data/mockNotifications';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const RecruiterApplicantsPage = () => {
  const { addToast } = useToast();
  const [applicants, setApplicants] = useState(mockRecruiterApplicants);
  const [filterScore, setFilterScore] = useState(0);

  const handleShortlist = (name) => {
    addToast(`Candidate "${name}" shortlisted for interview screening!`, 'success');
  };

  const handleReject = (name) => {
    addToast(`Candidate "${name}" marked as rejected.`, 'info');
  };

  const filtered = applicants.filter((a) => a.matchScore >= filterScore);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-400" />
                Applicant Ranking & Screening
              </h1>
              <p className="text-xs text-slate-400 mt-1">Review candidates pre-ranked by CareerAI resume compatibility algorithms.</p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Filter Min AI Match:</span>
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value={0}>All Applicants</option>
                <option value={80}>High Match (&gt;80%)</option>
                <option value={90}>Top Tier (&gt;90%)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((app) => (
              <div key={app.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{app.name}</h3>
                    <p className="text-slate-400 mt-0.5">{app.role} • {app.education} • Applied for: <strong className="text-slate-200">{app.jobTitle}</strong></p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 font-extrabold text-xs border border-emerald-500/40">
                      {app.matchScore}% Match ({app.atsScore}% ATS)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">Detected Candidate Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.skills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">Resume File:</span>
                    <div className="flex items-center space-x-2 text-indigo-400">
                      <FileText className="w-4 h-4" />
                      <span className="underline font-semibold">{app.resumeName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
                  <button
                    onClick={() => handleReject(app.name)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 font-semibold"
                  >
                    Reject Candidate
                  </button>

                  <button
                    onClick={() => handleShortlist(app.name)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                  >
                    Shortlist Candidate
                  </button>
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
