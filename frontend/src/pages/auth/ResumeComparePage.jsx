import React, { useState } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight 
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const ResumeComparePage = () => {
  const { addToast } = useToast();

  const [jobDescription, setJobDescription] = useState(
    `We are seeking a Senior Full Stack Engineer proficient in React.js, Node.js, Express, and MongoDB. Experience with Docker containerization, AWS deployments, and CI/CD pipelines is strongly required.`
  );

  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState({
    overallMatch: 84,
    keywordMatch: 79,
    skillsMatch: 88,
    experienceMatch: 75,
    missingKeywords: ['Docker', 'AWS', 'CI/CD Pipelines', 'Kubernetes'],
    matchedSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    recommendation: "Add Docker containerization experience and AWS cloud deployment to your skills section to increase hiring ATS compatibility by 15%."
  });

  const handleCompare = (e) => {
    e.preventDefault();
    setIsComparing(true);
    addToast('Comparing resume vectors against job description...', 'info');

    setTimeout(() => {
      setIsComparing(false);
      setComparisonResult({
        overallMatch: 87,
        keywordMatch: 82,
        skillsMatch: 91,
        experienceMatch: 78,
        missingKeywords: ['Docker', 'AWS S3', 'CI/CD'],
        matchedSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
        recommendation: "Strong alignment detected! Include a bullet point describing your experience with CI/CD automation."
      });
      addToast('AI Resume & JD Comparison updated!', 'success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <GitCompare className="w-6 h-6 text-brand-400" />
              Resume vs Job Description AI Matcher
            </h1>
            <p className="text-xs text-slate-400 mt-1">Paste any target Job Description to simulate real ATS matching algorithms.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Col: Upload + JD Paste Input */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-400" />
                    Uploaded Resume Snapshot
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold">Active Profile Resume</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <p className="font-bold text-white">Sumit_Kumar_MERN_Resume.pdf</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Parsed 10 skills, 2 projects, 1 work history</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">Target Job Description (JD)</label>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder="Paste job posting duties, required skills, and qualifications..."
                  ></textarea>
                </div>

                <button
                  onClick={handleCompare}
                  disabled={isComparing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  {isComparing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Matching Vector Embeddings...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>Run AI Comparison</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Col: AI Comparison Results */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Compatibility</span>
                    <div className="text-3xl font-extrabold text-white mt-1">
                      <span className="gradient-text">{comparisonResult.overallMatch}% Match</span>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 font-extrabold text-xs border border-emerald-500/40">
                    ATS Pass Level
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Keyword Match</div>
                    <div className="text-lg font-bold text-brand-400 mt-1">{comparisonResult.keywordMatch}%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Skills Match</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">{comparisonResult.skillsMatch}%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Exp Match</div>
                    <div className="text-lg font-bold text-purple-400 mt-1">{comparisonResult.experienceMatch}%</div>
                  </div>
                </div>

                {/* Matched vs Missing */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Matched Tech Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comparisonResult.matchedSkills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-rose-300 flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Missing High-Demand Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comparisonResult.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/30">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Note */}
                <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-xs space-y-1">
                  <div className="font-bold text-yellow-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Recommendation:</span>
                  </div>
                  <p className="text-indigo-100 leading-relaxed">{comparisonResult.recommendation}</p>
                </div>

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
