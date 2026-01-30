import { asyncHandler, successResponse } from "../../utils/response.js";
import {
  comparePassword,
  decryptText,
  encryptText,
  hashPassword,
} from "../../utils/security/index.js";
import * as db from "../../dataBase/dbService.js";
import { generateOtp } from "../../utils/security/otp.js";
import { redis } from "../../utils/Radis/Connection.js";
import sendEmailEvent from "../../utils/Mailer/sendEmailEvent.js";
import { destructData } from "../../utils/Helpers.js";

export const getUser = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const phone = await decryptText({ text: user.phone });
  const profile = await db.findFirst({
    model: "Profile",
    where: {
      user_id: user.user_id,
    },
  });
  user.phone = phone;
  if (!profile) {
    return next(new Error("Profile is not found for this user ", { cause: 404 }))
  }
  return successResponse({
    res,
    status: 200,
    data: {
      user_id: user?.user_id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      provider: user?.provider,
      gender: user?.gender,
      phone: user?.phone,
      role: user?.role,
      confirm: user?.confirm,
      createdAt: user?.createdAt,

      profile: {
        avatar: profile?.avatar || "",
        cover: profile?.cover || "",
        bio: profile?.bio || "",
        user_id: profile?.user_id || "",
      },
    },
  });
});
export const searchUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.query;
  if (!user_id) {
    return next(new Error("User ID is required"));
  }

  const user = await db.findFirst({
    model: "User",
    where: {
      user_id,
    },
    include: {
      profile: true,
    },
  });
  if (!user) {
    return next(new Error("User not found"));
  }
  const phone = await decryptText({ text: user.phone });
  user.phone = phone;
  user.profile = {
    ...user.profile,
  };

  return successResponse({
    res,
    status: 200,
    data: {
      user: {
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        provider: user.provider,
        gender: user.gender,
        phone: user.phone,
        role: user.role,
        confirm: user.confirm,

        profile: {
          avatar: user.profile.avatar,
          cover: user.profile.cover,
          bio: user.profile.bio,
          user_id: user.user_id,
        },
      },
    },
  });
});
export const changePasswordCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);

  if (!email) {
    return next(new Error("Email must be provided"));
  }

  const user = await db.findFirst({
    model: "User",
    where: {
      user_id: req.user.user_id,
      email,
    },
    include: {
      profile: true,
    },
  });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const otp = generateOtp();
  console.log(otp);
  const hashedOtp = hashPassword({ password: otp });
  await redis.set(`${email}_change_password`, hashedOtp);
  await redis.expire(`${email}_change_password`, 60 * 10);

  const mail = sendEmailEvent.emit("sendEmail", {
    email,
    otp,
    subject: "Reset You Password",
    text: "reset Your password ",
  });
  if (!mail) {
    return next(
      new Error("Failed to send email ,please try again", {
        cause: 500,
      })
    );
  }

  return successResponse({
    res,
    status: 200,
    message: "Email sent ,Check your Email",
  });
});
export const changePassword = asyncHandler(async (req, res, next) => {
  const { email, otp, oldPassword, newPassword } = req.body;
  const [cachedOtpHash, user] = await Promise.all([
    redis.get(`${email}_change_password`),
    db.findFirst({
      model: "User",
      where: {
        user_id: req.user.user_id,
        email,
      },
      select: {
        password: true,
      },
    }),
  ]);
  if (!email) {
    return next(new Error("Email must be provided"));
  }
  const matchedOtp = comparePassword({
    password: otp,
    hash: cachedOtpHash ?? "",
  });
  if (!matchedOtp) {
    return next(
      new Error("in-vaild otp", {
        cause: 401,
      })
    );
  }

  console.log(user);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const matchedPassword = comparePassword({
    password: oldPassword,
    hash: user.password,
  });
  if (!matchedPassword) {
    return next(
      new Error("In-valid password ", {
        cause: 401,
      })
    );
  }

  const updatedUser = await db.updateOne({
    model: "User",
    where: {
      user_id: req.user.user_id,
      email,
    },
    data: {
      password: hashPassword({ password: newPassword }),
    },
  });

  if (!updatedUser) {
    return next(
      new Error("faild to change password ,try again", {
        cause: 500,
      })
    );
  }

  return successResponse({
    res,
    status: 200,
    message: "Password changed successfully",
  });
});

export const updateBasicInfo = asyncHandler(async (req, res, next) => {
  const allowedUserData = ["firstName", "lastName", "gender", "phone"];
  const allowedProfileData = ["bio"];
  if (req.body.phone) {
    req.body.phone = encryptText({
      text: req.body.phone,
    });
  }
  const userData = destructData({ body: req.body, allowed: allowedUserData });
  const profileData = destructData({
    body: req.body,
    allowed: allowedProfileData,
  });

  const user = await db.findFirst({
    model: "User",
    where: {
      user_id: req.user.user_id,
    },
  });
  if (!user) {
    return next(new Error("user not found", { cause: 401 }));
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: req.user.user_id },
    data: {
      ...userData,

      ...(Object.keys(profileData).length && {
        profile: {
          upsert: {
            update: profileData,
            create: profileData,
          },
        },
      }),
    },
    include: { profile: true },
  });
  return successResponse({
    res,
    data: updatedUser,
    status: 200,
  });
});
export const freezAccount = asyncHandler(async (req, res, next) => {
  console.log(req.user.id);

  const updatedUser = await db.updateOne({
    model: "User",
    where: {
      user_id: req.user.user_id,
    },
    data: {
      freezed: true,
      freezedAt: new Date(),
      freezedBy: req.user.user_id,
    },
  });
  if (!updatedUser) {
    return next(new Error("user not found", { cause: 401 }));
  }

  return successResponse({
    res,
    message: "Account freezed successfully",

    status: 200,
  });
});
export const restoreAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await db.findFirst({
    model: "User",
    where: {
      user_id: id,
      freezed: true,
      freezedBy: id,
    },
  });
  if (!user) {
    return next(new Error("only freezed user can be restored", { cause: 401 }));
  }

  const updatedUser = await db.updateOne({
    model: "User",
    where: {
      user_id: id,
      freezedBy: id,
      freezed: true,
    },
    data: {
      freezed: false,
      freezedAt: null,
      freezedBy: null,
    },
  });
  if (!updatedUser) {
    return next(new Error("user not found", { cause: 401 }));
  }

  return successResponse({
    res,
    message: "Account restored successfully",
    status: 200,
  });
});


export const searchWithName = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  if (!search) {
    return next(new Error("Search is required", { cause: 400 }));
  }
  const users = await db.findMany({
    model: "User",
    where: {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      user_id: true,
      firstName: true,
      lastName: true,
      email: true,
      profile: {
        select: {
          avatar: true,
        },
      },
    },
  });
  return successResponse({
    res,
    status: 200,
    data: { users },
  })
})