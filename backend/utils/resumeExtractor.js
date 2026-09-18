import crypto from "crypto";
import { PDFParse } from "pdf-parse";

/**
 * Normalizes extracted text:
 * - Strips control characters / null bytes
 * - Normalizes newlines (\r\n -> \n)
 * - Collapses excessive whitespace / blank lines
 * - Trims
 * @param {string} raw
 * @returns {string}
 */
export function normalizeText(raw = "") {
  if (typeof raw !== "string") return "";
  return raw
    // Strip null bytes and non-printable control chars except tabs/newlines
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    // Collapse 3 or more newlines to 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Computes a deterministic SHA256 hash from normalized resume text.
 * Used to detect duplicate submissions and leverage cache.
 * @param {string} text
 * @returns {string}
 */
export function computeResumeHash(text = "") {
  const normalized = normalizeText(text).toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Extracts readable text from a file buffer (PDF, TXT, or Markdown).
 * @param {Buffer|Uint8Array} fileBuffer
 * @param {string} [originalName=""]
 * @param {string} [mimeType=""]
 * @returns {Promise<{ text: string, hash: string, wordCount: number, charCount: number }>}
 */
export async function extractResumeText(fileBuffer, originalName = "", mimeType = "") {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer) && !(fileBuffer instanceof Uint8Array)) {
    throw new Error("Invalid resume buffer provided.");
  }

  if (fileBuffer.length === 0) {
    throw new Error("Uploaded resume file is empty.");
  }

  const isPdfHeader = fileBuffer.slice(0, 5).toString("utf-8").startsWith("%PDF");
  const isPdfExtension = originalName.toLowerCase().endsWith(".pdf");
  const isPdfMime = mimeType === "application/pdf";
  const isPdf = isPdfHeader || isPdfExtension || isPdfMime;

  let rawText = "";

  if (isPdf) {
    try {
      const parser = new PDFParse({ data: fileBuffer });
      const textResult = await parser.getText();
      rawText = textResult?.text || "";
    } catch (pdfErr) {
      // If PDF parsing fails, try safe UTF-8 decoding fallback (in case it was a renamed text file)
      const fallbackText = fileBuffer.toString("utf-8");
      if (fallbackText && /[a-zA-Z]{3,}/.test(fallbackText)) {
        rawText = fallbackText;
      } else {
        throw new Error(`Failed to parse PDF resume: ${pdfErr.message || "Invalid or encrypted PDF"}`);
      }
    }
  } else {
    // Text / markdown / plain document
    rawText = fileBuffer.toString("utf-8");
  }

  const text = normalizeText(rawText);

  // Validate that extracted content has meaningful length
  if (!text || text.length < 50) {
    throw new Error("Resume content is insufficient or could not be extracted (minimum 50 characters required). If using a scanned PDF, please provide a text-based PDF or text document.");
  }

  const words = text.split(/\s+/).filter(Boolean);
  const hash = computeResumeHash(text);

  return {
    text,
    hash,
    wordCount: words.length,
    charCount: text.length
  };
}
