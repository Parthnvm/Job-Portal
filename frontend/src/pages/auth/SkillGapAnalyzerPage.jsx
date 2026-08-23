import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  Compass, 
  Layers 
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const SkillGapAnalyzerPage = () => {
  const { roleSkillsData } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const roleData = roleSkillsData[selectedRole] || roleSkillsData["Software Engineer"];

  const handleGenerateRoadmap = () => {
    addToast('Generating custom learning roadmap for missing skill gaps...', 'success');
    navigate('/career-roadmap');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>AI Skill Profiler</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Visual Skill Gap Analyzer</h1>
              <p className="text-xs text-slate-400 mt-1">Benchmark your current proficiencies against target market role requirements.</p>
            </div>

            {/* Select target role */}
            <div className="flex items-center space-x-2 shrink-0">
              <label className="text-xs text-slate-300 font-medium">Target Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="AI & ML Engineer">AI & ML Engineer</option>
              </select>
            </div>
          </div>

          {/* Scores Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Skill Match Level</div>
              <div className="text-3xl font-extrabold text-brand-400 mt-1">{roleData.overallMatch}%</div>
              <div className="text-[10px] text-slate-400 mt-1">Based on 18 technical indicators</div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Career Readiness Score</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">{roleData.readinessScore}%</div>
              <div className="text-[10px] text-emerald-300 mt-1">Ready for Junior/SDE-1 roles</div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Skill Gap Index</div>
              <div className="text-3xl font-extrabold text-rose-400 mt-1">{roleData.skillGapScore}%</div>
              <div className="text-[10px] text-rose-300 mt-1">Missing Docker & AWS Cloud</div>
            </div>
          </div>

          {/* Categories & Proficiency Charts */}
          <div className="space-y-6">
            {roleData.categories.map((cat, catIdx) => (
              <div key={catIdx} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                  <span>{cat.name} Category</span>
                  <span className="text-xs text-slate-400 font-medium">Current vs Required</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-white flex items-center gap-1.5">
                          {skill.status === 'matched' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                          )}
                          {skill.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          skill.status === 'matched' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          Demand: {skill.demand}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Current: {skill.current}%</span>
                          <span>Required: {skill.required}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${skill.current}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Bridge Your Missing Skill Gaps</h3>
              <p className="text-xs text-slate-400 mt-1">Generate a personalized step-by-step roadmap to master Docker, AWS, and System Design.</p>
            </div>
            <button
              onClick={handleGenerateRoadmap}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
            >
              <span>Generate Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
