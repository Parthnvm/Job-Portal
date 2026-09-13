import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, DollarSign, Sparkles, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { ExternalJobBadge } from './ExternalJobBadge';

export const JobCard = ({ job }) => {
  const { savedJobIds, toggleSaveJob, applyToJob, applications } = useAppData();
  const { addToast } = useToast();

  // External jobs use _id (MongoDB ObjectId string); internal mock jobs use id
  const jobId = job._id || job.id;
  const providerName = (job.provider || job.source || '').toLowerCase();
  const isExternal = Boolean(job.isExternal || providerName === 'adzuna' || providerName === 'jooble');
  const companyDisplay = job.company || job.companyName || '';
  const salaryDisplay = job.salary || job.salaryDisplay || '';
  const skillsList = job.skills || [];
  const applyUrl = job.externalUrl || job.apply_url || job.source_url || '#';

  const isSaved = savedJobIds.includes(jobId);
  const isApplied = applications.some((app) => app.jobId === jobId);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(jobId);
    addToast(
      isSaved ? `Removed "${job.title}" from saved jobs` : `Saved "${job.title}" to your bookmarks`,
      isSaved ? 'info' : 'success'
    );
  };

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isExternal) {
      // External jobs — open original posting in new tab
      window.open(applyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!isApplied) {
      applyToJob(job);
      addToast(`Successfully applied to ${job.title} at ${companyDisplay}!`, 'success');
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between h-full relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3.5">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={companyDisplay}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 p-1 shrink-0"
              />
            ) : (
              /* Placeholder logo for external jobs without a logo URL */
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-slate-400">
                  {companyDisplay.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{companyDisplay}</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-brand-600/30 text-brand-400 border-brand-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
            title={isSaved ? 'Saved' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-400' : ''}`} />
          </button>
        </div>

        {/* AI Match Badge (internal jobs only) | Attribution badge (external jobs) */}
        <div className="flex items-center space-x-2 mb-3">
          {isExternal ? (
            <>
              <ExternalJobBadge provider={providerName || 'adzuna'} />
              {job.category && (
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  <span>{job.category}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI Match: {job.matchScore}%</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <span>ATS Compatibility: {job.atsCompatibility}%</span>
              </div>
            </>
          )}
        </div>

        {/* Meta badges */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.jobType || job.experience || ''}</span>
          </div>
          {salaryDisplay && (
            <div className="flex items-center space-x-1.5 truncate col-span-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-300">{salaryDisplay}</span>
            </div>
          )}
        </div>

        {/* Skills badges */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skillsList.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-500/20"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] text-slate-400 bg-slate-800">
                +{skillsList.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Description snippet for external jobs */}
        {isExternal && job.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        {isExternal ? (
          /* External jobs — both buttons open the original URL */
          <>
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 text-center rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              View Details
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          /* Internal jobs — original behavior unchanged */
          <>
            <Link
              to={`/jobs/${jobId}`}
              className="flex-1 py-2 text-center rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              View Details
            </Link>

            {isApplied ? (
              <span className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Applied</span>
              </span>
            ) : (
              <button
                onClick={handleApply}
                className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};


