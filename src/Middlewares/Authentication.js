import { asyncHandler } from "../utils/response.js";
import { verifyToken } from "../utils/Token/token.js";
import * as db from "../dataBase/dbService.js";

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }
    const [bearer, token] = authorization.split(" ");
    if (!token || !bearer) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }
    const decoded = verifyToken({ token });
    const user = await db.findFirst({
      model: "User",
      where: {
        user_id: decoded.id,
        confirm: {
          not: null,
        },
      },
    });
    if (!user) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }
    if (user.freezed) {
      return next(new Error("Account Freezed", { cause: 401 }));
    }
    req.user = user;
    next();
  });
};
