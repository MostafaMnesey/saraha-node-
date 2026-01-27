import express from "express";
import auth from "./Modules/Auth/auth.controller.js";
import user from "./Modules/User/user.controller.js";
import messages from "./Modules/Messages/Messages.controller.js"
import { globalErrorHandling } from "./utils/response.js";
import { redisConnection } from "./utils/Radis/Connection.js";
import cors from "cors";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swagger.js";

const bootstrap = async () => {
  const app = express();

  const port = process.env.PORT || 3000;
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  await redisConnection();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/auth", auth);
  app.use("/user", user);
  app.use("/messages", messages);
  app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });
  app.use(globalErrorHandling);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

export default bootstrap;
