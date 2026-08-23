import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Award, CheckCircle2, TrendingUp, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const InterviewResultsPage = () => {
  const { interviewHistory } = useAppData();
  const latestResult = interviewHistory[0] || {
    score: 82,
    technicalScore: 85,
    communicationScore: 78,
    problemSolvingScore: 84,
    confidenceScore: 80,
    feedback: "Strong technical accuracy on React components and Node.js concepts.",
    strongAreas: ["React Hooks", "REST API Architecture", "Node.js Event Loop"],
    weakAreas: ["System Design", "Pacing"]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-brand-950 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>AI Session Completed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Mock Interview Evaluation Report</h1>
              <p className="text-xs text-slate-400 mt-1">Detailed performance score breakdown and recommended study topics.</p>
            </div>

            <Link
              to="/interview/mock"
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Interview</span>
            </Link>
          </div>

          {/* Scores breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Technical Score</div>
              <div className="text-3xl font-extrabold text-brand-400 mt-1">{latestResult.technicalScore}%</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Communication</div>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1">{latestResult.communicationScore}%</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Problem Solving</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">{latestResult.problemSolvingScore}%</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Confidence Rating</div>
              <div className="text-3xl font-extrabold text-purple-400 mt-1">{latestResult.confidenceScore}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Demonstrated Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {latestResult.strongAreas.map((area, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Recommended Topics to Revise
              </h3>
              <div className="flex flex-wrap gap-2">
                {latestResult.weakAreas.map((area, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
