import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, CheckCircle2, Star, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const SkillsRequiredPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Software Engineer");

  const roleSkillsMap = {
    "Software Engineer": {
      mustHave: ["JavaScript / ES6+", "React.js", "Node.js & Express", "Data Structures & Algorithms", "Git Version Control"],
      goodToHave: ["Docker & Containerization", "AWS S3 / EC2", "Redis Caching", "GraphQL"],
      softSkills: ["Technical Communication", "Problem Solving", "Agile Collaboration"]
    },
    "Frontend Developer": {
      mustHave: ["React.js", "Next.js", "Tailwind CSS", "JavaScript / TypeScript", "Web Performance"],
      goodToHave: ["Framer Motion", "Redux Toolkit / Zustand", "Storybook", "Jest / Testing Library"],
      softSkills: ["UI/UX Empathy", "Attention to Detail", "Design Hand-off Collaboration"]
    }
  };

  const currentInfo = roleSkillsMap[selectedRole] || roleSkillsMap["Software Engineer"];

  const handleCheckMatch = () => {
    addToast(`Checking your profile skills against ${selectedRole} market requirements...`, 'info');
    navigate('/skills/gap-analysis');
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
                <Compass className="w-3.5 h-3.5" />
                <span>Industry Competency Standards</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Skills Required for {selectedRole}</h1>
              <p className="text-xs text-slate-400 mt-1">Market intelligence on essential, preferred, and soft skills required by top employers.</p>
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Frontend Developer">Frontend Developer</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Must Have */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Must Have Skills (High Demand)
              </h3>
              <ul className="space-y-2 text-xs">
                {currentInfo.mustHave.map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Good to Have */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Good to Have (Competitive Edge)
              </h3>
              <ul className="space-y-2 text-xs">
                {currentInfo.goodToHave.map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Soft Skills */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Soft Skills & Mindset
              </h3>
              <ul className="space-y-2 text-xs">
                {currentInfo.softSkills.map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="pt-4 text-center">
            <button
              onClick={handleCheckMatch}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl transition-all inline-flex items-center gap-2"
            >
              <span>Check My Skill Match</span>
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
