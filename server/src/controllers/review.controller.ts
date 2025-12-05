import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../middleware/auth";

const prisma = new PrismaClient();

export const createReview = async (req: Request, res: Response) => {
  const { userId } = (req as any).auth as JwtPayload;
  const { bookingId } = req.params;
  const { rating, comment, images } = req.body;

  if (!rating || !comment) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đánh giá và điểm số" });
  }

  try {
    // 1. Kiểm tra booking có tồn tại và thuộc về user này không
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { tour: true },
    });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt tour" });
    }

    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền đánh giá đơn này" });
    }

    // 2. Kiểm tra trạng thái booking (phải CONFIRMED hoặc COMPLETED nếu có)
    // Ở đây ta tạm chấp nhận CONFIRMED
    if (booking.status !== "CONFIRMED") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể đánh giá tour đã hoàn thành/xác nhận" });
    }

    // 3. Kiểm tra xem đã đánh giá chưa
    const existingReview = await (prisma as any).review.findUnique({
      where: { bookingId: Number(bookingId) },
    });

    if (existingReview) {
      return res.status(400).json({ message: "Bạn đã đánh giá tour này rồi" });
    }

    // 4. Tạo review
    const review = await (prisma as any).review.create({
      data: {
        rating: Number(rating),
        comment,
        images: images || [],
        userId,
        tourId: booking.tourId,
        bookingId: Number(bookingId),
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi tạo đánh giá" });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await (prisma as any).review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tour: { select: { id: true, name: true } },
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đánh giá" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await (prisma as any).review.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Đã xóa đánh giá" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa đánh giá" });
  }
};
