import nodemailer from 'nodemailer';

let cachedTransporter = null;

function createTransporter() {
    if (cachedTransporter) return cachedTransporter;

    if (!process.env.SMTP_HOST) {
        console.warn('[email] SMTP_HOST not configured. Emails will be logged to console only.');
        return null;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        } : undefined
    });

    cachedTransporter = transporter;
    return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
    const transporter = createTransporter();

    const from =
        process.env.EMAIL_FROM ||
        `"SCM Marketplace" <no-reply@localhost>`;

    // Fallback: log to console when transporter is not configured
    if (!transporter) {
        console.log('[email:fallback]', { to, subject, text, html });
        return;
    }

    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
    } catch (err) {
        console.error('[email] Failed to send email:', err.message);
    }
}

