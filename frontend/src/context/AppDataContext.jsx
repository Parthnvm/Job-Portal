import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { initialJobs } from '../data/mockJobs';
import { defaultResumeData, defaultAnalysisResult } from '../data/mockResumeData';
import { initialNotifications, mockRecruiterApplicants } from '../data/mockNotifications';
import { defaultRoadmaps } from '../data/mockRoadmap';
import { mockInterviewHistory } from '../data/mockInterview';
import { roleSkillsData } from '../data/mockSkills';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('careerai_jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  const [savedJobIds, setSavedJobIds] = useState(() => {
    const saved = localStorage.getItem('careerai_saved_jobs');
    return saved ? JSON.parse(saved) : ['job-1', 'job-4'];
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('careerai_applications');
    return saved ? JSON.parse(saved) : [
      {
        id: "app-1",
        jobId: "job-1",
        jobTitle: "Full Stack MERN Developer",
        company: "Nexus Technologies",
        location: "Bengaluru, India",
        status: "Interview", // Saved, Applied, Screening, Interview, Offer, Rejected
        appliedDate: "2026-08-15",
        interviewDate: "2026-08-22, 11:00 AM",
        atsScore: 91,
        matchScore: 94
      },
      {
        id: "app-2",
        jobId: "job-2",
        jobTitle: "AI & Frontend Systems Engineer",
        company: "CognitiveAI Labs",
        location: "Hyderabad, India",
        status: "Applied",
        appliedDate: "2026-08-18",
        atsScore: 88,
        matchScore: 90
      },
      {
        id: "app-3",
        jobId: "job-4",
        jobTitle: "Frontend Developer (React)",
        company: "Apex Digital",
        location: "Pune, India",
        status: "Screening",
        appliedDate: "2026-08-14",
        atsScore: 90,
        matchScore: 92
      }
    ];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('careerai_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('careerai_resume');
    return saved ? JSON.parse(saved) : defaultResumeData;
  });

  const [resumeAnalysis, setResumeAnalysis] = useState(() => {
    const saved = localStorage.getItem('careerai_resume_analysis');
    return saved ? JSON.parse(saved) : defaultAnalysisResult;
  });

  const [roadmaps, setRoadmaps] = useState(defaultRoadmaps);
  const [interviewHistory, setInterviewHistory] = useState(mockInterviewHistory);
  const [recruiterApplicants, setRecruiterApplicants] = useState(mockRecruiterApplicants);

  // External jobs fetched from the backend (Adzuna via our API)
  const [externalJobs, setExternalJobs] = useState([]);
  const [externalJobsLoading, setExternalJobsLoading] = useState(false);
  const [externalJobsError, setExternalJobsError] = useState(null);

  const fetchExternalJobs = async (params = {}) => {
    setExternalJobsLoading(true);
    setExternalJobsError(null);
    try {
      const { data } = await API.get('/external-jobs/search', { params });
      if (data.success) {
        setExternalJobs(data.jobs);
      }
    } catch (err) {
      console.warn('[AppDataContext] Could not fetch external jobs:', err.message);
      setExternalJobsError('Could not load external jobs.');
    } finally {
      setExternalJobsLoading(false);
    }
  };

  // Fetch external jobs on mount
  useEffect(() => {
    fetchExternalJobs();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('careerai_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('careerai_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('careerai_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('careerai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('careerai_resume', JSON.stringify(resumeData));
  }, [resumeData]);

  // Actions
  const toggleSaveJob = (jobId) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const applyToJob = (job) => {
    const existing = applications.find((a) => a.jobId === job.id);
    if (!existing) {
      const newApp = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        status: "Applied",
        appliedDate: new Date().toISOString().split('T')[0],
        atsScore: job.atsCompatibility || 85,
        matchScore: job.matchScore || 88
      };
      setApplications((prev) => [newApp, ...prev]);

      // Add automatic notification
      addNotification({
        title: "Application Submitted",
        message: `Your application for ${job.title} at ${job.company} was submitted.`,
        type: "job"
      });
    }
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: notif.title,
      message: notif.message,
      time: "Just now",
      type: notif.type || "job",
      unread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const postNewJob = (newJobData) => {
    const createdJob = {
      ...newJobData,
      id: `job-${Date.now()}`,
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      postedDate: "Just now",
      matchScore: 88,
      atsCompatibility: 85,
      applicantsCount: 0
    };
    setJobs((prev) => [createdJob, ...prev]);
  };

  const addMockInterviewResult = (result) => {
    setInterviewHistory((prev) => [result, ...prev]);
  };

  return (
    <AppDataContext.Provider
      value={{
        jobs,
        externalJobs,
        externalJobsLoading,
        externalJobsError,
        fetchExternalJobs,
        savedJobIds,
        applications,
        notifications,
        resumeData,
        resumeAnalysis,
        roadmaps,
        interviewHistory,
        recruiterApplicants,
        roleSkillsData,
        toggleSaveJob,
        applyToJob,
        updateApplicationStatus,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        setResumeData,
        setResumeAnalysis,
        postNewJob,
        addMockInterviewResult
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
};
