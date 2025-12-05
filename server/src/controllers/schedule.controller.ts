import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTourSchedules = async (req: Request, res: Response) => {
  const { tourId } = req.params;

  try {
    const schedules = await prisma.tourSchedule.findMany({
      where: {
        tourId: Number(tourId),
        departureDate: {
          gte: new Date(), // Chỉ lấy lịch tương lai
        },
      },
      orderBy: {
        departureDate: "asc",
      },
    });

    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch khởi hành" });
  }
};

export const getScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await prisma.tourSchedule.findUnique({
      where: { id: Number(id) },
      include: {
        tour: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch khởi hành" });
    }

    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  const { tourId } = req.params;
  const { departureDate, returnDate, price, availableSeats } = req.body;

  if (!departureDate || !returnDate || !availableSeats) {
    return res.status(400).json({ message: "Thiếu thông tin lịch trình" });
  }

  try {
    const schedule = await prisma.tourSchedule.create({
      data: {
        tourId: Number(tourId),
        departureDate: new Date(departureDate),
        returnDate: new Date(returnDate),
        price: price ? Number(price) : null,
        availableSeats: Number(availableSeats),
      },
    });
    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo lịch khởi hành" });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.tourSchedule.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Đã xóa lịch khởi hành" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa lịch khởi hành" });
  }
};
