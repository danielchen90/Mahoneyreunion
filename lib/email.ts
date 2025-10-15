/**
 * Email Service Configuration
 * Handles sending email notifications for contact form submissions
 */

import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Admin email addresses (can be configured via environment variables)
const ADMIN_EMAILS = process.env.ADMIN_EMAIL_ADDRESSES?.split(',') || [
  'admin@mahoneyfamily.com',
]

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@mahoneyfamily.com'
const ADMIN_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Send email notification to admins when a contact form is submitted
 */
export async function sendContactFormNotification(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  timestamp: string
  submissionId?: string
}) {
  try {
    const dashboardLink = data.submissionId
      ? `${ADMIN_DASHBOARD_URL}/admin?tab=messages&id=${data.submissionId}`
      : `${ADMIN_DASHBOARD_URL}/admin?tab=messages`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -30px -30px 30px -30px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .field {
              margin-bottom: 20px;
            }
            .field-label {
              font-weight: 600;
              color: #555;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .field-value {
              background-color: #f8f9fa;
              padding: 12px;
              border-radius: 4px;
              border-left: 3px solid #667eea;
            }
            .message-box {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 4px;
              border-left: 3px solid #667eea;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              font-weight: 600;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #888;
              text-align: center;
            }
            .timestamp {
              color: #888;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Contact Form Submission</h1>
            </div>
            
            <p>You have received a new message from the Mahoney Family Reunion website contact form.</p>
            
            <div class="field">
              <div class="field-label">From:</div>
              <div class="field-value"><strong>${data.name}</strong></div>
            </div>
            
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">
                <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">
                  ${data.email}
                </a>
              </div>
            </div>
            
            ${
              data.phone
                ? `
            <div class="field">
              <div class="field-label">Phone:</div>
              <div class="field-value">
                <a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">
                  ${data.phone}
                </a>
              </div>
            </div>
            `
                : ''
            }
            
            <div class="field">
              <div class="field-label">Subject:</div>
              <div class="field-value"><strong>${data.subject}</strong></div>
            </div>
            
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="message-box">${data.message}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Submitted:</div>
              <div class="timestamp">${new Date(data.timestamp).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })}</div>
            </div>
            
            <a href="${dashboardLink}" class="button">
              View in Admin Dashboard →
            </a>
            
            <div class="footer">
              <p>This is an automated notification from the Mahoney Family Reunion website.</p>
              <p>To manage contact form submissions, visit the <a href="${ADMIN_DASHBOARD_URL}/admin" style="color: #667eea;">Admin Dashboard</a>.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Contact Form Submission - Mahoney Family Reunion

From: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Subject: ${data.subject}

Message:
${data.message}

Submitted: ${new Date(data.timestamp).toLocaleString()}

View in Admin Dashboard: ${dashboardLink}
    `

    // Send email to all admin addresses
    const results = await Promise.allSettled(
      ADMIN_EMAILS.map((adminEmail) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: adminEmail.trim(),
          subject: `New Contact Form: ${data.subject}`,
          html: emailHtml,
          text: emailText,
        })
      )
    )

    // Log results
    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(
      `Email notifications sent: ${successful} successful, ${failed} failed`
    )

    return {
      success: successful > 0,
      sent: successful,
      failed: failed,
    }
  } catch (error) {
    console.error('Error sending contact form notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send test email to verify configuration
 */
export async function sendTestEmail(toEmail: string) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'Test Email - Mahoney Family Reunion Admin',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from the Mahoney Family Reunion admin system.</p>
        <p>If you received this, your email configuration is working correctly!</p>
      `,
      text: 'This is a test email from the Mahoney Family Reunion admin system.',
    })

    return { success: true, result }
  } catch (error) {
    console.error('Error sending test email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

