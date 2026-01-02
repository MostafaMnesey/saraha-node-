import Joi from "joi";
import { generalFeilds } from "../../utils/generalFeilds/index.js";

export const registeritonSchema = {
  body: Joi.object()
    .keys({
      firstName: generalFeilds.firstName.required(),
      lastName: generalFeilds.lastName.required(),
      email: generalFeilds.email.required(),
      password: generalFeilds.password.required(),
      gender: generalFeilds.gender.required(),
      phone: generalFeilds.phone.required(),
    })
    .required(),
};
export const loginSchema = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
      password: generalFeilds.password.required(),
    })
    .required(),
};
export const googleSignupSchema = {
  body: Joi.object()
    .keys({
      idToken: generalFeilds.idToken.required(),
    })
    .required(),
};
export const googleLoginSchema = {
  body: Joi.object()
    .keys({
      idToken: generalFeilds.idToken.required(),
      Provider: generalFeilds.provider.required(),
    })
    .required(),
};
export const verifiyCodeSchema = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
      otp: generalFeilds.otp.required(),
    })
    .required(),
};
export const forgetPasswordSchema = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
    })
    .required(),
};
export const resetPasswordSchema = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
      otp: generalFeilds.otp.required(),
      password: generalFeilds.password.required(),
      confirm: generalFeilds.confirmPassword.required(),
    })
    .required(),
};
