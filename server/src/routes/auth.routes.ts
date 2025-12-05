// server/src/routes/auth.routes.ts
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { rateLimit } from "../middleware/rateLimit";

const router = Router();

router.post(
  "/register",
  rateLimit({ windowMs: 60_000, max: 10 }),
  authController.register
);
router.post(
  "/login",
  rateLimit({ windowMs: 60_000, max: 15 }),
  authController.login
);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

export default router;
