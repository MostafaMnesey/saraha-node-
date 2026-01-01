import event from "node:events";
import { sendEmail } from "./SendEmail.js";


const sendEmailEvent = new event.EventEmitter();

sendEmailEvent.on("sendEmail", async ({ email, otp }) => {
  await sendEmail({
    to: email,
    subject: "Verify your account",
    text: "Verify your account",
    otp,
  });
});

export default sendEmailEvent;
