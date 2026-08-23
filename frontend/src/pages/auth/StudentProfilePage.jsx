import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, FileText, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AIChatModal } from '../../components/common/AIChatModal';

export const StudentProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Sumit Kumar',
    email: user?.email || 'sumit.kumar@example.com',
    phone: '+91 9876543210',
    location: user?.preferredLocation || 'Bengaluru, India',
    targetRole: user?.targetRole || 'Full Stack MERN Developer',
    education: user?.education || 'B.Tech CSE, NIT Bengaluru (2025)',
    bio: 'Passionate MERN stack software engineer building scalable web apps and exploring AI integrations.',
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS']
  });

  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (sk) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== sk) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold border-2 border-brand-500/40 shadow-xl">
                {formData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">{formData.name}</h1>
                <p className="text-xs text-slate-400">{formData.targetRole} • {formData.location}</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save Profile</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white mb-2">Personal & Academic Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-medium">Target Job Role</label>
              <input
                type="text"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium">Professional Bio</label>
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none"
              ></textarea>
            </div>

            {/* Skills */}
            <div className="pt-2">
              <label className="text-slate-300 font-medium block mb-1">Skills</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Add skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((sk, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                    <span>{sk}</span>
                    <button type="button" onClick={() => handleRemoveSkill(sk)} className="text-slate-400 hover:text-rose-400">×</button>
                  </span>
                ))}
              </div>
            </div>
          </form>

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
