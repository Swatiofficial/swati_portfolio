import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import {
  validateProjectBrief,
  formatSubmissionDateTime,
  generateEmailHtml,
  generateEmailText,
  RECIPIENT_EMAIL,
  DEFAULT_BUDGET,
} from '@/lib/contact';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      );
    }

    const {
      name = '',
      email = '',
      projectType = 'Video Editing',
      budgetRange = DEFAULT_BUDGET,
      description = '',
      botField = '',
    } = body;

    // Honeypot anti-spam check: silently suppress automated spam
    if (botField && typeof botField === 'string' && botField.trim().length > 0) {
      console.warn('[Contact API] Honeypot triggered by bot. Suppressing transmission.');
      return NextResponse.json({
        success: true,
        message: "Your project brief has been sent successfully. I'll get back to you soon.",
      });
    }

    // Server-side validation
    const validation = validateProjectBrief({ name, email, projectType, budgetRange, description });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const clientName = name.trim();
    const clientEmail = email.trim();
    const cleanProjectType = (projectType || 'Video Editing').trim();
    const cleanBudget = (budgetRange || DEFAULT_BUDGET).trim();
    const cleanDescription = description.trim();
    const submissionDateTime = formatSubmissionDateTime(new Date());

    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || RECIPIENT_EMAIL;
    const subject = `New Project Inquiry – ${clientName}`;

    const htmlContent = generateEmailHtml({
      name: clientName,
      email: clientEmail,
      projectType: cleanProjectType,
      budgetRange: cleanBudget,
      description: cleanDescription,
      submissionDateTime,
    });

    const textContent = generateEmailText({
      name: clientName,
      email: clientEmail,
      projectType: cleanProjectType,
      budgetRange: cleanBudget,
      description: cleanDescription,
      submissionDateTime,
    });

    // =========================================================================
    // 1. PRIMARY PROVIDER: RESEND (Active when RESEND_API_KEY is configured)
    // =========================================================================
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const resendSender =
        process.env.RESEND_FROM?.trim() || 'Portfolio Brief <onboarding@resend.dev>';

      try {
        const { data, error } = await resend.emails.send({
          from: resendSender,
          to: [recipient],
          replyTo: `${clientName} <${clientEmail}>`,
          subject,
          html: htmlContent,
          text: textContent,
        });

        if (error) {
          console.error('[Contact API] Resend dispatch error:', error);

          let errorMessage = `Resend delivery failed: ${error.message}`;

          // Handle Resend recipient restrictions on test domain (onboarding@resend.dev)
          if (
            error.message?.includes('only send testing emails to your own email address') ||
            (error as { statusCode?: number }).statusCode === 403
          ) {
            errorMessage =
              `Resend restriction: The testing domain "onboarding@resend.dev" can only deliver to the email address registered on your Resend account. ` +
              `If ${recipient} is not your Resend account email, please verify your custom domain in Resend (resend.com/domains) and set RESEND_FROM in .env.local, or create your Resend account using ${recipient}.`;
          } else if (
            error.message?.includes('API key') ||
            (error as { statusCode?: number }).statusCode === 401
          ) {
            errorMessage =
              'Invalid Resend API Key. Please verify RESEND_API_KEY in .env.local.';
          }

          return NextResponse.json(
            {
              success: false,
              code: error.name || 'RESEND_ERROR',
              error: errorMessage,
            },
            { status: 502 }
          );
        }

        console.log('[Contact API] Email successfully delivered via Resend. ID:', data?.id);
        return NextResponse.json({
          success: true,
          message: "Your project brief has been sent successfully. I'll get back to you soon.",
          id: data?.id,
        });
      } catch (err: unknown) {
        console.error('[Contact API] Unexpected Resend exception:', err);
        const msg = err instanceof Error ? err.message : 'Resend request failed';
        return NextResponse.json(
          {
            success: false,
            code: 'RESEND_EXCEPTION',
            error: `Failed to communicate with Resend: ${msg}`,
          },
          { status: 502 }
        );
      }
    }

    // =========================================================================
    // 2. FALLBACK PROVIDER: SMTP (Only used if RESEND_API_KEY is not set)
    // =========================================================================
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass && smtpPass.trim()) {
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
      const smtpSecure =
        process.env.SMTP_SECURE !== undefined
          ? process.env.SMTP_SECURE === 'true'
          : smtpPort === 465;

      const cleanPassword = smtpPass.replace(/\s+/g, '');

      const transporter = nodemailer.createTransport(
        smtpHost === 'smtp.gmail.com'
          ? {
              service: 'gmail',
              auth: {
                user: smtpUser.trim(),
                pass: cleanPassword,
              },
            }
          : {
              host: smtpHost,
              port: smtpPort,
              secure: smtpSecure,
              auth: {
                user: smtpUser.trim(),
                pass: cleanPassword,
              },
            }
      );

      try {
        const info = await transporter.sendMail({
          from: `"${clientName} (via Portfolio)" <${smtpUser.trim()}>`,
          to: recipient,
          replyTo: `"${clientName}" <${clientEmail}>`,
          subject,
          text: textContent,
          html: htmlContent,
        });

        console.log('[Contact API] Email delivered via SMTP. ID:', info.messageId);

        return NextResponse.json({
          success: true,
          message: "Your project brief has been sent successfully. I'll get back to you soon.",
          messageId: info.messageId,
        });
      } catch (mailError: unknown) {
        console.error('[Contact API] Nodemailer SMTP Error:', mailError);
        const err = mailError as { code?: string; response?: string; message?: string };
        let clientErrorMessage = 'Failed to deliver email through SMTP server.';
        if (
          err?.code === 'EAUTH' ||
          (typeof err?.response === 'string' && err.response.includes('535'))
        ) {
          clientErrorMessage =
            'SMTP authentication failed. Please verify credentials in .env.local.';
        } else if (err?.message) {
          clientErrorMessage = `Email delivery error: ${err.message}`;
        }

        return NextResponse.json(
          {
            success: false,
            code: err?.code || 'SEND_FAILURE',
            error: clientErrorMessage,
          },
          { status: 502 }
        );
      }
    }

    // =========================================================================
    // 3. UNCONFIGURED STATE (Neither RESEND_API_KEY nor SMTP credentials set)
    // =========================================================================
    console.warn(
      `[Contact API] Delivery rejected: No email provider configured. RESEND_API_KEY missing in .env.local.`
    );
    return NextResponse.json(
      {
        success: false,
        code: 'UNCONFIGURED',
        error:
          `Email service is not configured yet. Please add your RESEND_API_KEY in .env.local to enable automated delivery to ${RECIPIENT_EMAIL}.`,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('[Contact API] Unexpected error handling contact form submission:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while sending your brief. Please try again.',
      },
      { status: 500 }
    );
  }
}
