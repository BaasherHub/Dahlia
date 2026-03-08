import { Resend } from 'resend';
import { logError } from './logger.js';

export async function alertAdmin(subject, details) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `Dahlia Shop <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
      subject: `[ALERT] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #d32f2f;">⚠️ Alert</h2>
          <p>${details}</p>
          <p style="font-size: 12px; color: #999;">
            Timestamp: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });
  } catch (err) {
    logError({
      message: 'Failed to send admin alert',
      details,
      error: err.message,
    });
  }
}
