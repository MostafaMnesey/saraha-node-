import * as db from "../../dataBase/dbService.js";
import { googleVerify } from "../../utils/GoogleClient/index.js";
import sendEmailEvent from "../../utils/Mailer/sendEmailEvent.js";
import { redis } from "../../utils/Radis/Connection.js";

import { asyncHandler, successResponse } from "../../utils/response.js";
import {
  comparePassword,
  decryptText,
  encryptText,
  hashPassword,
} from "../../utils/security/index.js";
import { generateOtp } from "../../utils/security/otp.js";
import { generateToken, verifyToken } from "../../utils/Token/token.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("Missing email or password", { cause: 400 }));
  }
  const user = await db.findFirst({
    model: "User",
    where: { email, provider: "local" },
  });
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  if (!user.password) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  const matchedPassword = comparePassword({ password, hash: user.password });
  if (!matchedPassword) {
    return next(new Error("Invalid credentials", { cause: 401 }));
  }
  /*  if (!user.confirm) {
    return next(new Error("User Not Confirm", { cause: 401 }));
  }
 */
  const decryptedPhone = decryptText({ text: user.phone });
  user.phone = decryptedPhone;
  const accessToken = generateToken({ user, tokenType: "access" });
  const refreshToken = generateToken({ user, tokenType: "refresh" });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return successResponse({
    res,
    status: 200,
    data: { accessToken },
  });
});

export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone } = req.body;
  const checkuser = await db.findFirst({ model: "User", where: { email } });
  if (checkuser) {
    return next(new Error("User Already Exist", { cause: 400 }));
  }
  const hashedPassword = hashPassword({ password });
  const encryptedPhone = encryptText({ text: phone });
  const otp = generateOtp();
  const hashedOtp = hashPassword({ password: otp });
  await redis.set(email, hashedOtp);
  await redis.expire(email, 60 * 10);

  sendEmailEvent.emit("sendEmail", { email, otp });
  const user = await db.create({
    model: "User",
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      phone: encryptedPhone,
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "User Created Successfully, Please Check Your Email",
  });
});
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const checkuser = await db.findFirst({ model: "User", where: { email } });
  if (!checkuser) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  const otp = generateOtp();
  const hashedOtp = hashPassword({ password: otp });
  await redis.set(email, hashedOtp);
  await redis.expire(email, 60 * 10);

  sendEmailEvent.emit("sendEmail", { email, otp });

  return successResponse({
    res,
    status: 201,
    message: "Otp Sent Successfully, Please Check Your Email",
  });
});
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const checkuser = await db.findFirst({ model: "User", where: { email } });
  if (!checkuser) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  const hasedOtp = await redis.get(email);

  const comparedPassword = comparePassword({ password: otp, hash: hasedOtp });
  if (!comparedPassword) {
    return next(new Error("Invalid Otp", { cause: 401 }));
  }

  const hashedPassword = hashPassword({ password });
  const user = await db.updateOne({
    model: "User",
    where: { email },
    data: { password: hashedPassword },
  });
  await redis.del(email);

  return successResponse({
    res,
    status: 201,
    message: "Password Reset Successfully, Please Login",
  });
});

export const refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new Error("No Refresh Token", { cause: 401 }));
  }
  const verify = verifyToken({ token: refreshToken, tokenType: "refresh" });

  const user = await db.findFirst({
    model: "User",
    where: { user_id: verify.id },
  });
  if (!user) {
    return next(new Error("Invalid Refresh Token", { cause: 401 }));
  }
  const accessToken = generateToken({ user, tokenType: "access" });
  const newRefreshToken = generateToken({ user, tokenType: "refresh" });

  const cookie = res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  console.log(cookie);

  return successResponse({
    res,
    status: 200,
    data: { accessToken },
  });
});
export const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const hasedOtp = await redis.get(email);
  console.log(hasedOtp);

  const comparedPassword = comparePassword({ password: otp, hash: hasedOtp });
  if (!comparedPassword) {
    return next(new Error("Invalid Otp", { cause: 401 }));
  }

  return successResponse({
    res,
    status: 200,
    message: "Otp Verified is correct",
  });
});
export const verifyAccount = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const hasedOtp = await redis.get(email);

  const comparedPassword = comparePassword({ password: otp, hash: hasedOtp });
  if (!comparedPassword) {
    return next(new Error("Invalid Otp", { cause: 401 }));
  }
  const matchedUser = await db.findFirst({
    model: "User",
    where: { email },
  });
  if (!matchedUser) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  await redis.del(email);
  const user = await db.updateOne({
    model: "User",
    where: { email },
    data: { confirm: new Date().toISOString() },
  });
  console.log(user);
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  return successResponse({
    res,
    status: 200,
    message: "User Verified Successfully",
  });
});
export const googleSignUp = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const verify = await googleVerify(idToken);
  if (!verify) {
    return next(new Error("Invalid Token", { cause: 401 }));
  }
  console.log(verify);
  if (!verify.email_verified) {
    return next(new Error("Email Not Verified", { cause: 401 }));
  }

  const user = await db.findFirst({
    model: "User",
    where: { email: verify.email },
  });
  if (user) {
    return next(new Error("User Already Exist", { cause: 400 }));
  }
  const date = new Date();
  const confirm = date.toISOString();
  const newUser = await db.create({
    model: "User",
    data: {
      firstName: verify.given_name,
      lastName: verify.family_name,
      email: verify.email,
      provider: "google",
      googleId: verify.sub,
      confirm: confirm,
      profile: {
        create: {
          avatar: verify.picture,
        },
      },
    },
  });

  return successResponse({
    res,
    status: 200,
    data: { user },
  });
});
export const googlelogin = asyncHandler(async (req, res, next) => {
  const { idToken, provider } = req.body;
  if (provider !== "google") {
    return next(new Error("Invalid Provider", { cause: 401 }));
  }
  const verify = await googleVerify(idToken);
  if (!verify) {
    return next(new Error("Invalid Token", { cause: 401 }));
  }
  if (!verify.email_verified) {
    return next(new Error("Email Not Verified", { cause: 401 }));
  }

  const user = await db.findFirst({
    model: "User",
    where: { googleId: verify.sub, provider: "google", email: verify.email },
  });
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  if (user.password) {
    return next(new Error("invalid credentials", { cause: 401 }));
  }

  const accessToken = generateToken({ user, tokenType: "access" });
  const refreshToken = generateToken({ user, tokenType: "refresh" });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  return successResponse({
    res,
    status: 200,
    data: { accessToken },
  });
});
