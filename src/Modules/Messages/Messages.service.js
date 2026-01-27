import { asyncHandler, successResponse } from "../../utils/response.js";
import * as db from "../../dataBase/dbService.js"
import sendEmailEvent from "../../utils/Mailer/sendEmailEvent.js";
import { MessageStatus, MessageVisibility } from "@prisma/client";


export const send = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { senderId } = req.query || []
    const { content } = req.body || []



    if (!id || !content) {
        return next(new Error("Missing required fields"));
    }

    const recipient = await db.findFirst({
        model: "User",
        where: {
            user_id: id
        }
    })

    if (!recipient) {
        return next(new Error("Recipient not found"));
    }
    const message = await db.create({
        model: "Message",
        data: {
            content,
            recipient_user_id: recipient.user_id,
            sender_user_id: senderId ? senderId : null,
            deliveredAt: new Date(),
        }
    })
    if (!message) {
        return next(new Error("Failed to send message"));
    }
    let sent;
    if (message) {
        sent = sendEmailEvent.emit("sendEmail", {
            email: recipient.email,
            subject: "New Message",
            text: "You have a new message",
        })
    }




    return successResponse({
        res,
        message: "Message sent successfully",
        status: 200
    });

})
export const getMessages = asyncHandler(async (req, res, next) => {
    const { page = 1, limit, unread } = req.query;
    const { user_id } = req.user;
    const where = {
        deletedAt: null,
        recipient_user_id: user_id,
        ...(String(unread) === "1" || unread === true ? { readAt: null } : {}),
    };



    const result = await db.findManyWithPaginationAndCount({
        model: "Message",
        where,
        page,
        limit,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            content: true,
            createdAt: true,
            readAt: true,
            deliveredAt: true,
            status: true,
            visibility: true,
            metadata: true,
        },
    });

    if (!result) {
        return next(new Error("Failed to retrieve messages"));
    }




    // لو db.findManyWithCursor بيرجع array بس:

    return successResponse({
        res,
        message: "Messages retrieved successfully",
        status: 200,
        data: result
    });
});

export const markAsRead = asyncHandler(async (req, res, next) => {
    const { messageIds } = req.body;

    const { user_id } = req.user;

    const uniqueMessageIds = [...new Set(messageIds)];
    console.log(uniqueMessageIds);

    const where = {
        recipient_user_id: user_id,
        id: { in: uniqueMessageIds },
        deletedAt: null,
    };

    const data = {
        readAt: new Date(),
        status: MessageStatus.read
    }

    const messages = await db.updateMany({
        model: "Message",
        where,
        data
    })








    // لو db.findManyWithCursor بيرجع array بس:

    return successResponse({
        res,
        message: "Messages marked as read successfully",
        status: 200,
        data: messages
    });
});
export const makeVisible = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { user_id } = req.user;
    const where = {
        recipient_user_id: user_id,
        deletedAt: null,
        id,
    };
    const data = {
        visibility: MessageVisibility.visible
    }
    const messages = await db.updateOne({
        model: "Message",
        where,
        data
    })
    return successResponse({
        res,
        message: "Message made visible successfully",
        status: 200,
        data: messages
    });
});
export const deleteMessage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { user_id } = req.user;
    const where = {
        recipient_user_id: user_id,
        id,
        deletedAt: null,
    };
    const data = {
        deletedAt: new Date(),
    }
    const message = await db.findFirst({
        model: "Message",
        where,
    })
    if (!message) {
        return next(new Error("Message not found"));
    }
    const messages = await db.updateOne({
        model: "Message",
        where,
        data
    })
    if (!messages) {
        return next(new Error("Failed to delete message"));
    }
    return successResponse({
        res,
        message: "Message deleted successfully",
        status: 200,
        data: []
    });
});
export const softDeleteMessages = asyncHandler(async (req, res, next) => {

    const { user_id } = req.user;
    const where = {
        recipient_user_id: user_id,
        deletedAt: { not: null },
    };

    const messages = await db.findMany({
        model: "Message",
        where,
    })

    if (!messages) {
        return next(new Error("Failed to delete message"));
    }
    return successResponse({
        res,
        message: "Message deleted successfully",
        status: 200,
        data: messages
    });
});

