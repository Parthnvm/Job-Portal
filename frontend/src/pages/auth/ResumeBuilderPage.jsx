import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Eye, 
  Check, 
  X, 
  RefreshCw, 
  Layout, 
  Printer,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { generateAIResumeImprovement } from '../../utils/aiSimulator';
import { AIChatModal } from '../../components/common/AIChatModal';

export const ResumeBuilderPage = () => {
  const { resumeData, setResumeData } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('personal');
  const [template, setTemplate] = useState('modern'); // 'modern' | 'professional' | 'minimal' | 'ats'
  const [aiSuggestions, setAiSuggestions] = useState({});

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleImproveWithAI = (fieldKey, currentText) => {
    const improved = generateAIResumeImprovement(fieldKey, currentText);
    setAiSuggestions((prev) => ({
      ...prev,
      [fieldKey]: { original: currentText, improved: improved }
    }));
    addToast('AI enhanced your bullet points for max ATS impact!', 'success');
  };

  const acceptAiSuggestion = (fieldKey, section, index) => {
    const sug = aiSuggestions[fieldKey];
    if (!sug) return;

    if (fieldKey === 'summary') {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: sug.improved }
      }));
    }

    setAiSuggestions((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });

    addToast('AI improvement accepted!', 'success');
  };

  const rejectAiSuggestion = (fieldKey) => {
    setAiSuggestions((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleSave = () => {
    addToast('Resume draft saved successfully!', 'success');
  };

  const handleDownloadPdf = () => {
    addToast('Generating printable PDF preview...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header & Controls Bar */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-400" />
                Live Interactive ATS Resume Builder
              </h1>
              <p className="text-xs text-slate-400 mt-1">Build, re-order sections, and enhance bullet points with AI assistance in real-time.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                {['modern', 'professional', 'minimal', 'ats'].map((tmpl) => (
                  <button
                    key={tmpl}
                    onClick={() => setTemplate(tmpl)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                      template === tmpl ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tmpl}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSave}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Editor & Preview Split Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 6 Cols: Form Editor */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Tabs */}
              <div className="flex space-x-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
                {[
                  { id: 'personal', label: 'Personal' },
                  { id: 'summary', label: 'Summary' },
                  { id: 'education', label: 'Education' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'skills', label: 'Skills' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content Panel */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
                
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-3 text-xs">
                    <h3 className="text-sm font-bold text-white mb-2">Personal & Contact Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-medium">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={resumeData.personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium">Professional Title</label>
                        <input
                          type="text"
                          name="title"
                          value={resumeData.personalInfo.title}
                          onChange={handlePersonalInfoChange}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={resumeData.personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-medium">LinkedIn</label>
                        <input
                          type="text"
                          name="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={handlePersonalInfoChange}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium">GitHub / Portfolio</label>
                        <input
                          type="text"
                          name="github"
                          value={resumeData.personalInfo.github}
                          onChange={handlePersonalInfoChange}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Professional Summary</h3>
                      <button
                        onClick={() => handleImproveWithAI('summary', resumeData.personalInfo.summary)}
                        className="px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold flex items-center gap-1 hover:bg-indigo-900"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Improve with AI</span>
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      name="summary"
                      value={resumeData.personalInfo.summary}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white leading-relaxed resize-none"
                    ></textarea>

                    {/* AI Suggestion Box */}
                    {aiSuggestions['summary'] && (
                      <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 space-y-2">
                        <div className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          <span>AI Enhanced Summary Suggestion</span>
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed italic">{aiSuggestions['summary'].improved}</p>
                        <div className="flex space-x-2 pt-1">
                          <button
                            onClick={() => acceptAiSuggestion('summary')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept AI Version
                          </button>
                          <button
                            onClick={() => rejectAiSuggestion('summary')}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-white">Education History</h3>
                    {resumeData.education.map((edu, idx) => (
                      <div key={edu.id || idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].degree = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].institution = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-white">Work & Internship Experience</h3>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="font-bold text-white">{exp.role} at {exp.company}</div>
                        {exp.description.map((desc, dIdx) => (
                          <div key={dIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={desc}
                              onChange={(e) => {
                                const updatedExp = [...resumeData.experience];
                                updatedExp[idx].description[dIdx] = e.target.value;
                                setResumeData({ ...resumeData, experience: updatedExp });
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                            />
                            <button
                              onClick={() => handleImproveWithAI(`exp-${idx}-${dIdx}`, desc)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px]"
                            >
                              AI Enhance
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-white">Key Technical Projects</h3>
                    {resumeData.projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].title = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                        />
                        <input
                          type="text"
                          value={proj.tech}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].tech = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-3 text-xs">
                    <h3 className="text-sm font-bold text-white">Skills Matrix</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((sk, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium">
                          {sk.name} ({sk.level})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right 6 Cols: Live Printable Resume Preview */}
            <div className="lg:col-span-6 sticky top-20">
              <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl min-h-[650px] border border-slate-300 font-sans print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
                
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-4">
                  <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{resumeData.personalInfo.fullName}</h1>
                  <p className="text-sm font-semibold text-slate-700">{resumeData.personalInfo.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600 mt-2 font-medium">
                    <span>{resumeData.personalInfo.email}</span> •
                    <span>{resumeData.personalInfo.phone}</span> •
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600 mt-1 font-mono">
                    <span>{resumeData.personalInfo.github}</span> •
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-800 leading-relaxed">{resumeData.personalInfo.summary}</p>
                </div>

                {/* Education */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Education
                  </h3>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="text-xs mb-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.institution}</span>
                        <span>{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <div className="text-slate-700">{edu.degree} ({edu.score})</div>
                    </div>
                  ))}
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Work Experience
                  </h3>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="text-xs mb-2">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span>{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-800 mt-1">
                        {exp.description.map((d, dIdx) => (
                          <li key={dIdx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Key Projects
                  </h3>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="text-xs mb-2">
                      <div className="font-bold text-slate-900">{proj.title} <span className="font-normal text-slate-600">({proj.tech})</span></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-800 mt-0.5">
                        {proj.description.map((d, dIdx) => (
                          <li key={dIdx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Technical Skills
                  </h3>
                  <p className="text-xs text-slate-800">
                    {resumeData.skills.map((s) => s.name).join(', ')}
                  </p>
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
