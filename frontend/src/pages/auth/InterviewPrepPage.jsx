import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Sparkles, Code, Users, BrainCircuit, Layers, Terminal, ArrowRight, Play } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { interviewCategories } from '../../data/mockInterview';
import { AIChatModal } from '../../components/common/AIChatModal';

export const InterviewPrepPage = () => {
  const navigate = useNavigate();

  const iconMap = {
    Code: Code,
    Users: Users,
    BrainCircuit: BrainCircuit,
    Layers: Layers,
    Terminal: Terminal
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-purple-950 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>AI Interview Simulator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Interview Preparation Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Practice role-specific technical and behavioral questions with instant AI feedback.</p>
            </div>

            <button
              onClick={() => navigate('/interview/mock')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-bold text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Full AI Mock Interview</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Interview Readiness</div>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">74%</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Questions Practiced</div>
              <div className="text-2xl font-extrabold text-white mt-1">42</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Average AI Rating</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">8.2 / 10</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs text-slate-400">Weak Topics</div>
              <div className="text-xs font-bold text-rose-300 mt-2">System Design, Pacing</div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewCategories.map((cat) => {
              const Icon = iconMap[cat.icon] || Code;
              return (
                <div key={cat.id} className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      {cat.recommended && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          Recommended
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{cat.count} Questions in Question Bank</p>
                  </div>

                  <Link
                    to={`/interview/mock?category=${cat.id}`}
                    className="w-full py-2.5 text-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Practice Category</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </Link>
                </div>
              );
            })}
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
