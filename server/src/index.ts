// server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import tourRoutes from "./routes/tour.routes";
import locationRoutes from "./routes/location.routes";
import bookingRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import voucherRoutes from "./routes/voucher.routes";
import scheduleRoutes from "./routes/schedule.routes";
import reviewRoutes from "./routes/review.routes";
import galleryRoutes from "./routes/gallery.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// CORS configuration
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.send("API Web Du Lịch đang chạy!");
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api", scheduleRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api", reviewRoutes);
app.use("/admin", adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
