import { SITE_CONFIG } from '../data/projects';

export const BUDGET_OPTIONS = [
  '₹800 – ₹2,000',
  '₹2,000 – ₹5,000',
  '₹5,000 – ₹10,000',
  '₹10,000 – ₹15,000',
  '₹15,000 – ₹20,000',
  '₹20,000 – ₹25,000',
] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

export const DEFAULT_BUDGET: BudgetOption = '₹2,000 – ₹5,000';
export const RECIPIENT_EMAIL = SITE_CONFIG.contactEmail;

export interface ProjectBriefInput {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  description: string;
  botField?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProjectBrief(input: Partial<ProjectBriefInput>): ValidationResult {
  if (!input.name || !input.name.trim()) {
    return { isValid: false, error: 'Please provide your name.' };
  }

  if (!input.email || !input.email.trim()) {
    return { isValid: false, error: 'Please provide your email address.' };
  }

  if (!EMAIL_REGEX.test(input.email.trim())) {
    return { isValid: false, error: 'Please provide a valid email address.' };
  }

  if (!input.description || !input.description.trim()) {
    return { isValid: false, error: 'Please describe your project scope and vision.' };
  }

  return { isValid: true };
}

export function formatSubmissionDateTime(date: Date = new Date()): string {
  // Format with Indian Standard Time (IST) as primary, including weekday and time
  try {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }) + ' IST';
  } catch {
    return date.toUTCString();
  }
}

export function generateEmailHtml(data: {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  description: string;
  submissionDateTime: string;
}): string {
  const { name, email, projectType, budgetRange, description, submissionDateTime } = data;

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(projectType);
  const safeBudget = escapeHtml(budgetRange);
  const safeDescription = escapeHtml(description);
  const safeDate = escapeHtml(submissionDateTime);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Inquiry – ${safeName}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; border-spacing: 0;">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(180deg, #18181b 0%, #121215 100%); border-bottom: 1px solid #27272a;">
        <div style="display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #D7FF64; background-color: rgba(215, 255, 100, 0.08); border: 1px solid rgba(215, 255, 100, 0.25); padding: 5px 12px; border-radius: 9999px; margin-bottom: 14px;">
          PROJECT BRIEF TRANSMISSION
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
          New Project Inquiry – ${safeName}
        </h1>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #a1a1aa;">
          Submitted via ${SITE_CONFIG.brandName} portfolio &bull; Recipient: <span style="color: #ffffff;">${RECIPIENT_EMAIL}</span>
        </p>
      </td>
    </tr>

    <!-- Summary Details Table -->
    <tr>
      <td style="padding: 32px 32px 20px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #71717a; width: 140px; vertical-align: top;">
              Client Name
            </td>
            <td style="padding: 10px 0; font-size: 15px; font-weight: 700; color: #ffffff; vertical-align: top;">
              ${safeName}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #71717a; vertical-align: top;">
              Client Email
            </td>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-size: 15px; vertical-align: top;">
              <a href="mailto:${safeEmail}" style="color: #D7FF64; text-decoration: none; font-weight: 600;">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #71717a; vertical-align: top;">
              Project Type
            </td>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-size: 15px; color: #ffffff; font-weight: 500; vertical-align: top;">
              ${safeType}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #71717a; vertical-align: top;">
              Selected Budget
            </td>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-size: 16px; font-weight: 800; color: #D7FF64; vertical-align: top;">
              ${safeBudget}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #71717a; vertical-align: top;">
              Submission Time
            </td>
            <td style="padding: 10px 0; border-top: 1px solid #1f1f23; font-size: 13px; color: #a1a1aa; vertical-align: top;">
              ${safeDate}
            </td>
          </tr>
        </table>

        <!-- Project Scope & Vision Box -->
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #27272a;">
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; margin-bottom: 12px;">
            Project Scope &amp; Vision
          </div>
          <div style="background-color: #18181b; border: 1px solid #27272a; border-left: 3px solid #D7FF64; border-radius: 8px; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">${safeDescription}</div>
        </div>

        <!-- Quick Reply Action Button -->
        <div style="margin-top: 32px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: Project Brief Discussion – ${SITE_CONFIG.ownerName}`)}" style="display: inline-block; background-color: #D7FF64; color: #000000; font-weight: 800; font-size: 12px; text-decoration: none; padding: 14px 32px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
            Reply to ${safeName} &rarr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 18px 32px; background-color: #0c0c0e; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #52525b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;">
        ${SITE_CONFIG.brandName} PORTFOLIO BRIEF
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateEmailText(data: {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  description: string;
  submissionDateTime: string;
}): string {
  const { name, email, projectType, budgetRange, description, submissionDateTime } = data;

  return `============================================================
NEW PROJECT INQUIRY — ${SITE_CONFIG.brandName.toUpperCase()} PORTFOLIO
============================================================

Client Name:          ${name}
Client Email:         ${email}
Project Type:         ${projectType}
Budget Range (INR):   ${budgetRange}
Submission Date/Time: ${submissionDateTime}
Recipient:            ${RECIPIENT_EMAIL}

------------------------------------------------------------
PROJECT SCOPE AND VISION:
------------------------------------------------------------
${description}

============================================================
Reply directly to this email or send to: ${email}
============================================================
`;
}
