// server/src/routes/admin.routes.ts
import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

// Bookings
router.get("/bookings", adminController.getBookings);
router.patch("/bookings/:id", adminController.updateBookingStatus);

// Locations
router.get("/locations", adminController.getLocations);
router.post("/locations", adminController.createLocation);
router.put("/locations/:id", adminController.updateLocation);
router.delete("/locations/:id", adminController.deleteLocation);

// Tours
router.get("/tours", adminController.getTours);
router.post("/tours", adminController.createTour);
router.put("/tours/:id", adminController.updateTour);
router.delete("/tours/:id", adminController.deleteTour);

// Vouchers
router.get("/vouchers", adminController.getVouchers);
router.post("/vouchers", adminController.createVoucher);
router.put("/vouchers/:id", adminController.updateVoucher);
router.delete("/vouchers/:id", adminController.deleteVoucher);

export default router;
