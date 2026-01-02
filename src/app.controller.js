import express from "express";
import auth from "./Modules/Auth/auth.controller.js";
import user from "./Modules/User/user.controller.js";
import { globalErrorHandling } from "./utils/response.js";
import { redisConnection } from "./utils/Radis/Connection.js";
import cors from "cors";
const bootstrap = async () => {
  const app = express();

  const port = process.env.PORT || 3000;
  app.use(cors());
  app.use(express.json());
  await redisConnection();

  app.use("/auth", auth);
  app.use("/user", user);
  app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });
  app.use(globalErrorHandling);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

export default bootstrap;
