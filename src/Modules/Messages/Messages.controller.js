import { Router } from "express";
import { authentication } from "../../Middlewares/Authentication.js";
import * as messages from "./Messages.service.js";
import { Validation } from "../../Middlewares/Validation.js";
import { getMessages, markAsRead, sendMessage, makeVisible } from "./message.validation.js";
const router = Router();



/**
 * @swagger
 * /messages/send/{id}:
 *   post:
 *     summary: Send a message to a user
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Recipient User ID
 *         example: "cmjx4015n00003vrkqc5jy9zm"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, example: "Hello from Postman!" }
 *     responses:
 *       201: { description: Message sent }
 */
router.post("/send/:id", Validation(sendMessage), messages.send)

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Message management and retrieval operations
 */

/**
 * @swagger
 * /messages/get-messages:
 *   get:
 *     summary: Get all messages for authenticated user
 *     description: |
 *       Retrieves paginated messages for the currently authenticated user.
 *       
 *       ## Features:
 *       - **Pagination** - Control results with page and limit
 *       - **Unread Filter** - Filter to show only unread messages
 *       - **Soft Delete** - Only non-deleted messages are returned
 *       - **Sorted** - Messages ordered by newest first
 *       
 *       ## Message Status Values:
 *       | Status | Description |
 *       |--------|-------------|
 *       | `sent` | Message has been sent |
 *       | `delivered` | Message delivered to recipient |
 *       | `read` | Message has been read |
 *       | `failed` | Message delivery failed |
 *     tags:
 *       - Messages
 *     operationId: getMessages
 *     security:
 *       - bearerAuth: []
 *     
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of messages per page
 *         example: 10
 *       
 *       - in: query
 *         name: unread
 *         schema:
 *           type: string
 *           enum: ["0", "1", "true", "false"]
 *         description: |
 *           Filter for unread messages only.
 *           - `1` or `true` = Show only unread messages
 *           - `0` or `false` = Show all messages
 *         example: "1"
 *     
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetMessagesSuccessResponse'
 *             examples:
 *               with_messages:
 *                 summary: Response with messages
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "Messages retrieved successfully"
 *                   data:
 *                     items:
 *                       - id: "msg_123abc"
 *                         content: "Hello, how are you?"
 *                         createdAt: "2024-01-15T10:30:00.000Z"
 *                         readAt: null
 *                         deliveredAt: "2024-01-15T10:30:05.000Z"
 *                         status: "delivered"
 *                         visibility: "visible"
 *                         metadata:
 *                           type: "text"
 *                           priority: "normal"
 *                       - id: "msg_456def"
 *                         content: "Meeting at 3 PM"
 *                         createdAt: "2024-01-15T09:00:00.000Z"
 *                         readAt: "2024-01-15T09:15:00.000Z"
 *                         deliveredAt: "2024-01-15T09:00:03.000Z"
 *                         status: "read"
 *                         visibility: "visible"
 *                         metadata:
 *                           type: "reminder"
 *                           priority: "high"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 5
 *                       totalItems: 48
 *                       itemsPerPage: 10
 *                       hasNextPage: true
 *                       hasPrevPage: false
 *               empty_messages:
 *                 summary: No messages found
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "Messages retrieved successfully"
 *                   data:
 *                     items: []
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 0
 *                       totalItems: 0
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *       
 *       400:
 *         description: Validation error - Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalid_page:
 *                 summary: Invalid page number
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "Validation Error"
 *                   errors:
 *                     - field: "page"
 *                       message: "Page must be a positive integer"
 *               invalid_limit:
 *                 summary: Invalid limit value
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "Validation Error"
 *                   errors:
 *                     - field: "limit"
 *                       message: "Limit must be between 1 and 100"
 *       
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *             examples:
 *               missing_token:
 *                 summary: Token not provided
 *                 value:
 *                   success: false
 *                   status: 401
 *                   message: "Access token is required"
 *               invalid_token:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   status: 401
 *                   message: "Invalid or expired token"
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
 *               message: "Failed to retrieve messages"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique message identifier
 *           example: "msg_123abc456def"
 *         content:
 *           type: string
 *           description: Message content/body
 *           example: "Hello, how are you?"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Message creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *         readAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp when message was read (null if unread)
 *           example: "2024-01-15T10:35:00.000Z"
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp when message was delivered
 *           example: "2024-01-15T10:30:05.000Z"
 *         status:
 *           type: string
 *           enum: [sent, delivered, read, failed]
 *           description: Current message status
 *           example: "delivered"
 *         visibility:
 *           type: string
 *           enum: [visible, hidden, archived]
 *           description: Message visibility state
 *           example: "visible"
 *         metadata:
 *           type: object
 *           nullable: true
 *           description: Additional message metadata
 *           properties:
 *             type:
 *               type: string
 *               enum: [text, image, file, reminder, notification]
 *               example: "text"
 *             priority:
 *               type: string
 *               enum: [low, normal, high, urgent]
 *               example: "normal"
 *             attachments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     format: uri
 *                   type:
 *                     type: string
 *                   size:
 *                     type: integer
 *
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *           example: 5
 *         totalItems:
 *           type: integer
 *           description: Total number of items
 *           example: 48
 *         itemsPerPage:
 *           type: integer
 *           description: Number of items per page
 *           example: 10
 *         hasNextPage:
 *           type: boolean
 *           description: Whether there's a next page
 *           example: true
 *         hasPrevPage:
 *           type: boolean
 *           description: Whether there's a previous page
 *           example: false
 *
 *     GetMessagesSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Messages retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *             pagination:
 *               $ref: '#/components/schemas/PaginationInfo'
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
 *                 example: "page"
 *               message:
 *                 type: string
 *                 example: "Page must be a positive integer"
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
 *         Enter your JWT token obtained from login.
 *         
 *         Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
 */
router.get("/get-messages", authentication(), Validation(getMessages), messages.getMessages)

/**
 * @swagger
 * /messages/mark-as-read:
 *   patch:
 *     summary: Mark messages as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageIds: 
 *                 type: array
 *                 items: { type: string }
 *                 example: ["cmk8g8d0j000058ij8h37t5v4", "cmk8h0cvo0000mgij8hba7tb9"]
 *     responses:
 *       200: { description: Messages marked as read }
 */
router.patch("/mark-as-read", authentication(), Validation(markAsRead), messages.markAsRead)

/**
 * @swagger
 * /messages/make-visible/{id}:
 *   patch:
 *     summary: Toggle message visibility
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "cmk8g8d0j000058ij8h37t5v4"
 *     responses:
 *       200: { description: Visibility toggled }
 */
router.patch("/make-visible/:id", authentication(), Validation(makeVisible), messages.makeVisible)

/**
 * @swagger
 * /messages/soft-delete-message/{id}:
 *   delete:
 *     summary: Soft delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "cmk8h0fa30002mgij40ajkt2t"
 *     responses:
 *       200: { description: Message soft deleted }
 */
router.delete("/soft-delete-message/:id", authentication(), Validation(makeVisible), messages.deleteMessage)

/**
 * @swagger
 * /messages/hard-delete-message/{id}:
 *   delete:
 *     summary: Hard delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Message hard deleted }
 */
router.delete("/hard-delete-message/:id", authentication(), Validation(makeVisible), messages.deleteMessage)

/**
 * @swagger
 * /messages/soft-delete-messages:
 *   get:
 *     summary: Get soft deleted messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of soft deleted messages }
 */
router.get("/soft-delete-messages", authentication(), messages.softDeleteMessages)





export default router;