// server/src/routes/location.routes.ts
import { Router } from "express";
import * as tourController from "../controllers/tour.controller";

const router = Router();

router.get("/", tourController.getLocations);

export default router;
