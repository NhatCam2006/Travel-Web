// server/src/routes/tour.routes.ts
import { Router } from "express";
import * as tourController from "../controllers/tour.controller";

const router = Router();

// Specific routes MUST come before parameterized routes
router.get("/popular", tourController.getPopularTours);
router.get("/by-region", tourController.getToursByRegion);
router.get("/search", tourController.searchTours);
router.get("/:id/reviews", tourController.getTourReviews);
router.get("/:id", tourController.getTourById);

export default router;
