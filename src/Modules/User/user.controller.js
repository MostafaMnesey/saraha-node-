import { Router } from "express";
import { authentication } from "../../Middlewares/Authentication.js";
import * as user from "./user.service.js";
import {
  changePasswordCodeSchema,
  changePasswordSchema,
  restoreAccountSchema,
  updateBasicInfoSchema,
  userSearch,
} from "./user.validation.js";
import { Validation } from "../../Middlewares/Validation.js";
const router = Router();
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current authenticated user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User details retrieved }
 *       401: { description: Unauthorized }
 */
router.get("/", authentication(), user.getUser);

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Search for users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema: { type: string }
 *         description: Search by User ID
 *         example: "cmjx4015n00003vrkqc5jy9zm"
 *     responses:
 *       200: { description: Search results }
 */
router.get(
  "/search",
  Validation(userSearch),
  authentication(),
  user.searchUser
);

/**
 * @swagger
 * /user/change-password-code:
 *   post:
 *     summary: Request password change code
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
  "/change-password-code",
  Validation(changePasswordCodeSchema),
  authentication(),
  user.changePasswordCode
);

/**
 * @swagger
 * /user/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, oldPassword, newPassword, confirmPassword]
 *             properties:
 *               email: { type: string, example: "mneseym@gmail.com" }
 *               otp: { type: string, example: "816977" }
 *               oldPassword: { type: string, example: "Mostafa@252201" }
 *               newPassword: { type: string, example: "Mostafa@252200" }
 *               confirmPassword: { type: string, example: "Mostafa@252200" }
 *     responses:
 *       200: { description: Password changed successfully }
 */
router.patch(
  "/change-password",
  Validation(changePasswordSchema),
  authentication(),
  user.changePassword
);

/**
 * @swagger
 * /user/update-profile:
 *   patch:
 *     summary: Update basic user info
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string, example: "Scorpion" }
 *               lastName: { type: string, example: "myns" }
 *               gender: { type: string, enum: [male, female], example: "male" }
 *               phone: { type: string, example: "01069441989" }
 *               bio: { type: string, example: "iam hero now zero" }
 *     responses:
 *       200: { description: Profile updated }
 */
router.patch(
  "/update-profile",
  Validation(updateBasicInfoSchema),
  authentication(),
  user.updateBasicInfo
);

/**
 * @swagger
 * /user/freez-account:
 *   delete:
 *     summary: Freeze user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Account frozen }
 */
router.delete("/freez-account", authentication(), user.freezAccount);

/**
 * @swagger
 * /user/restore-account/{id}:
 *   patch:
 *     summary: Restore a frozen account
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "cmjyrmdzu00003ktfub8y2k8w"
 *     responses:
 *       200: { description: Account restored }
 */
router.patch(
  "/restore-account/:id",
  Validation(restoreAccountSchema),
  user.restoreAccount
);
export default router;
