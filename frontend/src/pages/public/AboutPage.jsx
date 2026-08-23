import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Sparkles, Target, ShieldCheck, Heart, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-xs font-semibold border border-brand-500/30 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Empowering College Graduates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">About <span className="gradient-text">CareerAI</span></h1>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            CareerAI was built as part of an engineering VAP project using modern MERN Stack and Artificial Intelligence technologies to transform traditional job hunting into an intelligent, data-driven readiness pipeline.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-2xl glass-card border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-600/30 text-brand-400 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Mission</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bridge the gap between academic graduation and industry expectations through real-time ATS resume scoring and skill gap analysis.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Career Intelligence</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Using LLMs to evaluate technical mock interviews and provide actionable structural feedback rather than surface-level metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">VAP Engineering Excellence</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Architected with high performance frontend state management, micro-interactions, responsive design, and mock API simulation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
