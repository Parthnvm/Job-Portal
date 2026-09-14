/**
 * Centralized Currency Conversion & Formatting Utilities (Backend)
 *
 * USD to INR conversion rate is configured once here and can be overridden
 * via the USD_TO_INR environment variable.
 */

export const USD_TO_INR = Number(process.env.USD_TO_INR) || 83;

/**
 * Converts a numeric or string USD amount to INR.
 * Returns null if input is null, undefined, or invalid.
 *
 * @param {number|string|null|undefined} amount - The amount in USD.
 * @returns {number|null} The converted amount in INR rounded to integer.
 */
export function convertUSDToINR(amount) {
  if (amount === null || amount === undefined || amount === "") return null;

  let num;
  if (typeof amount === "string") {
    // Check if string has 'k' (e.g., '140k')
    const clean = amount.trim().replace(/[$,]/g, "");
    if (/k$/i.test(clean)) {
      num = parseFloat(clean.slice(0, -1)) * 1000;
    } else {
      num = parseFloat(clean);
    }
  } else {
    num = Number(amount);
  }

  if (isNaN(num)) return null;
  return Math.round(num * USD_TO_INR);
}

/**
 * Formats a numeric amount in the Indian numbering system (en-IN).
 * Examples:
 *   100000   -> "₹1,00,000"
 *   550000   -> "₹5,50,000"
 *   1250000  -> "₹12,50,000"
 *   12500000 -> "₹1,25,00,000"
 *
 * @param {number|string|null|undefined} amount - Numeric value in INR.
 * @returns {string} Formatted Indian Rupee string.
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || amount === "") return "";
  const num = Number(amount);
  if (isNaN(num)) return String(amount);

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(num));

  return `₹${formatted}`;
}

/**
 * Parses and converts a salary string if in USD, or preserves if already in INR.
 * Examples:
 *   "$40,000 - $60,000" -> "₹33,20,000 - ₹49,80,000"
 *   "$140k – $180k"     -> "₹1,16,20,000 – ₹1,49,40,000"
 *   "₹8,00,000 - ₹14,00,000 / yr" -> "₹8,00,000 - ₹14,00,000 / yr" (untouched)
 *
 * @param {string} salaryStr
 * @returns {string}
 */
export function parseAndConvertSalaryString(salaryStr = "") {
  if (!salaryStr || typeof salaryStr !== "string") return salaryStr || "";

  // Guard: if already in INR, do NOT double convert
  if (salaryStr.includes("₹") || /\bINR\b/i.test(salaryStr)) {
    return salaryStr;
  }

  // If USD indicated by $ or USD
  if (salaryStr.includes("$") || /\bUSD\b/i.test(salaryStr)) {
    // Match numbers with optional 'k' or commas
    // Handles formats like "$140k – $180k" or "$40,000 - $60,000" or "$140k"
    const regex = /\$?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k)?/gi;
    const matches = [];
    let match;
    while ((match = regex.exec(salaryStr)) !== null) {
      const valStr = match[1].replace(/,/g, "");
      const isK = Boolean(match[2]);
      const rawNum = parseFloat(valStr) * (isK ? 1000 : 1);
      if (!isNaN(rawNum) && rawNum > 0) {
        matches.push(rawNum);
      }
    }

    if (matches.length >= 2) {
      const minINR = convertUSDToINR(matches[0]);
      const maxINR = convertUSDToINR(matches[1]);
      const suffix = salaryStr.toLowerCase().includes("/ yr") || salaryStr.toLowerCase().includes("/yr") ? " / yr" : "";
      return `${formatINR(minINR)} - ${formatINR(maxINR)}${suffix}`;
    } else if (matches.length === 1) {
      const inr = convertUSDToINR(matches[0]);
      const suffix = salaryStr.toLowerCase().includes("/ yr") || salaryStr.toLowerCase().includes("/yr") ? " / yr" : "";
      return `${formatINR(inr)}${suffix}`;
    }
  }

  return salaryStr;
}

/**
 * Formats a salary range in INR given min, max, and currency code.
 * If currency is "USD", amounts are converted first.
 * If currency is "INR", amounts are NOT converted again (preventing double conversion).
 *
 * @param {number|null} min - Minimum salary amount
 * @param {number|null} max - Maximum salary amount
 * @param {string} [currency="INR"] - Currency code ("USD" | "INR" | "")
 * @param {string} [rawDisplay=""] - Fallback display text
 * @returns {string} Formatted salary display in Indian Rupees.
 */
export function formatSalaryRangeINR(min, max, currency = "INR", rawDisplay = "") {
  const isUSD = (currency || "").toUpperCase() === "USD";

  const numMin = min !== null && min !== undefined && !isNaN(Number(min)) ? Number(min) : null;
  const numMax = max !== null && max !== undefined && !isNaN(Number(max)) ? Number(max) : null;

  if (numMin === null && numMax === null) {
    if (rawDisplay) {
      return parseAndConvertSalaryString(rawDisplay);
    }
    return "";
  }

  const finalMin = numMin !== null ? (isUSD ? convertUSDToINR(numMin) : Math.round(numMin)) : null;
  const finalMax = numMax !== null ? (isUSD ? convertUSDToINR(numMax) : Math.round(numMax)) : null;

  if (finalMin !== null && finalMax !== null) {
    return `${formatINR(finalMin)} - ${formatINR(finalMax)} / yr`;
  }
  if (finalMin !== null) {
    return `From ${formatINR(finalMin)} / yr`;
  }
  if (finalMax !== null) {
    return `Up to ${formatINR(finalMax)} / yr`;
  }

  return rawDisplay || "";
}
