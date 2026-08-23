import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  TrendingUp, 
  Award,
  Layers,
  FileCheck
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const ResumeAnalyzerPage = () => {
  const { resumeAnalysis, setResumeAnalysis } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleSimulatedUpload = () => {
    setIsAnalyzing(true);
    addToast('Parsing resume text & running ATS keyword scanner...', 'info');

    setTimeout(() => {
      setIsAnalyzing(false);
      const updated = {
        ...resumeAnalysis,
        overallScore: 85,
        atsScore: 91,
        skillsScore: 88,
      };
      setResumeAnalysis(updated);
      addToast('AI Resume Analysis complete! Score updated to 85/100.', 'success');
    }, 1500);
  };

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
                <span>AI Natural Language Parser</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Resume Analyzer & ATS Inspector</h1>
              <p className="text-xs text-slate-400 mt-1">Scan your resume for ATS formatting, missing keywords, and structural hiring metrics.</p>
            </div>

            <button
              onClick={handleSimulatedUpload}
              disabled={isAnalyzing}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Scanning Resume...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Re-Analyze Resume</span>
                </>
              )}
            </button>
          </div>

          {/* Upload Drag & Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleSimulatedUpload(); }}
            className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center ${
              dragOver ? 'border-brand-500 bg-brand-950/40' : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-600/30 text-brand-400 flex items-center justify-center mx-auto mb-3 border border-brand-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Drag & Drop your resume (PDF/DOCX)</h3>
            <p className="text-xs text-slate-400 mt-1">or click below to upload and scan with CareerAI LLM</p>

            <button
              onClick={handleSimulatedUpload}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Select File from Device
            </button>
          </div>

          {/* OVERALL SCORES DISPLAY */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Resume Health</span>
                <div className="text-4xl font-extrabold text-white mt-1 flex items-center gap-3">
                  <span className="gradient-text">{resumeAnalysis.overallScore}/100</span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    High ATS Compatibility
                  </span>
                </div>
              </div>

              <Link
                to="/resume/builder"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xl shadow-brand-500/30 transition-all flex items-center space-x-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Improve My Resume with AI</span>
              </Link>
            </div>

            {/* Score Breakdown Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">ATS Score</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{resumeAnalysis.atsScore}</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${resumeAnalysis.atsScore}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Content Score</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">{resumeAnalysis.contentScore}</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${resumeAnalysis.contentScore}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Skills Score</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{resumeAnalysis.skillsScore}</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${resumeAnalysis.skillsScore}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Experience Score</div>
                <div className="text-xl font-bold text-blue-400 mt-1">{resumeAnalysis.experienceScore}</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${resumeAnalysis.experienceScore}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 md:col-span-1">
                <div className="text-xs text-slate-400">Formatting Score</div>
                <div className="text-xl font-bold text-teal-400 mt-1">{resumeAnalysis.formattingScore}</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${resumeAnalysis.formattingScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Breakdown Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            
            {/* Strengths & Weaknesses */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Resume Strengths
              </h3>
              <ul className="space-y-2">
                {resumeAnalysis.strengths.map((str, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 pt-4 border-t border-slate-800">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {resumeAnalysis.weaknesses.map((weak, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords & Actionable Suggestions */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Missing ATS Keywords
              </h3>
              <p className="text-slate-400">Adding these target tech keywords will boost recruiter match frequency:</p>
              <div className="flex flex-wrap gap-2">
                {resumeAnalysis.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/40 font-semibold">
                    + {kw}
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 pt-4 border-t border-slate-800">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Actionable AI Suggestions
              </h3>
              <ul className="space-y-2 text-slate-300">
                {resumeAnalysis.actionableSuggestions.map((sug, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
