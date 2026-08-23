import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GitBranch, Globe, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Career<span className="gradient-text">AI</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Career Intelligence Platform helping students, fresh graduates, and job seekers land their dream software engineering roles.
            </p>
            <div className="flex space-x-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <GitBranch className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link to="/resume/analyzer" className="hover:text-white transition-colors">Resume AI Analyzer</Link></li>
              <li><Link to="/resume/builder" className="hover:text-white transition-colors">ATS Resume Builder</Link></li>
              <li><Link to="/skills/gap-analysis" className="hover:text-white transition-colors">Skill Gap Analysis</Link></li>
              <li><Link to="/interview" className="hover:text-white transition-colors">AI Mock Interview</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Recruiter Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-3">Get weekly AI career tips & top job alerts directly in your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to CareerAI Newsletter!"); }} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-l-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-r-lg text-xs font-semibold transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CareerAI Platform. Built for VAP Project using MERN Stack & AI.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
