import { transporter } from "./MailerClient.js";
import { mailTemp } from "./MailTemp.js";

export const sendEmail = async ({ to, subject, text, otp }) => {
  const html = mailTemp({ otp });
  try {
    const info = await transporter.sendMail({
      from: `"Saraha" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log(error);
  }
};
