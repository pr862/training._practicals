import SibApiV3Sdk from 'sib-api-v3-sdk';
import { User } from '../models/Index';

interface FeedbackData {
  userId: number;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
}

const getAdminEmail = async (): Promise<string> => {
  if (process.env.ADMIN_EMAIL) {
    return process.env.ADMIN_EMAIL;
  }

  const adminUser = await User.findOne({
    where: { role: 'admin' }
  });

  if (adminUser) {
    return adminUser.email;
  }

  return '';
};

export const sendFeedbackEmail = async (feedback: FeedbackData): Promise<void> => {
  const adminEmail = await getAdminEmail();

  if (!adminEmail) {
    throw new Error('Feedback recipient email is not configured');
  }

  try {
    console.log(`Sending feedback email to: ${adminEmail}`);

    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: { email: process.env.VERIFIED_EMAIL as string },
      to: [{ email: adminEmail }],
      subject: `Feedback from ${feedback.userName}: ${feedback.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #50502d; color: white; padding: 20px; text-align: center; }
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
        </div>
      `,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('Feedback email sent successfully via Brevo');
  } catch (error: any) {
    console.error('Feedback email send failed:', error.message);
    throw new Error(`Failed to send feedback email: ${error.message}`);
  }
};
