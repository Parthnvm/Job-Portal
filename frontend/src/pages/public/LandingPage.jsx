import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  FileText, 
  TrendingUp, 
  Video, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Award, 
  Zap, 
  ChevronDown, 
  HelpCircle,
  BarChart2,
  Layers,
  Star,
  Play
} from 'lucide-react';
import { Footer } from '../../components/common/Footer';
import { Navbar } from '../../components/common/Navbar';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does CareerAI analyze my resume?",
      a: "CareerAI parses your PDF/DOCX resume using natural language processing algorithms. It checks keyword density against target job descriptions, formatting compliance for ATS parsers, and quantifies measurable impact in your work history."
    },
    {
      q: "Is the AI Mock Interview realistic?",
      a: "Yes! Our AI interviewer generates role-specific technical, behavioral, and system design questions. It evaluates your text or spoken answers for accuracy, communication clarity, and completeness in real-time."
    },
    {
      q: "Can fresh graduates and students benefit from CareerAI?",
      a: "Absolutely. CareerAI is designed specifically for students and early-career job seekers. It maps out personalized step-by-step career roadmaps and highlights exact missing skills so you know what to learn next."
    },
    {
      q: "Is CareerAI free to use?",
      a: "CareerAI offers a generous free tier for students and job seekers, including free ATS resume scoring, job recommendations, and 5 AI mock interviews per month."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-brand-300 mb-6 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span>Next-Generation AI Career Intelligence Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto"
          >
            From Job Search to Job Readiness — <span className="gradient-text">One AI Platform.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Discover opportunities, optimize your resume, identify skill gaps, and prepare for interviews with AI-powered career intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-brand-500/30 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Find Your Dream Job</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/resume/analyzer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Analyze My Resume</span>
            </Link>
          </motion.div>

          {/* Hero Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-14 relative max-w-5xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-2xl overflow-hidden text-left bg-slate-900/90">
              
              {/* Dashboard Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">careerai.app/dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Engine Live
                  </span>
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Score 1 */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium">AI Match Score</div>
                  <div className="text-3xl font-extrabold text-white mt-1">94%</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% vs last month
                  </div>
                </div>

                {/* Score 2 */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium">Resume ATS Score</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">82/100</div>
                  <div className="text-[11px] text-slate-300 mt-1">ATS Parser Verified</div>
                </div>

                {/* Score 3 */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium">Skill Readiness</div>
                  <div className="text-3xl font-extrabold text-indigo-400 mt-1">78%</div>
                  <div className="text-[11px] text-indigo-300 mt-1">8/12 Key Skills Met</div>
                </div>

                {/* Score 4 */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium">Interview Readiness</div>
                  <div className="text-3xl font-extrabold text-purple-400 mt-1">8.4/10</div>
                  <div className="text-[11px] text-purple-300 mt-1">Mock Interview Passed</div>
                </div>
              </div>

              {/* Recommended Jobs Snippet */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold">
                    NX
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Stack MERN Developer</h4>
                    <p className="text-xs text-slate-400">Nexus Technologies • Bengaluru (Hybrid) • ₹8L - ₹14L / yr</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    94% AI Match
                  </span>
                  <button onClick={() => navigate('/jobs/job-1')} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
                    View Match
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">50,000+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Students & Graduates</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-400">88%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">3.5x</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">More Interview Calls</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">100+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Hiring Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Job searching is fragmented.</h2>
          <p className="mt-3 text-slate-400 text-base max-w-2xl mx-auto">
            Traditional portals leave applicants stranded across disconnected tools. CareerAI unifies everything into one intelligent pipeline.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
            {[
              { title: "Job Search", desc: "Generic listings without match scores", icon: Search },
              { title: "Resume", desc: "Ignored by automated ATS filters", icon: FileText },
              { title: "Skill Gap", desc: "No visibility into target role requirements", icon: BarChart2 },
              { title: "Interviews", desc: "Lack of realistic mock preparation", icon: Video },
              { title: "Career Plan", desc: "No guidance on what to learn next", icon: MapPin },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-slate-800 text-left">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (6 Steps) */}
      <section className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Step-by-Step Hiring Acceleration</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">How CareerAI Gets You Hired</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "Step 1", title: "Create Profile", desc: "Set up your target role, education, and preferred job locations." },
              { step: "Step 2", title: "Upload Resume", desc: "Upload your resume for instant AI parsing and ATS compatibility scoring." },
              { step: "Step 3", title: "AI Analysis", desc: "Discover missing keywords, formatting errors, and skill gaps." },
              { step: "Step 4", title: "Get Job Matches", desc: "View personalized recommendations ranked by your real AI compatibility." },
              { step: "Step 5", title: "Prepare for Interview", desc: "Practice role-specific mock interviews with live AI feedback." },
              { step: "Step 6", title: "Get Hired", desc: "Apply with confidence and track your hiring pipeline." },
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-800 relative">
                <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 inline-block mb-3">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mt-2">Everything you need to know about CareerAI platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to accelerate your tech career?</h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of engineering students and developers using AI to land their dream software roles.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-brand-500/40 hover:scale-105 transition-transform"
            >
              Build Your Profile Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
