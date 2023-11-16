import { validation } from "../../middleware/validation.js";
import *as validators from "../auth/validation.js"
import * as authController from "./controller/auth.js";

import { Router } from "express";
const router = Router();
router.post("/signup",validation(validators.signup), authController.SignUP);
router.get("/confirmEmail/:token",authController.confirmEmail);
router.get("/newconfirmEmail/:token",authController.newConfirmEmail);
router.post("/login",validation(validators.login), authController.login);
export default router;
