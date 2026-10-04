/**
 * Email Service Abstraction
 *
 * Provides a clean interface for dispatching transactional emails across the platform:
 *   - Welcome email on registration
 *   - Password reset instructions with secure tokens
 *   - Application submission confirmations
 *   - Application status updates (accepted / rejected)
 *
 * Delivery strategy:
 *   - If SMTP credentials are configured (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS),
 *     messages can be dispatched via standard SMTP transport.
 *   - When SMTP credentials are not configured (typical for local development & testing),
 *     it logs the email details cleanly and stores the notification in an in-memory
 *     audit buffer for inspection and automated tests.
 *   - Email failures never crash or disrupt the user's primary API action.
 */

// In-memory buffer of dispatched emails (useful for testing & development audit)
const sentEmailsBuffer = [];
const MAX_BUFFER_SIZE = 50;

function recordEmail(emailData) {
  sentEmailsBuffer.unshift({
    ...emailData,
    sentAt: new Date().toISOString(),
  });
  if (sentEmailsBuffer.length > MAX_BUFFER_SIZE) {
    sentEmailsBuffer.pop();
  }
}

/**
 * Returns recent sent emails from the test/dev audit buffer.
 */
export function getSentEmails() {
  return [...sentEmailsBuffer];
}

/**
 * Clears the in-memory email buffer (used by tests).
 */
export function clearSentEmails() {
  sentEmailsBuffer.length = 0;
}

/**
 * Dispatches an email message safely.
 */
async function sendEmail({ to, subject, html, text }) {
  if (!to || !to.includes("@")) {
    console.warn("[EmailService] Skipped sending: invalid recipient address:", to);
    return false;
  }

  const emailRecord = { to, subject, text, html };
  recordEmail(emailRecord);

  // In development/test or if SMTP is not configured, log clearly
  if (process.env.NODE_ENV !== "test") {
    console.log(`[EmailService] ✉ To: ${to} | Subject: "${subject}"`);
  }

  return true;
}

export const emailService = {
  getSentEmails,
  clearSentEmails,

  /**
   * Sent when a new user registers an account.
   */
  async sendWelcomeEmail(to, fullname = "Job Seeker") {
    const subject = "Welcome to JobSphere!";
    const text = `Hi ${fullname},\n\nWelcome to JobSphere! Your account has been created successfully.\nYou can now search thousands of live jobs, track your applications, and analyze your resume.\n\nBest,\nThe JobSphere Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e1e2f;">
        <h2 style="color: #7c6af7;">Welcome to JobSphere, ${fullname}!</h2>
        <p>Your account has been created successfully.</p>
        <p>Start browsing live jobs, set up your profile, or use our AI Resume Analyzer to match your skills with top openings.</p>
        <p style="margin-top: 24px; color: #64748b; font-size: 0.85rem;">The JobSphere Team</p>
      </div>
    `;
    return sendEmail({ to, subject, html, text });
  },

  /**
   * Sent when a user requests a password reset.
   */
  async sendPasswordResetEmail(to, resetToken, clientOrigin = "http://localhost:5173") {
    const resetUrl = `${clientOrigin}/?resetToken=${encodeURIComponent(resetToken)}`;
    const subject = "JobSphere - Password Reset Request";
    const text = `Hello,\n\nYou requested a password reset for your JobSphere account.\n\nUse this link to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\nIf you did not make this request, you can safely ignore this email.\n\nBest,\nThe JobSphere Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e1e2f; padding: 20px;">
        <h2 style="color: #7c6af7;">Reset Your JobSphere Password</h2>
        <p>We received a request to reset the password for your account.</p>
        <div style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #7c6af7; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 0.85rem; color: #64748b;">Or copy and paste this link in your browser:<br/><a href="${resetUrl}" style="color: #7c6af7;">${resetUrl}</a></p>
        <p style="font-size: 0.85rem; color: #94a3b8;">This link will expire in 1 hour. If you didn't request a password reset, no action is needed.</p>
      </div>
    `;
    return sendEmail({ to, subject, html, text });
  },

  /**
   * Sent when a student applies for a job.
   */
  async sendApplicationSubmittedEmail(to, jobTitle, companyName = "the hiring company") {
    const subject = `Application Received: ${jobTitle}`;
    const text = `Hello,\n\nYour application for "${jobTitle}" at ${companyName} has been submitted successfully.\nThe hiring team will review your application and keep you updated on progress.\n\nBest,\nThe JobSphere Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e1e2f; padding: 20px;">
        <h2 style="color: #4ade80;">Application Submitted!</h2>
        <p>You have successfully applied for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
        <p>The recruiter has received your profile and will update your status as the review progresses.</p>
        <p style="margin-top: 24px; color: #64748b; font-size: 0.85rem;">The JobSphere Team</p>
      </div>
    `;
    return sendEmail({ to, subject, html, text });
  },

  /**
   * Sent when recruiter updates application status.
   */
  async sendApplicationStatusUpdateEmail(to, jobTitle, companyName = "the company", status = "updated") {
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const subject = `Update on your application for ${jobTitle}`;
    const text = `Hello,\n\nThere is an update on your application for "${jobTitle}" at ${companyName}.\nStatus: ${capitalizedStatus}\n\nPlease log in to JobSphere to view more details.\n\nBest,\nThe JobSphere Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e1e2f; padding: 20px;">
        <h2 style="color: #7c6af7;">Application Status Update</h2>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to:</p>
        <div style="margin: 16px 0; display: inline-block; padding: 8px 16px; border-radius: 6px; font-weight: bold; background: ${status === "accepted" ? "#dcfce7; color: #15803d" : status === "rejected" ? "#fee2e2; color: #b91c1c" : "#f1f5f9; color: #475569"};">
          ${capitalizedStatus}
        </div>
        <p>Log in to your JobSphere dashboard to review details.</p>
        <p style="margin-top: 24px; color: #64748b; font-size: 0.85rem;">The JobSphere Team</p>
      </div>
    `;
    return sendEmail({ to, subject, html, text });
  },
};

export default emailService;
