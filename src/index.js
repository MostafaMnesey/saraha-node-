import { config } from "dotenv";
import bootstrap from "./app.controller.js";
import { generateOtp } from "./utils/security/otp.js";
config();
console.log(generateOtp());



await bootstrap();