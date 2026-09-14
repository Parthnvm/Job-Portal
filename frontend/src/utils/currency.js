/**
 * Centralized Currency Conversion & Formatting Utilities (Frontend)
 *
 * Provides USD to INR conversion and standard Indian number formatting (en-IN).
 */

export const USD_TO_INR = 83;

/**
 * Converts a numeric or string USD amount to INR.
 *
 * @param {number|string|null|undefined} amount - The amount in USD.
 * @returns {number|null} The converted amount in INR rounded to integer.
 */
export function convertUSDToINR(amount) {
  if (amount === null || amount === undefined || amount === "") return null;

  let num;
  if (typeof amount === "string") {
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
 * Universal salary formatter for any user-facing UI component.
 * Accepts numbers, strings, null, undefined, ranges.
 * Automatically ensures consistent Indian number formatting in ₹.
 *
 * @param {number|string|null|undefined} salary
 * @param {string} [fallback="Competitive"]
 * @returns {string}
 */
export function formatSalaryDisplay(salary, fallback = "Competitive") {
  if (salary === null || salary === undefined || salary === "") {
    return fallback;
  }

  // If it's a number
  if (typeof salary === "number") {
    if (isNaN(salary) || salary <= 0) return fallback;
    // If legacy small USD number (< 500,000), convert to INR
    if (salary < 500000) {
      return `${formatINR(convertUSDToINR(salary))} / yr`;
    }
    // Already in INR (e.g. 1200000)
    return `${formatINR(salary)} / yr`;
  }

  // If it's a string
  if (typeof salary === "string") {
    // If it's purely digits
    if (/^\d+$/.test(salary.trim())) {
      const num = parseInt(salary.trim(), 10);
      if (num < 500000) {
        return `${formatINR(convertUSDToINR(num))} / yr`;
      }
      return `${formatINR(num)} / yr`;
    }

    return parseAndConvertSalaryString(salary);
  }

  return fallback;
}
