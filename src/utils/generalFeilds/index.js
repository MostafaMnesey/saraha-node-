import Joi from "joi";
export const generalFeilds = {
  firstName: Joi.string().min(3).max(32),
  lastName: Joi.string().min(3).max(32),
  email: Joi.string().email(),
  password: Joi.string().pattern(
    new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&^#])[A-Za-z\\d@$!%*?&^#]{8,}$"
    )
  ),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
  gender: Joi.string().valid("male", "female"),
  phone: Joi.string().pattern(new RegExp("^(?:\\+20|0020|0)?1[0125][0-9]{8}$")),
  idToken: Joi.string(),
  provider: Joi.string().valid("google", "local"),
  otp: Joi.string()
    .max(6)
    .min(6)
    .regex(/^[0-9]{6}$/),
  userId: Joi.string()
    .regex(/^c[a-z0-9]{20,32}$/)
    .required()
    .messages({
      "string.pattern.base": "ID format is invalid, it must be a valid CUID",
    }),
  bio: Joi.string().min(16).max(300).messages({
    "string.min": "Bio must be at least {#limit} characters",
    "string.max": "Bio must be at most {#limit} characters",
  }),
};
