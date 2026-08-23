import React, { useState } from 'react';
import { Map, Sparkles, CheckCircle2, Circle, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { mockRoadmapPhases } from '../../data/mockRoadmap';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const CareerRoadmapPage = () => {
  const { addToast } = useToast();
  const [phases, setPhases] = useState(mockRoadmapPhases);

  const toggleMilestone = (phaseId, milestoneId) => {
    setPhases((prev) =>
      prev.map((p) => {
        if (p.id === phaseId) {
          const updatedMilestones = p.milestones.map((m) => {
            if (m.id === milestoneId) {
              const newStatus = m.status === 'Completed' ? 'In Progress' : 'Completed';
              addToast(`Milestone marked as ${newStatus}!`, 'success');
              return { ...m, status: newStatus };
            }
            return m;
          });
          return { ...p, milestones: updatedMilestones };
        }
        return p;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-2">
                <Map className="w-3.5 h-3.5 text-yellow-400" />
                <span>AI Roadmap Progression</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Full Stack MERN Career Roadmap</h1>
              <p className="text-xs text-slate-400 mt-1">Step-by-step milestone learning path curated for high-paying product engineering roles.</p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-right shrink-0">
              <span className="text-slate-400 block">Overall Completion</span>
              <span className="text-lg font-bold text-emerald-400">74% Completed</span>
            </div>
          </div>

          {/* Timeline Phases */}
          <div className="space-y-6">
            {phases.map((phase, pIdx) => (
              <div key={phase.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-500/40 text-brand-300 text-xs flex items-center justify-center font-extrabold">
                        {pIdx + 1}
                      </span>
                      {phase.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{phase.description} • Est. Time: {phase.estimatedDuration}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    phase.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                    phase.status === 'In Progress' ? 'bg-brand-950 text-brand-300 border border-brand-500/30' :
                    'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    {phase.status}
                  </span>
                </div>

                {/* Milestones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                        m.status === 'Completed'
                          ? 'bg-slate-900/90 border-emerald-500/40'
                          : m.status === 'In Progress'
                          ? 'bg-slate-900/90 border-brand-500/40'
                          : 'bg-slate-950/60 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{m.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleMilestone(phase.id, m.id)}
                          className="text-slate-400 hover:text-emerald-400 shrink-0"
                          title="Toggle Completion"
                        >
                          {m.status === 'Completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.skills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
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
