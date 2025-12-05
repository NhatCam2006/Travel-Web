// server/src/controllers/user.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../middleware/auth";

const prisma = new PrismaClient();

export async function getProfile(req: Request, res: Response) {
  const { userId } = (req as any).auth as JwtPayload;
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, phone: true },
  });
  res.json(user);
}

export async function getUserBookings(req: Request, res: Response) {
  const { userId } = (req as any).auth as JwtPayload;
  try {
    const bookings = await (prisma as any).booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        tour: { select: { id: true, name: true, price: true, duration: true } },
        schedule: { select: { departureDate: true } },
        review: { select: { id: true } }, // Check if reviewed
      },
    });
    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy bookings của user" });
  }
}

export async function createReview(req: Request, res: Response) {
  const { userId } = (req as any).auth as JwtPayload;
  const { tourId, rating, comment, images } = req.body as {
    tourId: number;
    rating: number;
    comment: string;
    images?: string[];
  };
  if (!tourId || !rating || rating < 1 || rating > 5) {
    res
      .status(400)
      .json({ error: "Thiếu tourId hoặc rating không hợp lệ (1-5)" });
    return;
  }
  try {
    const review = await (prisma as any).review.create({
      data: {
        userId,
        tourId,
        rating,
        comment: comment || "",
        images: images || [],
      },
    });
    res.json(review);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi tạo đánh giá" });
  }
}
