import { Router } from "express";
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from "../controllers/gallery.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", getGalleryImages);
router.post("/", requireAuth, requireAdmin, createGalleryImage);
router.delete("/:id", requireAuth, requireAdmin, deleteGalleryImage);

export default router;
