import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Sparkles, 
  FileText, 
  FileCheck, 
  GitCompare, 
  BarChart3, 
  Compass, 
  Video, 
  Award, 
  Map, 
  CheckSquare, 
  Bookmark, 
  User, 
  Settings as SettingsIcon, 
  Bell,
  Building2,
  PlusCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { name: 'AI Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Application Tracker', path: '/applications', icon: CheckSquare },
    { name: 'Saved Jobs', path: '/saved-jobs', icon: Bookmark },
    { name: 'Resume Analyzer', path: '/resume/analyzer', icon: FileText },
    { name: 'Resume Builder', path: '/resume/builder', icon: FileCheck },
    { name: 'Resume Compare', path: '/resume/compare', icon: GitCompare },
    { name: 'Skill Gap Analyzer', path: '/skills/gap-analysis', icon: BarChart3 },
    { name: 'Skills Required', path: '/skills/required', icon: Compass },
    { name: 'AI Mock Interview', path: '/interview', icon: Video },
    { name: 'Career Roadmap', path: '/career-roadmap', icon: Map },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const recruiterLinks = [
    { name: 'Recruiter Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Post New Job', path: '/recruiter/jobs/create', icon: PlusCircle },
    { name: 'Manage Jobs', path: '/recruiter/jobs', icon: Building2 },
    { name: 'Applicants', path: '/recruiter/applicants', icon: Users },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const links = isRecruiter ? recruiterLinks : studentLinks;

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-800 shrink-0 p-4 min-h-[calc(100vh-4rem)] sticky top-16">
      {/* Sidebar Header */}
      <div className="mb-4 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-9 h-9 rounded-full object-cover border border-brand-500"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
          <p className="text-[10px] text-slate-400 capitalize">{user?.role} Account</p>
        </div>
      </div>

      {/* Navigation Group */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {links.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI Assistant Quick Card */}
      {!isRecruiter && (
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 border border-indigo-500/40">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <h4 className="text-xs font-semibold text-white">AI Career Assistant</h4>
          <p className="text-[10px] text-slate-300 mt-1">Get real-time answers & interview tips.</p>
        </div>
      )}
    </aside>
  );
};
