import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Layers, 
  FileText,
  Building2,
  Calendar
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const { jobs, savedJobIds, toggleSaveJob, applyToJob, applications } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === id) || jobs[0];
  const isSaved = savedJobIds.includes(job.id);
  const isApplied = applications.some((a) => a.jobId === job.id);

  const handleSave = () => {
    toggleSaveJob(job.id);
    addToast(isSaved ? 'Removed from saved jobs' : 'Job saved to your bookmarks!', 'info');
  };

  const handleApply = () => {
    if (!isApplied) {
      applyToJob(job);
      addToast(`Applied to ${job.title} at ${job.company}!`, 'success');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Job link copied to clipboard!', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Search</span>
          </button>

          {/* Job Top Card */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700 bg-slate-900 p-1 shrink-0"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">{job.title}</h1>
                  <p className="text-sm text-slate-400 font-medium">{job.company} • {job.industry}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.experience}</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={handleSave}
                  className={`p-3 rounded-xl border transition-all ${
                    isSaved ? 'bg-brand-600/30 text-brand-400 border-brand-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Save Job"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-brand-400' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                  title="Share Job"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {isApplied ? (
                  <span className="px-6 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Application Submitted</span>
                  </span>
                ) : (
                  <button
                    onClick={handleApply}
                    className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xl shadow-brand-500/30 transition-all"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI MATCH SECTION (IMPORTANT) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your AI Job Match Intelligence</h3>
                  <p className="text-xs text-slate-400">Deep compatibility breakdown generated by CareerAI LLM model</p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 font-extrabold text-sm border border-emerald-500/40">
                Overall Match: {job.matchScore}%
              </span>
            </div>

            {/* Score Breakdown metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Skills Match</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">92%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Experience Match</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">80%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Education Match</div>
                <div className="text-xl font-bold text-purple-400 mt-1">90%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>

            {/* Missing Skills & Recommended Prep */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-rose-300 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Missing Skills Identified
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {job.missingSkills.map((sk, idx) => (
                    <li key={idx}>{sk}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-yellow-300 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Recommended Preparation
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Learn Docker container basics & multi-stage builds.</li>
                  <li>Revise REST API error handling & status codes.</li>
                  <li>Practice system design for API rate limiting.</li>
                </ul>
              </div>
            </div>

            {/* Resume compatibility banner */}
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="text-emerald-200">
                Resume ATS Compatibility Score for this role: <strong className="text-white text-sm">{job.atsCompatibility}%</strong>
              </span>
              <Link to="/resume/compare" className="text-emerald-400 font-bold hover:underline">
                Run Full Comparison →
              </Link>
            </div>
          </div>

          {/* Detailed Job Information Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                <h3 className="text-base font-bold text-white">Job Description</h3>
                <p>{job.description}</p>
              </div>

              {/* Responsibilities */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                <h3 className="text-base font-bold text-white">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Skills */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3 text-xs">
                <h3 className="text-base font-bold text-white">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">Qualifications & Benefits</h3>
                <div>
                  <div className="font-semibold text-slate-200">Education Requirement:</div>
                  <p className="text-slate-400 mt-0.5">{job.qualifications}</p>
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Company Perks:</div>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 mt-1">
                    {job.benefits.map((ben, idx) => (
                      <li key={idx}>{ben}</li>
                    ))}
                  </ul>
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
