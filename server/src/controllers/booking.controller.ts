// server/src/controllers/booking.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../middleware/auth";
import { sendBookingConfirmation } from "../utils/email";

const prisma = new PrismaClient();

export async function createBooking(req: Request, res: Response) {
  const { userId } = (req as any).auth as JwtPayload;
  const {
    tourId,
    scheduleId,
    customerName,
    customerEmail,
    customerPhone,
    adultCount,
    childCount,
    totalPrice,
    voucherCode,
  } = req.body as {
    tourId: number;
    scheduleId?: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    adultCount: number;
    childCount?: number;
    totalPrice: number;
    voucherCode?: string;
  };

  if (
    !tourId ||
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !adultCount ||
    adultCount < 1 ||
    !totalPrice
  ) {
    res.status(400).json({ error: "Thiếu thông tin đặt tour" });
    return;
  }

  try {
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      res.status(404).json({ error: "Tour không tồn tại" });
      return;
    }

    // Check if tour has schedules
    const hasSchedules = await (prisma as any).tourSchedule.findFirst({
      where: { tourId },
    });

    if (hasSchedules && !scheduleId) {
      res.status(400).json({ error: "Vui lòng chọn lịch khởi hành" });
      return;
    }

    let departureDate = null;

    // Validate Schedule
    if (scheduleId) {
      const schedule = await (prisma as any).tourSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        res.status(404).json({ error: "Lịch khởi hành không tồn tại" });
        return;
      }

      if (schedule.tourId !== tourId) {
        res.status(400).json({ error: "Lịch khởi hành không thuộc tour này" });
        return;
      }

      const totalPeople = adultCount + (childCount || 0);
      if (schedule.availableSeats < totalPeople) {
        res
          .status(400)
          .json({ error: "Lịch khởi hành đã hết chỗ hoặc không đủ chỗ" });
        return;
      }

      departureDate = schedule.departureDate;

      // Decrement seats
      await (prisma as any).tourSchedule.update({
        where: { id: scheduleId },
        data: { availableSeats: schedule.availableSeats - totalPeople },
      });
    }

    // Validate voucher if provided (tracking only, no FK in schema)
    if (voucherCode) {
      const voucher = await (prisma as any).voucher.findUnique({
        where: { code: voucherCode.toUpperCase() },
      });
      if (!voucher) {
        res.status(404).json({ error: "Voucher không tồn tại" });
        return;
      }
      if (!voucher.isActive) {
        res.status(400).json({ error: "Voucher đã bị vô hiệu hóa" });
        return;
      }
      if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
        res.status(400).json({ error: "Voucher đã hết hạn" });
        return;
      }
      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        res.status(400).json({ error: "Voucher đã hết lượt sử dụng" });
        return;
      }
      // Update voucher usage count
      await (prisma as any).voucher.update({
        where: { id: voucher.id },
        data: { usedCount: voucher.usedCount + 1 },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        tourId,
        scheduleId,
        departureDate,
        customerName,
        customerEmail,
        customerPhone,
        adultCount,
        childCount: childCount || 0,
        totalPrice,
        status: "PENDING",
      },
      include: {
        tour: { select: { id: true, name: true, price: true } },
        schedule: true, // Include schedule info for email
      },
    });

    // Gửi email xác nhận (không await để tránh block response)
    sendBookingConfirmation(booking, tour, booking.schedule).catch(
      console.error
    );

    res.status(201).json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
  }
}

export async function confirmPayment(req: Request, res: Response) {
  const { id } = req.params;
  const { userId } = (req as any).auth as JwtPayload;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      return;
    }

    if (booking.userId !== userId) {
      res.status(403).json({ error: "Không có quyền thực hiện" });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "CONFIRMED" },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xác nhận thanh toán" });
  }
}
