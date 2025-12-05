import { Router } from "express";
import {
  getTourSchedules,
  getScheduleById,
  createSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/tours/:tourId/schedules", getTourSchedules);
router.get("/schedules/:id", getScheduleById);

// Admin routes
router.post("/tours/:tourId/schedules", requireAdmin, createSchedule);
router.delete("/schedules/:id", requireAdmin, deleteSchedule);

export default router;
