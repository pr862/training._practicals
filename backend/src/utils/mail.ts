import nodemailer from "nodemailer";
import { Recipe, RecipeStatus } from "../types/recipe";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    console.error(" MAIL_ERROR: Missing environment variables for EMAIL.");
    return false;
  }
  try {
    console.log(`Attempting to send email to: ${to}...`);
    
    const info = await transporter.sendMail({
      from: `"Recipe Book" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("MAIL_SUCCESS: Message sent ID:", info.messageId);
    return true;
  } catch (error: any) {
    console.error(" MAIL_ERROR: Full details below:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    return false;
  }
};

const wrapEmailTemplate = (content: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #fe8c3b; padding: 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
      <h1 style="color: #ffffff; margin: 0; font-family: sans-serif;">RecipeBook</h1>
    </div>
    <div style="padding: 40px 30px;">${content}</div>
    <div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px; font-family: sans-serif;">
      &copy; ${new Date().getFullYear()} RecipeBook. All rights reserved.<br>
      You received this because of your recipe submission.
    </div>
</div>`;

export const sendStatusUpdateEmail = async (to: string, recipe: Recipe, status: RecipeStatus, feedback?: string) => {
  const accentColor = "#f97316";
  const isApproved = status === RecipeStatus.APPROVED;
  
  if (!isApproved && status !== RecipeStatus.REJECTED) return false;

  const content = isApproved 
    ? `
      <h2 style="color: #0f172a;">Your recipe is live!</h2>
      <p style="color: #475569; line-height: 1.6;">Congratulations! <strong>${recipe.name}</strong> has passed our quality check and is now available to the community.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="http://localhost:5173/" style="background-color: ${accentColor}; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">View Live Recipe</a>
      </div>`
    : `
      <h2 style="color: #0f172a;">Feedback on your submission</h2>
      <p style="color: #475569; line-height: 1.6;">Thank you for sharing <strong>${recipe.name}</strong>. Our team has reviewed your submission and has the following feedback:</p>
      <div style="background-color: #fff7ed; border-left: 4px solid ${accentColor}; padding: 15px; margin: 20px 0; color: #9a3412; font-style: italic;">
        "${feedback || "Please ensure all ingredients and steps are clearly detailed."}"
      </div>
      <p style="color: #475569; line-height: 1.6;">You can edit your recipe and resubmit it for approval.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="http://localhost:5173/chef/dashboard" style="border: 1px solid #cbd5e1; color: #1e293b; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Go to Dashboard</a>
      </div>`;

  const subject = isApproved ? ` Approved: ${recipe.name}` : `Update: Submission for ${recipe.name}`;
  return await sendEmail(to, subject, wrapEmailTemplate(content));
};
