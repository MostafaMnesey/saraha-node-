import { asyncHandler, successResponse } from "../../utils/response.js";
import { decryptText } from "../../utils/security/index.js";
import * as db from "../../dataBase/dbService.js";
export const getUser = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const phone = await decryptText({ text: user.phone });
  const profile = await db.findFirst({
    model: "Profile",
    where: {
      user_id: "cmjvqzw6a0000zotfgk01t7uc",
    },
  });
  user.phone = phone;
  return successResponse({
    res,
    status: 200,
    data: {
      user_id: user.user_id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      provider: user.provider,
      gender: user.gender,
      phone: user.phone,
      role: user.role,
      confirm: user.confirm,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: {
        ...profile,
      },
    },
  });
});
