import express from "express";
import auth from "./Modules/Auth/auth.contriller.js";
import { globalErrorHandling } from "./utils/response.js";
import { redisConnection } from "./utils/Radis/Connection.js";

const bootstrap = async () => {
  const app = express();

  const port = process.env.PORT || 3000;

  app.use(express.json());
  await redisConnection();

  app.use("/auth", auth);

  app.use(globalErrorHandling);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

export default bootstrap;
