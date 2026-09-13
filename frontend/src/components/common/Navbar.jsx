import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Bookmark, 
  User, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Layers, 
  MessageSquare, 
  Compass, 
  Menu, 
  X,
  ChevronDown,
  LogOut,
  UserCheck,
  Building2,
  Sliders,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const { notifications, savedJobIds } = useAppData();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Jobs', path: '/jobs' },
    { name: 'Resume AI', path: '/resume/analyzer' },
    { name: 'Resume Builder', path: '/resume/builder' },
    { name: 'Skill Gap', path: '/skills/gap-analysis' },
    { name: 'Interview AI', path: '/interview' },
    { name: 'Career Roadmap', path: '/career-roadmap' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  Career<span className="gradient-text">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wider uppercase">Career Intelligence</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Icons & Auth Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search jobs or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 xl:w-56 pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/70 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {isAuthenticated ? (
              <>
                {/* Saved Jobs Icon */}
                <Link
                  to="/saved-jobs"
                  className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Saved Jobs"
                >
                  <Bookmark className="w-5 h-5" />
                  {savedJobIds.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {savedJobIds.length}
                    </span>
                  )}
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl p-4 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                        <span className="font-semibold text-sm text-white">Notifications</span>
                        <Link
                          to="/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs text-brand-400 hover:underline"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <Bell className="w-8 h-8 text-slate-600 mb-2" />
                            <p className="text-sm text-slate-400 font-medium">No notifications</p>
                            <p className="text-xs text-slate-600 mt-0.5">You're all caught up!</p>
                          </div>
                        ) : (
                          notifications.slice(0, 3).map((n) => (
                            <div
                              key={n.id}
                              className={`p-2.5 rounded-xl text-xs ${
                                n.unread ? 'bg-brand-950/40 border border-brand-500/20' : 'bg-slate-800/40'
                              }`}
                            >
                              <div className="font-medium text-slate-200">{n.title}</div>
                              <div className="text-slate-400 mt-0.5">{n.message}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{n.time}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Shortcut */}
                <Link
                  to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-brand-400" />
                  <span>Dashboard</span>
                </Link>

                {/* Profile User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-7 h-7 rounded-full object-cover border border-brand-500/50"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl p-2 border border-slate-700/80 z-50">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-500/20 text-brand-300 capitalize border border-brand-500/30">
                          {user?.role} Mode
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                          <User className="w-4 h-4 text-brand-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                          <Briefcase className="w-4 h-4 text-emerald-400" />
                          <span>Application Tracker</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                          <Sliders className="w-4 h-4 text-purple-400" />
                          <span>Settings</span>
                        </Link>

                        {/* Role switcher simulation */}
                        <button
                          onClick={() => {
                            const newRole = user?.role === 'recruiter' ? 'student' : 'recruiter';
                            switchRole(newRole);
                            setUserDropdownOpen(false);
                            addToast(`Switched to ${newRole.toUpperCase()} view`, 'info');
                            navigate(newRole === 'recruiter' ? '/recruiter/dashboard' : '/dashboard');
                          }}
                          className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-indigo-300 hover:bg-indigo-950/50"
                        >
                          <Building2 className="w-4 h-4 text-indigo-400" />
                          <span>Switch to {user?.role === 'recruiter' ? 'Student' : 'Recruiter'} Mode</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            addToast('Logged out successfully', 'info');
                            navigate('/');
                          }}
                          className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg text-xs font-medium text-center ${
                  isActive(link.path)
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-brand-600/30 border border-brand-500/40 rounded-lg text-xs font-semibold text-brand-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full py-2 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300 font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center text-xs font-semibold bg-slate-800 text-slate-200 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center text-xs font-semibold bg-brand-600 text-white rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
