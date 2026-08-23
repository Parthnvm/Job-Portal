import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Sparkles, FileText, BarChart2, Video, Map, CheckSquare, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage = () => {
  const featureList = [
    { title: "AI Resume Analyzer", desc: "Scan resumes for ATS compatibility, keyword gaps, and structural feedback.", icon: FileText, link: "/resume/analyzer" },
    { title: "Interactive Resume Builder", desc: "Build clean, professional resumes with live preview and AI bullet enhancement.", icon: Layers, link: "/resume/builder" },
    { title: "Skill Gap Analyzer", desc: "Compare current skills with target engineering roles to highlight missing tech.", icon: BarChart2, link: "/skills/gap-analysis" },
    { title: "AI Mock Interviews", desc: "Practice real-time technical, behavioral, and system design interviews with AI ratings.", icon: Video, link: "/interview" },
    { title: "Personalized Career Roadmap", desc: "Follow step-by-step milestone learning paths tailored to your goal role.", icon: Map, link: "/career-roadmap" },
    { title: "Kanban Application Tracker", desc: "Organize applications through Saved, Applied, Screening, Interview, and Offer stages.", icon: CheckSquare, link: "/applications" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-xs font-semibold border border-brand-500/30 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Complete Career Toolkit</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Powerful <span className="gradient-text">AI Features</span></h1>
          <p className="mt-3 text-slate-300 text-sm">Everything you need to turn your job search into a guaranteed hiring success.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
                <Link to={feat.link} className="mt-6 flex items-center space-x-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300">
                  <span>Try Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
