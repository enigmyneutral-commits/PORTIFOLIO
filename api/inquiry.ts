import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: Record<string, string>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => void;
  send: (data: any) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use raw
      }
    }

    const {
      fullName,
      workEmail,
      company,
      projectType,
      budgetRange,
      timeline,
      projectDescription,
      preferredContact,
      requiresNda,
      honeypot,
      source,
      auditReport,
    } = body || {};

    if (honeypot) {
      return res.status(400).json({ error: 'Honeypot triggered.' });
    }

    if (!fullName || !workEmail || (!projectDescription && !auditReport)) {
      return res.status(400).json({
        error: 'Missing required fields: fullName, workEmail and projectDescription are required.',
      });
    }

    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'enigmyneutral@gmail.com';
    const resendKey = process.env.RESEND_API_KEY;

    const emailSubject = `[Enigmy Neutral Lead] ${projectType || 'Project Inquiry'} — ${fullName} (${company || 'Direct'})`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080A0B; color: #F5F7F4; padding: 32px; border-radius: 8px; max-width: 650px; margin: 0 auto; border: 1px solid #293033;">
        <div style="border-bottom: 1px solid #293033; padding-bottom: 20px; margin-bottom: 24px;">
          <h2 style="color: #B7F36B; margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">ENIGMY NEUTRAL</h2>
          <p style="margin: 0; color: #A4ADA8; font-size: 13px;">New Project Scope Inquiry & Client Lead</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77; width: 140px;">Source:</td>
            <td style="padding: 10px 0; color: #B7F36B; font-weight: 600;">${source === 'chat_agent' ? 'Engineering Agent Chat' : 'Project Inquiry Questionnaire'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Client Name:</td>
            <td style="padding: 10px 0; color: #F5F7F4; font-weight: 600;">${fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Work Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${workEmail}" style="color: #B7F36B; text-decoration: none;">${workEmail}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Company / Org:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${company || 'Not informed'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #F5F7F4;">Project Type:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${projectType || 'Software Development'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Budget Range:</td>
            <td style="padding: 10px 0; color: #55D68B; font-weight: 600;">${budgetRange || 'Flexible'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Target Timeline:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${timeline || 'Immediate / Flexible'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Preferred Contact:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${preferredContact || 'email'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Requires NDA:</td>
            <td style="padding: 10px 0; color: ${requiresNda ? '#F2C66D' : '#A4ADA8'}; font-weight: 600;">${requiresNda ? 'YES — Mutual NDA Required' : 'No'}</td>
          </tr>
        </table>

        <div style="background-color: #101315; border: 1px solid #293033; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #A4ADA8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Project Description & Requirements:</h4>
          <p style="margin: 0; color: #F5F7F4; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${projectDescription || 'No additional description provided.'}</p>
        </div>

        ${auditReport ? `
        <div style="background-color: #15191B; border: 1px solid #293033; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #B7F36B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Attached AI Agent Audit Summary:</h4>
          <pre style="margin: 0; color: #A4ADA8; font-size: 12px; overflow-x: auto; font-family: monospace;">${typeof auditReport === 'string' ? auditReport : JSON.stringify(auditReport, null, 2)}</pre>
        </div>
        ` : ''}

        <div style="border-top: 1px solid #293033; padding-top: 16px; font-size: 12px; color: #737D77; display: flex; justify-content: space-between;">
          <span>Recipient: ${recipient}</span>
          <span>Submitted at: ${new Date().toUTCString()}</span>
        </div>
      </div>
    `;

    if (resendKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Enigmy Neutral <onboarding@resend.dev>',
          to: [recipient],
          reply_to: workEmail,
          subject: emailSubject,
          html: htmlBody,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        return res.status(502).json({
          error: 'Email delivery failed upstream',
          details: errorText,
        });
      }

      const emailData = await emailResponse.json();
      return res.status(200).json({
        success: true,
        delivery: 'resend',
        id: emailData.id,
        message: 'Project inquiry dispatched successfully to Marcos Dresbach.',
      });
    }

    return res.status(200).json({
      success: true,
      delivery: 'simulated',
      message: 'Inquiry received and logged. Add RESEND_API_KEY to .env to deliver live emails to enigmyneutral@gmail.com.',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to process project inquiry',
      message: error?.message || 'Unknown error',
    });
  }
}
