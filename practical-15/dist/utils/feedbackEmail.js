"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFeedbackEmail = void 0;
const mailer_1 = require("./mailer");
const Index_1 = require("../models/Index");
const getAdminEmail = async () => {
    const adminUser = await Index_1.User.findOne({
        where: { role: 'admin' }
    });
    if (adminUser) {
        return adminUser.email;
    }
    return process.env.ADMIN_EMAIL || 'princyvithani09@gmail.com';
};
const sendFeedbackEmail = async (feedback) => {
    const adminEmail = await getAdminEmail();
    try {
        await mailer_1.transporter.sendMail({
            from: process.env.SMTP_FROM || '"StyleSphere App" <noreply@ecommerce.com>',
            to: adminEmail,
            subject: `Feedback from ${feedback.userName}: ${feedback.subject}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Feedback Received</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">User Name:</span> ${feedback.userName}
              </div>
              <div class="info-row">
                <span class="label">User Email:</span> ${feedback.userEmail}
              </div>
              <div class="info-row">
                <span class="label">User ID:</span> ${feedback.userId}
              </div>
              <div class="info-row">
                <span class="label">Subject:</span> ${feedback.subject}
              </div>
              <div class="info-row">
                <span class="label">Message:</span>
                <p>${feedback.message}</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} StyleSphere App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `
        New Feedback Received
        
        User Name: ${feedback.userName}
        User Email: ${feedback.userEmail}
        User ID: ${feedback.userId}
        Subject: ${feedback.subject}
        
        Message:
        ${feedback.message}
      `,
        });
        console.log(`Feedback email sent to admin: ${adminEmail}`);
    }
    catch (error) {
        console.error('Error sending feedback email to admin:', error);
        throw error;
    }
};
exports.sendFeedbackEmail = sendFeedbackEmail;
exports.default = mailer_1.transporter;
