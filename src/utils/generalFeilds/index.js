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
  otp: Joi.string().max(6).min(6),
};
