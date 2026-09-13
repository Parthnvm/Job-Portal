import React from 'react';

/**
 * ExternalJobBadge — Attribution component for external job providers (Adzuna & Jooble).
 *
 * Adzuna: Terms of Service require a "Jobs by Adzuna" label (min 116×23px) hyperlinked to adzuna.in.
 * Jooble: Attribution label "Jobs by Jooble" hyperlinked to in.jooble.org.
 */
export const ExternalJobBadge = ({ provider = 'adzuna', country = 'in', className = '' }) => {
  const isJooble = provider?.toLowerCase() === 'jooble';

  if (isJooble) {
    return (
      <a
        href="https://in.jooble.org"
        target="_blank"
        rel="noopener noreferrer"
        title="Jobs by Jooble"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium
          bg-blue-950/50 border border-blue-500/30 text-blue-300
          hover:bg-blue-950/70 hover:text-blue-200 transition-colors
          ${className}`}
        style={{ minHeight: 23 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <span>
          <span className="text-blue-400 font-semibold">Jobs</span>
          {' '}by{' '}
          <span className="text-blue-400 font-semibold">Jooble</span>
        </span>
      </a>
    );
  }

  // Adzuna attribution (default)
  const adzunaUrl = country === 'in'
    ? 'https://www.adzuna.in'
    : 'https://www.adzuna.com';

  return (
    <a
      href={adzunaUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Jobs by Adzuna"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium
        bg-orange-950/50 border border-orange-500/30 text-orange-300
        hover:bg-orange-950/70 hover:text-orange-200 transition-colors
        ${className}`}
      style={{ minWidth: 116, minHeight: 23 }}
    >
      {/* Adzuna "A" logo mark */}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 20h20L12 2zm0 4l7 12H5L12 6z" />
      </svg>
      <span>
        <span className="text-orange-400 font-semibold">Jobs</span>
        {' '}by{' '}
        <span className="text-orange-400 font-semibold">Adzuna</span>
      </span>
    </a>
  );
};
