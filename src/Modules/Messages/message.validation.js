import Joi from "joi";
import { generalFeilds } from "../../utils/generalFeilds/index.js"

export const sendMessage = {
    params: Joi.object().keys({
        id: generalFeilds.userId.required()
    }).required()
    ,
    query: Joi.object().keys({
        senderId: generalFeilds.userId.optional(),
    }).optional()
    ,
    body: Joi.object().keys({
        content: Joi.string().min(20).max(2000).required(),
    }).required()
}
export const getMessages = {

    query: Joi.object().keys({
        cursor: Joi.string().optional(),
        limit: Joi.number().integer().min(1).max(50).default(20).required(),
        unread: Joi.number().valid(0, 1).optional(),
        page: Joi.number().integer().min(1).default(1).required(),
    }).required()
    ,

}
export const markAsRead = {

    body: Joi.object().keys({
        messageIds: Joi.array().items(generalFeilds.userId).required()
    }).required()
    ,

}
export const makeVisible = {

    params: Joi.object().keys({
        id: generalFeilds.userId.required()
    }).required()
    ,

}
