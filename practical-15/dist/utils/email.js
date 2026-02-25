"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const mailer_1 = require("./mailer");
const sendWelcomeEmail = async (email, name) => {
    try {
        await mailer_1.transporter.sendMail({
            from: process.env.SMTP_FROM || '"StyleSphere App" <noreply@ecommerce.com>',
            to: email,
            subject: 'Welcome to StyleSphere App!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to StyleSphere App!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for signing up for StyleSphere App!</p>
              <p>We're excited to have you on board. You can now:</p>
              <ul>
                <li>Browse our products</li>
                <li>Filter products by categories and subcategories</li>
                <li>Save your favorite products</li>
                <li>And much more!</li>
              </ul>
              <p>Start shopping today and explore our wide range of products.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} StyleSphere App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        });
        console.log(`Welcome email sent to ${email}`);
    }
    catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.default = mailer_1.transporter;
