// server/src/routes/user.routes.ts
import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, userController.getProfile);
router.get("/bookings", requireAuth, userController.getUserBookings);
// router.post("/reviews", requireAuth, userController.createReview); // Deprecated: Use /api/bookings/:id/reviews

export default router;
