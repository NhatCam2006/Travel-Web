import { Router } from "express";
import {
  createReview,
  getAllReviews,
  deleteReview,
} from "../controllers/review.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// POST /api/bookings/:bookingId/reviews
router.post("/bookings/:bookingId/reviews", requireAuth, createReview);

// Admin routes
router.get("/reviews", requireAdmin, getAllReviews);
router.delete("/reviews/:id", requireAdmin, deleteReview);

export default router;
