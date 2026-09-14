import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Sparkles, Plus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const RecruiterPostJobPage = () => {
  const { addJob } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: 'Senior MERN Developer',
    company: 'NextGen Solutions',
    industry: 'FinTech / Product SaaS',
    location: 'Bengaluru / Hybrid',
    type: 'Full-Time',
    experience: '1-3 Years',
    salary: '₹14L - ₹20L / yr',
    description: 'We are looking for a skilled MERN Stack engineer to build real-time dashboard microservices and web interfaces.',
    responsibilities: 'Build REST APIs with Express & MongoDB; Implement responsive React components; Write unit and integration tests.',
    qualifications: 'B.Tech/BE in CS or equivalent experience with React and Node.js.',
    skills: 'React.js, Node.js, Express.js, MongoDB, JavaScript, Docker'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJobObj = {
      id: `job-${Date.now()}`,
      title: formData.title,
      company: formData.company,
      companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=150&q=80",
      location: formData.location,
      type: formData.type,
      experience: formData.experience,
      salary: formData.salary,
      salaryMin: 1400000,
      salaryMax: 2000000,
      postedDate: "Just now",
      industry: formData.industry,
      matchScore: 92,
      atsCompatibility: 94,
      skills: formData.skills.split(',').map((s) => s.trim()),
      missingSkills: ["Docker"],
      description: formData.description,
      responsibilities: formData.responsibilities.split(';').map((s) => s.trim()),
      qualifications: formData.qualifications,
      benefits: ["Remote work flexibility", "Health Insurance", "Annual Tech Allowance"]
    };

    addJob(newJobObj);
    addToast(`Job "${formData.title}" posted successfully to CareerAI!`, 'success');
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-400" />
                Post a New Technical Opening
              </h1>
              <p className="text-xs text-slate-400 mt-1">Job postings are automatically parsed for AI match algorithms.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-medium">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Required Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Job Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-bold text-xs shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Job Opening</span>
              </button>
            </form>
          </div>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
