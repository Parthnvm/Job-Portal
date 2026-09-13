import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Video, 
  CheckSquare, 
  Briefcase, 
  Award, 
  ArrowRight, 
  ChevronRight, 
  BarChart2, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { JobCard } from '../../components/jobs/JobCard';
import { AIChatModal } from '../../components/common/AIChatModal';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { jobs, externalJobs = [], applications, resumeAnalysis, roadmaps, interviewHistory } = useAppData();
  const navigate = useNavigate();

  const allJobs = [...jobs, ...externalJobs];
  const recommendedJobs = allJobs.slice(0, 3);
  const activeApplications = applications.slice(0, 3);
  const currentRoadmap = roadmaps["Full Stack Developer"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          
          {/* Top Greeting Banner */}
          <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-brand-950/80 via-slate-900 to-indigo-950/80 border border-brand-500/30 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span>AI Readiness Platform</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Good morning, <span className="gradient-text">{user?.name || 'Sumit'}</span>! 👋
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Your CareerAI neural model updated your hiring compatibility. You have <span className="text-emerald-400 font-bold">6 recommended job matches</span> today.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  to="/resume/analyzer"
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Analyze Resume</span>
                </Link>
                <Link
                  to="/interview"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Mock Interview</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Metric Score Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Profile Completion */}
            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Profile Completion</span>
                <span className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/30">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-white">{user?.profileCompletion || 85}%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${user?.profileCompletion || 85}%` }}></div>
                </div>
              </div>
            </div>

            {/* Card 2: Readiness Score */}
            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Career Readiness</span>
                <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-indigo-400">78/100</div>
                <div className="text-[10px] text-slate-400 mt-1">High Job Compatibility</div>
              </div>
            </div>

            {/* Card 3: ATS Score */}
            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Resume ATS Score</span>
                <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <FileText className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-emerald-400">{resumeAnalysis.atsScore}/100</div>
                <div className="text-[10px] text-emerald-300 mt-1">ATS Parser Verified</div>
              </div>
            </div>

            {/* Card 4: Interview Readiness */}
            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Interview Readiness</span>
                <span className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
                  <Video className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-purple-400">74%</div>
                <div className="text-[10px] text-slate-400 mt-1">3 Mock Tests Completed</div>
              </div>
            </div>
          </div>

          {/* Secondary stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Target Skills Met</div>
              <div className="text-lg font-bold text-white mt-0.5">8 / 12</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">AI Job Matches</div>
              <div className="text-lg font-bold text-brand-400 mt-0.5">6 Roles</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Active Applications</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{applications.length} Submitted</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Scheduled Interviews</div>
              <div className="text-lg font-bold text-purple-400 mt-0.5">1 Upcoming</div>
            </div>
          </div>

          {/* Grid Layout: Recommended Jobs & Resume Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Recommended Jobs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    Top AI Recommended Jobs
                  </h3>
                  <p className="text-xs text-slate-400">Based on your MERN skills & resume metrics</p>
                </div>
                <Link to="/recommendations" className="text-xs font-semibold text-brand-400 hover:underline">
                  View All Recommendations →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedJobs.map((job) => (
                  <JobCard key={job._id || job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Right Col: AI Resume Improvement Suggestions & Skill Gaps */}
            <div className="space-y-4">
              
              {/* Resume Suggestions */}
              <div className="p-5 rounded-2xl glass-card border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Resume AI Improvements
                  </h4>
                  <Link to="/resume/analyzer" className="text-[11px] text-brand-400 hover:underline">Fix All</Link>
                </div>
                <div className="space-y-2.5 text-xs">
                  {resumeAnalysis.actionableSuggestions.slice(0, 2).map((sug, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gap Quick Card */}
              <div className="p-5 rounded-2xl glass-card border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    Missing High-Demand Skills
                  </h4>
                  <Link to="/skills/gap-analysis" className="text-[11px] text-brand-400 hover:underline">Analyze</Link>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 font-medium">
                    Docker Containerization (25%)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-yellow-950/60 text-yellow-300 border border-yellow-500/30 font-medium">
                    AWS S3 & Deployment (35%)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-medium">
                    System Design Concepts (55%)
                  </span>
                </div>
              </div>

              {/* Upcoming Interviews Widget */}
              <div className="p-5 rounded-2xl glass-card border border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Upcoming Technical Interview
                </h4>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
                  <div className="font-bold text-purple-200">Nexus Technologies — Full Stack</div>
                  <div className="text-slate-400 mt-0.5">Aug 22, 2026 • 11:00 AM IST</div>
                  <Link
                    to="/interview"
                    className="mt-2.5 block text-center py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px]"
                  >
                    Take Mock Practice Session
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Career Roadmap Progress Bar */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Career Roadmap Progress — Full Stack MERN</h4>
                <p className="text-xs text-slate-400">74% of target milestones completed</p>
              </div>
              <Link to="/career-roadmap" className="text-xs font-semibold text-brand-400 hover:underline">
                View Detailed Roadmap →
              </Link>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400" style={{ width: '74%' }}></div>
            </div>
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
