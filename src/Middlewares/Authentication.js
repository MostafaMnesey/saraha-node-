import { asyncHandler } from "../utils/response.js";
import { verifyToken } from "../utils/Token/token.js";
import * as db from "../Database/dbService.js";

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (!token || !bearer) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verifyToken({ token });
    const user = await db.findFirst({
      model: "User",
      where: {
        user_id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  });
};
