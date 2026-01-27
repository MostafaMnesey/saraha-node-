import event from "node:events";
import { sendEmail } from "./SendEmail.js";

const sendEmailEvent = new event.EventEmitter();

sendEmailEvent.on(
  "sendEmail",
  async ({
    email,
    otp,
    subject = "Verify your account",
    text = "Verify your account",
  }) => {
    await sendEmail({
      to: email,
      subject,
      text,
      otp,
    });
  }
);

export default sendEmailEvent;
