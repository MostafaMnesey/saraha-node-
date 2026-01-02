import { Router } from "express";
import { authentication } from "../../Middlewares/Authentication.js";
import * as user from "./user.service.js";
const router = Router();
router.get("/", authentication(), user.getUser);

export default router;
