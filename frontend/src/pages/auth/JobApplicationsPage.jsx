import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Calendar, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const JobApplicationsPage = () => {
  const { applications, updateApplicationStatus } = useAppData();
  const { addToast } = useToast();

  const stages = ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Saved': return 'border-slate-700 text-slate-300';
      case 'Applied': return 'border-brand-500/40 text-brand-300';
      case 'Screening': return 'border-yellow-500/40 text-yellow-300';
      case 'Interview': return 'border-purple-500/40 text-purple-300';
      case 'Offer': return 'border-emerald-500/40 text-emerald-300';
      case 'Rejected': return 'border-rose-500/40 text-rose-300';
      default: return 'border-slate-700 text-slate-300';
    }
  };

  const handleStageChange = (appId, newStage, appTitle) => {
    updateApplicationStatus(appId, newStage);
    addToast(`Moved "${appTitle}" to ${newStage} stage!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-emerald-400" />
                Kanban Application Tracker
              </h1>
              <p className="text-xs text-slate-400 mt-1">Track and manage your hiring progress across application stages.</p>
            </div>
          </div>

          {/* Kanban Board Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-start overflow-x-auto pb-4">
            {stages.map((stage) => {
              const stageApps = applications.filter((a) => a.status === stage);

              return (
                <div key={stage} className="p-3 rounded-2xl glass-card border border-slate-800 space-y-3 shrink-0 min-w-[200px]">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStageColor(stage)}`}>
                      {stage} ({stageApps.length})
                    </span>
                  </div>

                  {/* Stage Cards List */}
                  <div className="space-y-2.5 min-h-[300px]">
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-slate-500 transition-all space-y-2 text-xs shadow-md"
                      >
                        <div>
                          <h4 className="font-bold text-white leading-tight">{app.jobTitle}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{app.company}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{app.appliedDate}</span>
                          <span className="text-emerald-400 font-semibold">{app.atsScore}% ATS</span>
                        </div>

                        {app.interviewDate && (
                          <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-200">
                            Interview: {app.interviewDate}
                          </div>
                        )}

                        {/* Move Stage Selector */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <label className="text-[10px] text-slate-500 font-medium">Move:</label>
                          <select
                            value={app.status}
                            onChange={(e) => handleStageChange(app.id, e.target.value, app.jobTitle)}
                            className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 focus:outline-none"
                          >
                            {stages.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {stageApps.length === 0 && (
                      <div className="p-4 text-center text-[11px] text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No jobs in {stage}
                      </div>
                    )}
                  </div>

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
