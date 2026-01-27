import jwt from "jsonwebtoken";
export const generateToken = ({ user, tokenType }) => {
  return jwt.sign(
    { id: user.user_id },
    tokenType === "access"
      ? process.env.JWT_SECRET_ACCESS
      : process.env.JWT_SECRET_REFRESH,
    {
      expiresIn: tokenType === "access" ? "2h" : "7d",
    }
  );
};

export const verifyToken = ({ token, tokenType = tokenTypeEnum.access }) => {


  return jwt.verify(
    token,
    tokenType === "access"
      ? process.env.JWT_SECRET_ACCESS
      : process.env.JWT_SECRET_REFRESH
  );
};

const tokenTypeEnum = {
  access: "access",
  refresh: "refresh",
};
