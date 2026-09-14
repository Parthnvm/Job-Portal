import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, RefreshCw, Briefcase, Filter } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { useAppData } from '../../context/AppDataContext';
import { JobCard } from '../../components/jobs/JobCard';
import { AIChatModal } from '../../components/common/AIChatModal';
import { getJobNumericSalary } from '../../utils/currency';

export const FindJobsPage = () => {
  const { jobs, externalJobs = [] } = useAppData();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [titleQuery, setTitleQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [sortBy, setSortBy] = useState('best-match');

  const allJobs = useMemo(() => [...jobs, ...externalJobs], [jobs, externalJobs]);

  const filteredJobs = useMemo(() => {
    return allJobs
      .filter((job) => {
        const jobCompany = job.company || job.companyName || '';
        const jobType = job.type || job.jobType || '';
        const jobExperience = job.experience || '';
        const jobSkills = job.skills || [];
        const matchScore = job.matchScore || 0;
        
        const matchesTitle =
          !titleQuery ||
          job.title.toLowerCase().includes(titleQuery.toLowerCase()) ||
          jobCompany.toLowerCase().includes(titleQuery.toLowerCase()) ||
          jobSkills.some((s) => s.toLowerCase().includes(titleQuery.toLowerCase()));

        const matchesLocation =
          !locationQuery || job.location.toLowerCase().includes(locationQuery.toLowerCase());

        const matchesType = selectedType === 'All' || jobType === selectedType;

        const matchesExp =
          selectedExperience === 'All' ||
          (selectedExperience === 'Freshers' && (jobExperience.includes('0') || jobExperience.includes('Freshers'))) ||
          (selectedExperience === '1-3 Years' && (jobExperience.includes('1') || jobExperience.includes('2')));

        const matchesScore = matchScore >= minMatch;

        return matchesTitle && matchesLocation && matchesType && matchesExp && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'best-match') return (b.matchScore || 0) - (a.matchScore || 0);
        if (sortBy === 'ats') return (b.atsCompatibility || 0) - (a.atsCompatibility || 0);
        if (sortBy === 'salary-high') return getJobNumericSalary(b) - getJobNumericSalary(a);
        if (sortBy === 'salary-low') return getJobNumericSalary(a) - getJobNumericSalary(b);
        if (sortBy === 'latest') return new Date(b.postedDate || b.postedAt || 0) - new Date(a.postedDate || a.postedAt || 0);
        return 0;
      });
  }, [allJobs, titleQuery, locationQuery, selectedType, selectedExperience, minMatch, sortBy]);

  const resetFilters = () => {
    setTitleQuery('');
    setLocationQuery('');
    setSelectedType('All');
    setSelectedExperience('All');
    setMinMatch(0);
    setSortBy('best-match');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex space-x-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Find AI-Matched Tech Jobs</h1>
            <p className="text-xs text-slate-400 mt-1">Discover software engineering roles scored by CareerAI match algorithms.</p>
          </div>

          {/* Search Inputs Bar */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Job Title / Skill */}
              <div className="md:col-span-6 relative">
                <input
                  type="text"
                  placeholder="What job or skill are you looking for? (e.g., React, Node, MERN)"
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Location */}
              <div className="md:col-span-4 relative">
                <input
                  type="text"
                  placeholder="Location (e.g., Bengaluru, Remote, Pune)"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Sort By */}
              <div className="md:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="best-match">Best AI Match</option>
                  <option value="ats">Highest ATS Score</option>
                  <option value="salary-high">Highest Salary (INR)</option>
                  <option value="salary-low">Lowest Salary (INR)</option>
                  <option value="latest">Latest Jobs</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Job Type */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300"
                >
                  <option value="All">All Job Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                </select>

                {/* Experience */}
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300"
                >
                  <option value="All">All Experience Levels</option>
                  <option value="Freshers">Freshers / Students (0-1 Yrs)</option>
                  <option value="1-3 Years">1-3 Years</option>
                </select>

                {/* Min AI Match Slider */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg">
                  <span className="text-slate-400 text-[11px]">Min AI Match: <strong className="text-brand-400">{minMatch}%</strong></span>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="10"
                    value={minMatch}
                    onChange={(e) => setMinMatch(Number(e.target.value))}
                    className="w-20 accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{filteredJobs.length}</strong> matching tech opportunities</span>
          </div>

          {/* Jobs Cards Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass-card rounded-3xl border border-slate-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No matching jobs found</h3>
              <p className="text-xs text-slate-400">Try adjusting your location query or lowering the minimum AI match filter.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}

        </main>
      </div>

      <AIChatModal />
      <Footer />
    </div>
  );
};
