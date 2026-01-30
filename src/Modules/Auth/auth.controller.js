import { Router } from "express";
import * as auth from "./auth.service.js";
import cookieParser from "cookie-parser";
import { Validation } from "../../Middlewares/Validation.js";
import {
  forgetPasswordSchema,
  googleLoginSchema,
  googleSignupSchema,
  loginSchema,
  registeritonSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifiyCodeSchema,
} from "./auth.validation.js";
const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, gender, phone]
 *             properties:
 *               firstName: { type: string, example: "mostafa" }
 *               lastName: { type: string, example: "mnesey" }
 *               email: { type: string, example: "mneseym@gmail.com" }
 *               password: { type: string, example: "Mostafa@252200" }
 *               gender: { type: string, enum: [male, female], example: "male" }
 *               phone: { type: string, example: "01069441989" }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Validation error }
 */
router.post("/register", Validation(registeritonSchema), auth.register); //done

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "mneseym@gmail.com" }
 *               password: { type: string, example: "Mostafa@252200" }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post("/login", Validation(loginSchema), auth.login); //done

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200: { description: Token refreshed }
 */
router.post("/refresh", cookieParser(), auth.refresh); //done

/**
 * @swagger
 * /auth/google-signup:
 *   post:
 *     summary: Signup with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken: { type: string }
 *     responses:
 *       201: { description: User signed up with Google }
 */
router.post(
  "/google-signup",
  Validation(googleSignupSchema),
  auth.googleSignUp
); // done

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Login with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken, provider]
 *             properties:
 *               idToken: { type: string }
 *               provider: { type: string, example: "google" }
 *     responses:
 *       200: { description: Google login successful }
 */
router.post("/google-login", Validation(googleLoginSchema), auth.googlelogin); //done

/**
 * @swagger
 * /auth/verify-code:
 *   post:
 *     summary: Verify code for password reset or activation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, example: "mneseym@gmail.com" }
 *               otp: { type: string, example: "889866" }
 *     responses:
 *       200: { description: Code verified }
 */
router.post("/verify-code", Validation(verifiyCodeSchema), auth.verifyCode); //done

/**
 * @swagger
 * /auth/verify-account:
 *   post:
 *     summary: Verify user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, example: "mneseym@gmail.com" }
 *               otp: { type: string, example: "752878" }
 *     responses:
 *       200: { description: Account verified }
 */
router.post(
  "/verify-account",
  Validation(verifiyCodeSchema),
  auth.verifyAccount
); //done

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Send forget password code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "mneseym@gmail.com" }
 *     responses:
 *       200: { description: Code sent }
 */
router.post(
  "/forget-password",
  Validation(forgetPasswordSchema),
  auth.forgetPassword
);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP verification code
 *     description: |
 *       Resends a new OTP (One-Time Password) to the user's email address for account verification.
 *       The OTP is valid for 10 minutes and the previous OTP will be invalidated.
 *     tags:
 *       - Auth
 *     operationId: resendOtp
 *     requestBody:
 *       required: true
 *       description: User email to receive the OTP
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtpRequest'
 *           examples:
 *             valid_email:
 *               summary: Valid email example
 *               value:
 *                 email: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResendOtpSuccessResponse'
 *             example:
 *               success: true
 *               status: 200
 *               message: "Otp Sent Successfully, Please Check Your Email"
 *       400:
 *         description: Validation error - Invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               status: 400
 *               message: "Validation Error"
 *               errors:
 *                 - field: "email"
 *                   message: "Please provide a valid email address"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               status: 404
 *               message: "User with this email does not exist"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               status: 429
 *               message: "Too many OTP requests. Please try again later"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               status: 500
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ResendOtpRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address to send OTP to
 *           example: "user@example.com"
 *           minLength: 5
 *           maxLength: 255
 *       example:
 *         email: "user@example.com"
 *
 *     ResendOtpSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: true
 *         status:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Otp Sent Successfully, Please Check Your Email"
 *
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: "Validation Error"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "email"
 *               message:
 *                 type: string
 *                 example: "Please provide a valid email address"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: integer
 *           example: 500
 *         message:
 *           type: string
 *           example: "Internal Server Error"
 */
router.post(
  "/resend-otp",
  Validation(resendOtpSchema),
  auth.resendOtp
);


/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, password]
 *             properties:
 *               email: { type: string, example: "mneseym@gmail.com" }
 *               otp: { type: string, example: "331531" }
 *               password: { type: string, example: "159875321" }
 *     responses:
 *       200: { description: Password reset successful }
 */
router.post(
  "/reset-password",
  Validation(resetPasswordSchema),
  auth.resetPassword
);


export default router;
