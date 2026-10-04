/**
 * Robust date parser and normalizer for job publication dates.
 *
 * Requirements:
 * - Handle ISO dates, timestamps (seconds and milliseconds), relative dates, missing/invalid dates.
 * - Do NOT fabricate publication dates (returns null if unparseable or missing).
 * - Distinguish actual provider publication date from fetched/imported timestamps.
 */

/**
 * Normalizes different possible provider date formats into a standard Date object or null.
 *
 * @param {string|number|Date|null|undefined} rawDate
 * @returns {Date|null} Valid Date object, or null if date is missing/invalid.
 */
export function parsePublicationDate(rawDate) {
  if (rawDate === null || rawDate === undefined || rawDate === "") {
    return null;
  }

  // If already a Date object
  if (rawDate instanceof Date) {
    return isNaN(rawDate.getTime()) ? null : rawDate;
  }

  // If timestamp number
  if (typeof rawDate === "number") {
    if (isNaN(rawDate) || rawDate <= 0) return null;
    // If in seconds (Unix epoch seconds: ~10 digits, e.g. 1700000000)
    if (rawDate < 1e11) {
      const d = new Date(rawDate * 1000);
      return isNaN(d.getTime()) ? null : d;
    }
    // If in milliseconds (~13 digits)
    const d = new Date(rawDate);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof rawDate !== "string") {
    return null;
  }

  const trimmed = rawDate.trim();
  if (!trimmed) return null;

  // Pure numeric string
  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    if (!isNaN(num) && num > 0) {
      if (num < 1e11) {
        const d = new Date(num * 1000);
        return isNaN(d.getTime()) ? null : d;
      }
      const d = new Date(num);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const lower = trimmed.toLowerCase();

  // Relative dates
  if (lower === "today" || lower === "just now" || lower === "now") {
    return new Date();
  }
  if (lower === "yesterday") {
    return new Date(Date.now() - 24 * 60 * 60 * 1000);
  }

  // Matches like "3 days ago", "1 day ago", "5 hours ago", "30 mins ago", "2 weeks ago", "1 month ago"
  const relMatch = lower.match(/^(\d+)\s*(minute|min|hour|hr|day|week|month)s?\s*ago$/);
  if (relMatch) {
    const amount = parseInt(relMatch[1], 10);
    const unit = relMatch[2];
    let ms = 0;
    if (unit.startsWith("min")) ms = amount * 60 * 1000;
    else if (unit.startsWith("hour") || unit === "hr") ms = amount * 60 * 60 * 1000;
    else if (unit.startsWith("day")) ms = amount * 24 * 60 * 60 * 1000;
    else if (unit.startsWith("week")) ms = amount * 7 * 24 * 60 * 60 * 1000;
    else if (unit.startsWith("month")) ms = amount * 30 * 24 * 60 * 60 * 1000;

    if (ms > 0) {
      return new Date(Date.now() - ms);
    }
  }

  // Standard ISO / RFC / date string parse
  // Handle space separator instead of T (e.g. "2026-09-10 18:30:00")
  const standardDate = new Date(trimmed.includes(" ") && !trimmed.includes("T") ? trimmed.replace(" ", "T") : trimmed);
  if (!isNaN(standardDate.getTime())) {
    // Sanity check: publication date should not be unreasonably in the distant future (> 7 days from now)
    // or before the year 2000
    const year = standardDate.getFullYear();
    if (year >= 2000 && standardDate.getTime() <= Date.now() + 7 * 24 * 60 * 60 * 1000) {
      return standardDate;
    }
  }

  return null;
}

/**
 * Returns a human-friendly relative time string or null if the date is missing/invalid.
 * NEVER fabricates "1d ago" for missing or invalid dates.
 *
 * @param {string|number|Date|null|undefined} dateInput
 * @returns {string|null} e.g. "Just now", "2h ago", "3d ago", or null
 */
export function formatRelativeTime(dateInput) {
  const date = parsePublicationDate(dateInput);
  if (!date) return null;

  const now = Date.now();
  const diffMs = now - date.getTime();

  if (diffMs < 0) {
    // Slight clock drift or posted within future seconds
    return "Just now";
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  return `${Math.floor(diffDays / 365)}y ago`;
}
