import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Upload, FileText, User, GraduationCap, Briefcase, Target, MapPin, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

export const OnboardingPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Sumit Kumar',
    phone: '+91 9876543210',
    institution: 'NIT Bengaluru',
    degree: 'B.Tech Computer Science & Engineering',
    graduationYear: '2025',
    cgpa: '8.7',
    primarySkills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
    experienceType: 'Internship / Project Experience',
    targetRole: 'Full Stack MERN Developer',
    preferredLocations: ['Bengaluru', 'Remote (India)', 'Hyderabad'],
    careerGoal: 'Land a High-Growth Software Engineering Role in a tech SaaS product startup',
    resumeFileName: 'Sumit_Kumar_MERN_Resume.pdf'
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !formData.primarySkills.includes(newSkillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        primarySkills: [...prev.primarySkills, newSkillInput.trim()]
      }));
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      primarySkills: prev.primarySkills.filter((s) => s !== skillToRemove)
    }));
  };

  const finishOnboarding = () => {
    updateUserProfile({
      name: formData.fullName,
      education: `${formData.degree}, ${formData.institution} (${formData.graduationYear})`,
      targetRole: formData.targetRole,
      preferredLocation: formData.preferredLocations.join(', '),
      isOnboarded: true,
      profileCompletion: 95
    });

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // fallback
    }

    addToast('Your CareerAI profile is ready! Welcome to your dashboard.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 py-8">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-xs font-semibold border border-brand-500/30 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Profile Personalization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Let's setup your CareerAI Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">Step {step} of {totalSteps}</p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card Body */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl min-h-[360px] flex flex-col justify-between">
          
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-brand-400 mb-2">
                <User className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Personal Information</h3>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Contact Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                <GraduationCap className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Education Details</h3>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">College / University Name</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300">Degree & Specialization</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">Graduation Year</label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-purple-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Key Technical Skills</h3>
              </div>
              <p className="text-xs text-slate-400">Add programming languages, frameworks, and web tech you know.</p>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. TypeScript, Docker, Python"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                >
                  Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.primarySkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-rose-400">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Experience */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Work & Project Experience</h3>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Select Current Background</label>
                <select
                  value={formData.experienceType}
                  onChange={(e) => setFormData({ ...formData, experienceType: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="College Student (No experience yet)">College Student (Building projects)</option>
                  <option value="Internship / Project Experience">Internship & Capstone Project Experience</option>
                  <option value="1+ Years Full Time">1+ Years Professional Experience</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: Target Job Roles */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                <Target className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Target Job Role</h3>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">What specific role are you aiming for?</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="Full Stack Developer / React Engineer / AI Software Engineer"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Preferred Locations */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 mb-2">
                <MapPin className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Preferred Locations</h3>
              </div>
              <p className="text-xs text-slate-400">Where would you like to work?</p>
              <div className="grid grid-cols-2 gap-2">
                {['Bengaluru', 'Remote (India)', 'Hyderabad', 'Pune', 'Gurgaon / Noida', 'Mumbai'].map((loc) => {
                  const isSelected = formData.preferredLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          preferredLocations: isSelected
                            ? prev.preferredLocations.filter((l) => l !== loc)
                            : [...prev.preferredLocations, loc]
                        }));
                      }}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        isSelected
                          ? 'bg-brand-600/30 border-brand-500/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Career Goals */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                <Award className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Primary Career Goal</h3>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">What is your main objective for the next 6-12 months?</label>
                <textarea
                  rows={3}
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 8: Upload Resume */}
          {step === 8 && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-500/40">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Upload Your Resume</h3>
              <p className="text-xs text-slate-400">PDF or DOCX format. CareerAI will automatically score and parse your ATS formatting.</p>

              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-brand-400 mb-2" />
                <span className="text-xs font-semibold text-white">{formData.resumeFileName}</span>
                <span className="text-[10px] text-slate-400 mt-1">Simulated Resume Uploaded</span>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>{step === totalSteps ? 'Complete Profile' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
