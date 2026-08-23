import React from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { JobCard } from '../../components/jobs/JobCard';
import { AIChatModal } from '../../components/common/AIChatModal';

export const SavedJobsPage = () => {
  const { jobs, savedJobIds } = useAppData();
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-brand-400 fill-brand-400" />
              Saved Job Bookmarks ({savedJobs.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1">Bookmarked opportunities saved for later review and application.</p>
          </div>

          {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass-card rounded-3xl border border-slate-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No saved jobs yet</h3>
              <p className="text-xs text-slate-400">Click the bookmark icon on any job card to save it here.</p>
            </div>
          )}
        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
