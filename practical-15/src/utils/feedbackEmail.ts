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

export const sendFeedbackEmail = async (
  feedback: FeedbackData
): Promise<void> => {
  const adminEmail = await getAdminEmail();

  if (!adminEmail) {
    throw new Error('Feedback recipient email is not configured');
  }

  try {
    console.log(`Sending feedback email to: ${adminEmail}`);

    // Configure Brevo API
    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: { email: process.env.VERIFIED_EMAIL as string },
      to: [{ email: adminEmail }],
      subject: `Feedback from ${feedback.userName}: ${feedback.subject}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2 style="background:#50502d;color:white;padding:15px;text-align:center;">
            New Feedback Received
          </h2>
          <div style="padding:20px;background:#f9f9f9;">
            <p><strong>User Name:</strong> ${feedback.userName}</p>
            <p><strong>User Email:</strong> ${feedback.userEmail}</p>
            <p><strong>User ID:</strong> ${feedback.userId}</p>
            <p><strong>Subject:</strong> ${feedback.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${feedback.message}</p>
          </div>
          <div style="text-align:center;font-size:12px;color:#666;padding:15px;">
            © ${new Date().getFullYear()} StyleSphere App
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