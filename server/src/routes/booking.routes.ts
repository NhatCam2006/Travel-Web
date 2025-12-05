// server/src/routes/booking.routes.ts
import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { requireAuth } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";

const router = Router();

router.post(
  "/",
  requireAuth,
  rateLimit({ windowMs: 60_000, max: 20 }),
  bookingController.createBooking
);

router.post("/:id/pay", requireAuth, bookingController.confirmPayment);

export default router;
