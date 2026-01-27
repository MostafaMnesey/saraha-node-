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
 * /messages/get-messages:
 *   get:
 *     summary: Get all messages for the authenticated user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of messages }
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