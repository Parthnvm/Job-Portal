import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Auth Pages
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { DashboardPage } from './pages/auth/DashboardPage';
import { FindJobsPage } from './pages/auth/FindJobsPage';
import { JobDetailsPage } from './pages/auth/JobDetailsPage';
import { AIRecommendationsPage } from './pages/auth/AIRecommendationsPage';
import { SavedJobsPage } from './pages/auth/SavedJobsPage';
import { JobApplicationsPage } from './pages/auth/JobApplicationsPage';
import { ResumeAnalyzerPage } from './pages/auth/ResumeAnalyzerPage';
import { ResumeBuilderPage } from './pages/auth/ResumeBuilderPage';
import { ResumeComparePage } from './pages/auth/ResumeComparePage';
import { SkillGapAnalyzerPage } from './pages/auth/SkillGapAnalyzerPage';
import { SkillsRequiredPage } from './pages/auth/SkillsRequiredPage';
import { InterviewPrepPage } from './pages/auth/InterviewPrepPage';
import { MockInterviewPage } from './pages/auth/MockInterviewPage';
import { InterviewResultsPage } from './pages/auth/InterviewResultsPage';
import { CareerRoadmapPage } from './pages/auth/CareerRoadmapPage';
import { StudentProfilePage } from './pages/auth/StudentProfilePage';

// Recruiter Pages
import { RecruiterDashboardPage } from './pages/recruiter/RecruiterDashboardPage';
import { RecruiterPostJobPage } from './pages/recruiter/RecruiterPostJobPage';
import { RecruiterApplicantsPage } from './pages/recruiter/RecruiterApplicantsPage';

export function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppDataProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Student Routes */}
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><FindJobsPage /></ProtectedRoute>} />
              <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailsPage /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute><AIRecommendationsPage /></ProtectedRoute>} />
              <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobsPage /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><JobApplicationsPage /></ProtectedRoute>} />
              <Route path="/resume/analyzer" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
              <Route path="/resume/builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
              <Route path="/resume/compare" element={<ProtectedRoute><ResumeComparePage /></ProtectedRoute>} />
              <Route path="/skills/gap-analysis" element={<ProtectedRoute><SkillGapAnalyzerPage /></ProtectedRoute>} />
              <Route path="/skills/required" element={<ProtectedRoute><SkillsRequiredPage /></ProtectedRoute>} />
              <Route path="/interview" element={<ProtectedRoute><InterviewPrepPage /></ProtectedRoute>} />
              <Route path="/interview/mock" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />
              <Route path="/interview/results" element={<ProtectedRoute><InterviewResultsPage /></ProtectedRoute>} />
              <Route path="/career-roadmap" element={<ProtectedRoute><CareerRoadmapPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />

              {/* Protected Recruiter Routes */}
              <Route path="/recruiter/dashboard" element={<ProtectedRoute requiredRole="recruiter"><RecruiterDashboardPage /></ProtectedRoute>} />
              <Route path="/recruiter/post-job" element={<ProtectedRoute requiredRole="recruiter"><RecruiterPostJobPage /></ProtectedRoute>} />
              <Route path="/recruiter/applicants" element={<ProtectedRoute requiredRole="recruiter"><RecruiterApplicantsPage /></ProtectedRoute>} />

              {/* Catch-all fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppDataProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
