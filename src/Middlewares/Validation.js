import joi from "joi";
import { asyncHandler } from "../utils/response.js";

export const Validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const validationErrors = [];

    for (const key of Object.keys(schema)) {
      const validationResult = await schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResult.error) {
        validationErrors.push(validationResult.error);
      }
    }
    const errors = validationErrors.map((error) => error.details[0].message);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        errors,
      });
    }
    next();
  });
};
