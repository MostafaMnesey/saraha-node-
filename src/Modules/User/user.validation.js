import Joi from "joi";
import { generalFeilds } from "../../utils/generalFeilds/index.js";
export const userSearch = {
  query: Joi.object()
    .keys({
      user_id: generalFeilds.userId.required(),
    })
    .required(),
};

export const changePasswordCodeSchema = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
    })
    .required(),
};
export const changePasswordSchema = {
  body: Joi.object({
    email: generalFeilds.email.required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Please enter a valid email address",
    }),

    otp: generalFeilds.otp.required().messages({
      "any.required": "OTP is required",
      "string.empty": "OTP cannot be empty",
      "string.length": "OTP must be exactly {#limit} digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
    oldPassword: generalFeilds.password
      .required()
      .invalid(Joi.ref("newPassword"))
      .messages({
        "any.required": "Old password is required",
        "string.empty": "Old password cannot be empty",
        "any.invalid": "Old password and new password must not be the same",
      }),

    newPassword: generalFeilds.password.required().messages({
      "any.required": "New password is required",
      "string.empty": "New password cannot be empty",
      "string.min": "New password must be at least {#limit} characters",
      "string.pattern.base":
        "New password must include uppercase, lowercase, number and special character",
    }),

    confirmPassword: generalFeilds.confirmPassword
      .required()
      .valid(Joi.ref("newPassword"))
      .messages({
        "any.required": "Confirm password is required",
        "string.empty": "Confirm password cannot be empty",
        "any.only": "Confirm password must match the new password",
      }),
  }).required(),
};

export const updateBasicInfoSchema = {
  body: Joi.object({
    firstName: generalFeilds.firstName,
    lastName: generalFeilds.lastName,
    gender: generalFeilds.gender,
    phone: generalFeilds.phone,
    bio: generalFeilds.bio,
  }).required(),
};
export const restoreAccountSchema = {
  params: Joi.object({
    id: generalFeilds.userId.required(),
  }).required(),
};

export const userSearchSchema = {
  query: Joi.object()
    .keys({
      search: generalFeilds.search.required(),
    })
    .required(),
};

