import nodemailer from 'nodemailer';

export interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

// Create a transporter for sending emails
const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Missing email configuration. Please check your .env.local file for SMTP settings.'
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

// Generate HTML template for the email
const generateEmailTemplate = (data: EmailData, isReply = false) => {
  if (isReply) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for reaching out!</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 50%, #f5f5f4 100%); 
              padding: 20px; 
              min-height: 100vh;
            }
            .container { max-width: 600px; margin: 0 auto; }
            .email-card { 
              background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(245, 245, 244, 0.6), rgba(255, 255, 255, 0.7));
              backdrop-filter: blur(16px);
              border-radius: 24px; 
              box-shadow: 0 25px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(245, 158, 11, 0.1); 
              overflow: hidden; 
              border: 1px solid rgba(229, 231, 235, 0.5);
            }
            .header { 
              background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%); 
              backdrop-filter: blur(12px);
              padding: 40px 32px; 
              text-align: center; 
              position: relative;
            }
            .header h1 { 
              color: white; 
              font-size: 24px; 
              font-weight: 700; 
              margin-bottom: 8px;
            }
            .header p { 
              color: rgba(255,255,255,0.9); 
              font-size: 14px; 
            }
            .content { padding: 32px; }
            .greeting { 
              font-size: 18px; 
              color: #1f2937; 
              margin-bottom: 16px; 
              font-weight: 600;
            }
            .message { 
              color: #4b5563; 
              font-size: 14px; 
              line-height: 1.6; 
              margin-bottom: 16px; 
            }
            .highlight { 
              background: linear-gradient(120deg, rgba(254, 243, 199, 0.8), rgba(253, 230, 138, 0.8)); 
              padding: 2px 6px; 
              border-radius: 4px; 
              color: #92400e; 
              font-weight: 600;
            }
            .cta-section {
              background: rgba(249, 250, 251, 0.5);
              backdrop-filter: blur(8px);
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
              border: 1px solid rgba(229, 231, 235, 0.3);
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              color: white !important;
              padding: 10px 20px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 13px;
              margin: 6px 4px 0;
              box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
            }
            .footer { 
              background: rgba(249, 250, 251, 0.6); 
              backdrop-filter: blur(8px);
              padding: 20px 32px; 
              text-align: center; 
              border-top: 1px solid rgba(229, 231, 235, 0.3); 
            }
            .footer p { color: #6b7280; font-size: 12px; margin: 2px 0; }
            .signature {
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px solid rgba(229, 231, 235, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-card">
              <div class="header">
                <h1>✨ Thank You for Reaching Out!</h1>
                <p>Your message has been received</p>
              </div>
              <div class="content">
                <div class="greeting">Hi ${data.firstName}! 👋</div>
                
                <div class="message">
                  Thank you for getting in touch! I've received your message about 
                  <span class="highlight">"${data.subject}"</span> and I'm excited to learn more about your project.
                </div>
                
                <div class="message">
                  I'll review your message carefully and get back to you as soon as possible, typically within 24-48 hours. 
                  If your inquiry is urgent, please don't hesitate to reach out again.
                </div>
                
                <div class="cta-section">
                  <h3 style="color: #1f2937; margin-bottom: 8px; font-size: 14px;">While you wait...</h3>
                  <p style="color: #6b7280; margin-bottom: 12px; font-size: 13px;">Feel free to explore my work or connect with me!</p>
                  <a href="#" class="cta-button">View Portfolio</a>
                  <a href="#" class="cta-button">LinkedIn</a>
                </div>
                
                <div class="signature">
                  <div class="message">
                    Best regards,<br>
                    <strong style="color: #1f2937;">Umar Siddiqui</strong><br>
                    <span style="color: #6b7280; font-size: 12px;">Full-Stack Developer</span>
                  </div>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated response. Please do not reply to this email.</p>
                <p>© 2025 Umar Siddiqui Portfolio. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #f5f5f4, #e7e5e4); 
            padding: 20px; 
          }
          .container { max-width: 650px; margin: 0 auto; }
          .email-card { 
            background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(245, 245, 244, 0.6), rgba(255, 255, 255, 0.7)); 
            backdrop-filter: blur(16px);
            border-radius: 20px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(245, 158, 11, 0.1); 
            overflow: hidden; 
            border: 1px solid rgba(229, 231, 235, 0.5);
          }
          .header { 
            background: linear-gradient(135deg, rgba(115, 115, 115, 0.9), rgba(82, 82, 82, 0.9)); 
            backdrop-filter: blur(12px);
            padding: 32px; 
            text-align: center; 
            position: relative;
          }
          .header h1 { 
            color: white; 
            font-size: 24px; 
            font-weight: 700; 
            margin-bottom: 8px;
          }
          .header p { 
            color: rgba(255,255,255,0.8); 
            font-size: 14px; 
          }
          .content { padding: 32px; }
          .urgent-badge {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .field { 
            margin-bottom: 20px; 
            border-bottom: 1px solid rgba(243, 244, 246, 0.5); 
            padding-bottom: 16px;
          }
          .field:last-child { border-bottom: none; }
          .field-label { 
            font-weight: 700; 
            color: #374151; 
            margin-bottom: 6px; 
            display: block; 
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value { 
            color: #1f2937; 
            font-size: 14px; 
            line-height: 1.5; 
          }
          .message-box { 
            background: rgba(249, 250, 251, 0.6); 
            backdrop-filter: blur(8px);
            border: 1px solid rgba(229, 231, 235, 0.5); 
            border-radius: 12px; 
            padding: 20px; 
            margin-top: 12px; 
            position: relative;
          }
          .message-box::before {
            content: '"';
            position: absolute;
            top: -8px;
            left: 16px;
            font-size: 48px;
            color: rgba(209, 213, 219, 0.5);
            font-family: serif;
          }
          .contact-info { 
            background: linear-gradient(135deg, rgba(254, 243, 199, 0.6), rgba(253, 230, 138, 0.6)); 
            backdrop-filter: blur(8px);
            border-radius: 12px; 
            padding: 24px; 
            margin-top: 24px; 
            border: 1px solid rgba(245, 158, 11, 0.3);
          }
          .contact-info h3 { 
            color: #92400e; 
            margin-bottom: 12px; 
            font-size: 16px; 
            font-weight: 700;
          }
          .contact-info p { 
            color: #d97706; 
            margin: 6px 0; 
            font-size: 13px; 
          }
          .quick-actions {
            background: rgba(248, 250, 252, 0.6);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
            border: 1px solid rgba(229, 231, 235, 0.3);
          }
          .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white !important;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 4px;
            font-size: 13px;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          }
          .priority-high { border-left: 4px solid #ef4444; }
          .priority-medium { border-left: 4px solid #f59e0b; }
          .priority-low { border-left: 4px solid #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-card">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>Someone is interested in working with you!</p>
            </div>
            <div class="content">
              ${data.subject.toLowerCase().includes('urgent') ? '<div class="urgent-badge">🚨 Urgent Request</div>' : ''}
              
              <div class="field">
                <span class="field-label">👤 Full Name</span>
                <div class="field-value">${data.firstName} ${data.lastName}</div>
              </div>
              
              <div class="field">
                <span class="field-label">📧 Email Address</span>
                <div class="field-value">
                  <a href="mailto:${data.email}" style="color: #f59e0b; text-decoration: none;">${data.email}</a>
                </div>
              </div>
              
              <div class="field">
                <span class="field-label">📋 Subject</span>
                <div class="field-value">${data.subject}</div>
              </div>
              
              <div class="field">
                <span class="field-label">💬 Message</span>
                <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="quick-actions">
                <h3 style="color: #374151; margin-bottom: 12px; font-size: 14px;">Quick Actions</h3>
                <a href="mailto:${data.email}?subject=Re: ${data.subject}" class="action-button">Reply to ${data.firstName}</a>
                <a href="mailto:${data.email}?subject=Let's schedule a call - ${data.subject}" class="action-button">Schedule Call</a>
              </div>
              
              <div class="contact-info">
                <h3>📞 Contact Details</h3>
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Send email function
export const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = createTransporter();
    
    const result = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send contact form notification
export const sendContactNotification = async (data: EmailData) => {
  const { CONTACT_EMAIL } = process.env;
  
  if (!CONTACT_EMAIL) {
    throw new Error('CONTACT_EMAIL environment variable is required');
  }

  const html = generateEmailTemplate(data, false);
  
  // Create a more descriptive subject line
  const isUrgent = data.subject.toLowerCase().includes('urgent') || data.message.toLowerCase().includes('urgent');
  const subjectPrefix = isUrgent ? '🚨 URGENT' : '📧 New Contact';
  
  return sendEmail({
    to: CONTACT_EMAIL,
    subject: `${subjectPrefix}: ${data.subject} - ${data.firstName} ${data.lastName}`,
    html,
    replyTo: data.email,
  });
};

// Send auto-reply to user
export const sendAutoReply = async (data: EmailData) => {
  const html = generateEmailTemplate(data, true);
  
  return sendEmail({
    to: data.email,
    subject: `Thank you for reaching out! Re: ${data.subject}`,
    html,
  });
};

// Validate email data
export const validateEmailData = (data: unknown): data is EmailData => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const emailData = data as Record<string, unknown>;
  const required = ['firstName', 'lastName', 'email', 'subject', 'message'];
  
  for (const field of required) {
    if (!emailData[field] || typeof emailData[field] !== 'string' || (emailData[field] as string).trim() === '') {
      return false;
    }
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailData.email as string)) {
    return false;
  }
  
  return true;
};
