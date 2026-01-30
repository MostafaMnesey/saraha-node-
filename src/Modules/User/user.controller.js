import { Router } from "express";
import { authentication } from "../../Middlewares/Authentication.js";
import * as user from "./user.service.js";
import {
  changePasswordCodeSchema,
  changePasswordSchema,
  restoreAccountSchema,
  updateBasicInfoSchema,

  userSearch,

  userSearchSchema,
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
/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management and search operations
 */

/**
 * @swagger
 * /user/search-name:
 *   get:
 *     summary: Search users by name
 *     description: |
 *       Search for users by their first name or last name.
 *       
 *       ## Search Behavior:
 *       - **Case Insensitive** - Searches are not case sensitive
 *       - **Partial Match** - Matches partial names (contains search)
 *       - **OR Logic** - Searches both first name AND last name
 *       
 *       ## Examples:
 *       | Search Query | Matches |
 *       |--------------|---------|
 *       | `john` | "John Doe", "Johnny Smith", "Mike Johnson" |
 *       | `doe` | "John Doe", "Jane Doe" |
 *       | `J` | All names starting with or containing "J" |
 *       
 *       ## Use Cases:
 *       - User autocomplete in search fields
 *       - Finding users to add as friends/contacts
 *       - Admin user lookup
 *     
 *     tags:
 *       - User
 *     operationId: searchUsersByName
 *     security:
 *       - bearerAuth: []
 *     
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: |
 *           Search term to match against first name or last name.
 *           Minimum 1 character required.
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         examples:
 *           firstName:
 *             summary: Search by first name
 *             value: "john"
 *           lastName:
 *             summary: Search by last name
 *             value: "smith"
 *           partial:
 *             summary: Partial name search
 *             value: "jo"
 *     
 *     responses:
 *       200:
 *         description: Users found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchUsersSuccessResponse'
 *             examples:
 *               users_found:
 *                 summary: Users matching search
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     users:
 *                       - user_id: "usr_abc123"
 *                         firstName: "John"
 *                         lastName: "Doe"
 *                         email: "john.doe@example.com"
 *                         profile:
 *                           avatar: "https://example.com/avatars/john.jpg"
 *                       - user_id: "usr_def456"
 *                         firstName: "Johnny"
 *                         lastName: "Smith"
 *                         email: "johnny.smith@example.com"
 *                         profile:
 *                           avatar: null
 *                       - user_id: "usr_ghi789"
 *                         firstName: "Mike"
 *                         lastName: "Johnson"
 *                         email: "mike.j@example.com"
 *                         profile:
 *                           avatar: "https://example.com/avatars/mike.png"
 *               no_results:
 *                 summary: No users found
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     users: []
 *       
 *       400:
 *         description: Validation error - Missing or invalid search parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               missing_search:
 *                 summary: Search parameter missing
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "Search is required"
 *               search_too_short:
 *                 summary: Search term too short
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "Validation Error"
 *                   errors:
 *                     - field: "search"
 *                       message: "Search must be at least 1 character"
 *               search_too_long:
 *                 summary: Search term too long
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "Validation Error"
 *                   errors:
 *                     - field: "search"
 *                       message: "Search cannot exceed 100 characters"
 *       
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *             examples:
 *               missing_token:
 *                 summary: No token provided
 *                 value:
 *                   success: false
 *                   status: 401
 *                   message: "Access token is required"
 *               invalid_token:
 *                 summary: Invalid or expired token
 *                 value:
 *                   success: false
 *                   status: 401
 *                   message: "Invalid or expired token"
 *               expired_token:
 *                 summary: Token has expired
 *                 value:
 *                   success: false
 *                   status: 401
 *                   message: "Token has expired. Please login again"
 *       
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitResponse'
 *             example:
 *               success: false
 *               status: 429
 *               message: "Too many search requests. Please try again later"
 *               retryAfter: 60
 *       
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
 *     UserProfile:
 *       type: object
 *       nullable: true
 *       properties:
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL to user's avatar image
 *           example: "https://example.com/avatars/user123.jpg"
 *
 *     SearchUserItem:
 *       type: object
 *       required:
 *         - user_id
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         user_id:
 *           type: string
 *           description: Unique user identifier
 *           example: "usr_abc123def456"
 *         firstName:
 *           type: string
 *           description: User's first name
 *           minLength: 1
 *           maxLength: 50
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: User's last name
 *           minLength: 1
 *           maxLength: 50
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         profile:
 *           $ref: '#/components/schemas/UserProfile'
 *
 *     SearchUsersSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates successful response
 *           example: true
 *         status:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Success"
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               description: List of matching users
 *               items:
 *                 $ref: '#/components/schemas/SearchUserItem'
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
 *                 description: Field that failed validation
 *                 example: "search"
 *               message:
 *                 type: string
 *                 description: Validation error message
 *                 example: "Search is required"
 *               value:
 *                 type: string
 *                 description: The invalid value provided
 *                 nullable: true
 *
 *     UnauthorizedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: integer
 *           example: 401
 *         message:
 *           type: string
 *           example: "Access token is required"
 *
 *     RateLimitResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: integer
 *           example: 429
 *         message:
 *           type: string
 *           example: "Too many requests. Please try again later"
 *         retryAfter:
 *           type: integer
 *           description: Seconds to wait before retrying
 *           example: 60
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
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         JWT Authentication token.
 *         
 *         Obtain token from `/auth/login` endpoint.
 *         
 *         **Format:** `Bearer <token>`
 */
router.get("/search-name", authentication(), Validation(userSearchSchema), user.searchWithName);





export default router;
