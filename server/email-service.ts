import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer;
    path?: string;
    contentType?: string;
  }>;
}

interface FormSubmissionEmailData {
  eventName: string;
  studentName: string;
  email: string;
  submissionDate: Date;
  quantity: number;
  totalAmount: number;
  notes?: string;
  forms?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

interface ApprovalEmailData {
  eventName: string;
  studentName: string;
  ticketPurchaseUrl: string;
  quantity: number;
  totalAmount: number;
}

interface RejectionEmailData {
  eventName: string;
  studentName: string;
  reason: string;
  retryUrl: string;
}

class EmailService {
  private fromEmail: string;
  private adminEmail: string;
  private transporter: nodemailer.Transporter;

  constructor() {
    // Get email addresses from environment variables or use defaults
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@eshsasb.org';
    this.adminEmail = process.env.ADMIN_EMAIL || 'theo@bongbong.com';

    // Configure transporter for local Postfix only
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 25,
      secure: false,
      auth: {
        user: '', // No auth needed for local Postfix
        pass: ''
      },
      // Options for local Postfix delivery
      tls: {
        rejectUnauthorized: false
      },
      // Additional Postfix options
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email transporter configuration error:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, html, attachments = [] } = options;
    
    try {
      const mailOptions = {
        from: `El Segundo High ASB <${this.fromEmail}>`,
        to,
        subject,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}:`, info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendFormSubmissionReceipt(to: string, data: FormSubmissionEmailData, attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 30px; margin-top: 0; border-radius: 0 0 8px 8px; }
    .info-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #003366; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    .attachments { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #b3d9ff; }
    .status-badge { display: inline-block; padding: 5px 10px; background: #ffd700; color: #333; border-radius: 15px; font-weight: bold; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📧 Submission Receipt</h2>
      <p style="margin: 0; font-size: 14px;">Your form submission has been received</p>
    </div>
    <div class="content">
      <p>Dear ${data.studentName},</p>
      
      <p>Thank you for submitting your forms for <strong>${data.eventName}</strong>. This email serves as your receipt and confirmation that we have received your submission.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #667eea;">📋 Submission Details</h3>
        <div class="info-row">
          <span class="label">Event:</span> ${data.eventName}
        </div>
        <div class="info-row">
          <span class="label">Submission Date:</span> ${new Date(data.submissionDate).toLocaleString()}
        </div>
        <div class="info-row">
          <span class="label">Quantity:</span> ${data.quantity}
        </div>
        <div class="info-row">
          <span class="label">Total Amount:</span> $${data.totalAmount.toFixed(2)}
        </div>
        ${data.notes ? `
        <div class="info-row">
          <span class="label">Your Notes:</span> ${data.notes}
        </div>
        ` : ''}
        <div class="info-row">
          <span class="label">Status:</span> <span class="status-badge">⏳ PENDING REVIEW</span>
        </div>
      </div>
      
      <div class="attachments">
        <p><strong>📎 Submitted Forms:</strong></p>
        <p style="font-size: 14px; color: #666;">The following forms have been submitted and are attached to this email for your records:</p>
        <ul>
          ${data.forms?.map(form => `<li>${form.fileName}</li>`).join('') || '<li>No forms attached</li>'}
        </ul>
      </div>
      
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h4 style="margin-top: 0; color: #2e7d32;">📬 What happens next?</h4>
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>Your submission will be reviewed by an administrator</li>
          <li>You will receive an email notification once your request is approved or if additional information is needed</li>
          <li>If approved, you'll receive instructions for completing your purchase</li>
        </ol>
        <p style="margin-bottom: 0; font-size: 14px;"><strong>Expected review time:</strong> Within 1-2 business days</p>
      </div>
      
      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        <strong>Important:</strong> Please keep this email for your records. The attached forms are the same documents you submitted. If you have any questions about your submission, please contact the ASB office.
      </p>
    </div>
    <div class="footer">
      <p><strong>El Segundo High School ASB Team</strong></p>
      <p style="font-size: 12px;">This is an automated receipt. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;

    const emailAttachments = attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType
    })) || [];

    await this.sendEmail({
      to,
      subject: `📧 Submission Receipt - ${data.eventName}`,
      html,
      attachments: emailAttachments
    });
  }

  async sendFormSubmissionNotification(data: FormSubmissionEmailData, attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #003366; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #003366; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    .attachments { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📝 New Activity Form Submission</h2>
    </div>
    <div class="content">
      <p>A new form submission has been received for review:</p>
      
      <div class="info-row">
        <span class="label">Event:</span> ${data.eventName}
      </div>
      <div class="info-row">
        <span class="label">Student Name:</span> ${data.studentName}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${data.email}
      </div>
      <div class="info-row">
        <span class="label">Submission Date:</span> ${new Date(data.submissionDate).toLocaleString()}
      </div>
      <div class="info-row">
        <span class="label">Quantity:</span> ${data.quantity}
      </div>
      <div class="info-row">
        <span class="label">Total Amount:</span> $${data.totalAmount.toFixed(2)}
      </div>
      ${data.notes ? `
      <div class="info-row">
        <span class="label">Notes:</span> ${data.notes}
      </div>
      ` : ''}
      
      <div class="attachments">
        <p><strong>📎 Attached Forms:</strong></p>
        <ul>
          ${data.forms?.map(form => `<li>${form.fileName} (${form.fileType})</li>`).join('') || '<li>No forms attached</li>'}
        </ul>
      </div>
      
      <p style="margin-top: 20px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
        <strong>Action Required:</strong> Please review this submission in the admin panel and approve or reject it.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message from the ESHS ASB System</p>
    </div>
  </div>
</body>
</html>
    `;

    const emailAttachments = attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType
    })) || [];

    await this.sendEmail({
      to: this.adminEmail,
      subject: `📝 New Activity Form Submission - ${data.eventName} - ${data.studentName}`,
      html,
      attachments: emailAttachments
    });
  }

  async sendApprovalNotification(to: string, data: ApprovalEmailData): Promise<void> {
    console.log(`EmailService: Sending approval notification to ${to} for event ${data.eventName}`);
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 30px; margin-top: 0; border-radius: 0 0 8px 8px; }
    .button { 
      display: inline-block; 
      padding: 15px 30px; 
      background: linear-gradient(135deg, #28a745, #20c997); 
      color: white; 
      text-decoration: none; 
      border-radius: 8px; 
      margin-top: 20px; 
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
      transition: transform 0.2s;
    }
    .button:hover { transform: translateY(-2px); }
    .info-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #003366; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎉 Your Activity Request Has Been Approved!</h2>
    </div>
    <div class="content">
      <p>Dear ${data.studentName},</p>
      
      <p>Congratulations! Your request for <strong>${data.eventName}</strong> has been approved by the ASB team.</p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="label">Event:</span> ${data.eventName}
        </div>
        <div class="info-row">
          <span class="label">Quantity:</span> ${data.quantity}
        </div>
        <div class="info-row">
          <span class="label">Total Amount:</span> $${data.totalAmount.toFixed(2)}
        </div>
      </div>
      
      <p>You can now proceed to purchase your tickets using the link below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.ticketPurchaseUrl}" class="button">🎟️ Purchase Tickets</a>
      </div>
      
      <p style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <strong>Important:</strong> Please complete your purchase within 48 hours to secure your spot. If you have any questions, contact the ASB office.
      </p>
    </div>
    <div class="footer">
      <p>Thank you for participating in school activities!</p>
      <p><strong>El Segundo High School ASB Team</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to,
      subject: `✅ Activity Request Approved - ${data.eventName}`,
      html
    });
    console.log(`EmailService: Approval email sent successfully to ${to}`);
  }

  async sendRejectionNotification(to: string, data: RejectionEmailData): Promise<void> {
    console.log(`EmailService: Sending rejection notification to ${to} for event ${data.eventName}`);
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc3545, #e74c3c); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 30px; margin-top: 0; border-radius: 0 0 8px 8px; }
    .button { 
      display: inline-block; 
      padding: 15px 30px; 
      background: linear-gradient(135deg, #007bff, #0056b3); 
      color: white; 
      text-decoration: none; 
      border-radius: 8px; 
      margin-top: 20px; 
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
      transition: transform 0.2s;
    }
    .button:hover { transform: translateY(-2px); }
    .reason-box { 
      background: #fff; 
      border-left: 4px solid #dc3545; 
      padding: 20px; 
      margin: 20px 0; 
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📋 Activity Request Update</h2>
    </div>
    <div class="content">
      <p>Dear ${data.studentName},</p>
      
      <p>Thank you for your interest in <strong>${data.eventName}</strong>. After careful review, we are unable to approve your request at this time.</p>
      
      <div class="reason-box">
        <strong>Reason for Decline:</strong><br>
        ${data.reason}
      </div>
      
      <p>We encourage you to review the requirements and guidelines, then submit a new request if you'd like to try again. Our ASB team is here to help you succeed!</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.retryUrl}" class="button">📝 Submit New Request</a>
      </div>
      
      <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>Need Help?</strong> If you would like more information about this decision or guidance on requirements, please contact the ASB office during school hours.
      </p>
    </div>
    <div class="footer">
      <p><strong>El Segundo High School ASB Team</strong></p>
      <p>We appreciate your interest in school activities!</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to,
      subject: `📋 Activity Request Update - ${data.eventName}`,
      html
    });
    console.log(`EmailService: Rejection email sent successfully to ${to}`);
  }

  // Test method for checking email functionality
  async sendTestEmail(to: string): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🧪 Test Email</h2>
    </div>
    <div class="content">
      <p>This is a test email from the ESHS ASB System.</p>
      <p>If you received this email, the email service is working correctly!</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to,
      subject: '🧪 Test Email from ESHS ASB System',
      html
    });
  }
}

export const emailService = new EmailService();