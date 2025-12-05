import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../middleware/auth";

const prisma = new PrismaClient();

// Admin Bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status } = req.query as { status?: string };
    const where: any = {};
    if (status && ["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      where.status = status;
    }
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        tour: { select: { id: true, name: true } },
        schedule: { select: { departureDate: true } },
      },
    });
    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy bookings" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status?: string };
  if (!id || !status) {
    res.status(400).json({ error: "Thiếu id/status" });
    return;
  }
  if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
    res.status(400).json({ error: "Trạng thái không hợp lệ" });
    return;
  }
  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: status as any },
      include: { tour: { select: { id: true, name: true } } },
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi cập nhật trạng thái" });
  }
};

// Admin Locations
export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy locations" });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name, description, region, latitude, longitude, image } =
      req.body as {
        name: string;
        description?: string | null;
        region: "NORTH" | "CENTRAL" | "SOUTH";
        latitude: number | string;
        longitude: number | string;
        image: string;
      };
    if (!name || !image || !region) {
      res.status(400).json({ error: "Thiếu name/image/region" });
      return;
    }
    if (!["NORTH", "CENTRAL", "SOUTH"].includes(region)) {
      res.status(400).json({ error: "Region không hợp lệ" });
      return;
    }
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      res.status(400).json({ error: "Toạ độ không hợp lệ" });
      return;
    }
    const created = await prisma.location.create({
      data: {
        name,
        description: description ?? null,
        region,
        latitude: lat,
        longitude: lng,
        image,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi tạo location" });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, description, region, latitude, longitude, image } =
      req.body as {
        name?: string;
        description?: string | null;
        region?: "NORTH" | "CENTRAL" | "SOUTH";
        latitude?: number | string;
        longitude?: number | string;
        image?: string;
      };
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (region !== undefined) {
      if (!["NORTH", "CENTRAL", "SOUTH"].includes(region)) {
        res.status(400).json({ error: "Region không hợp lệ" });
        return;
      }
      data.region = region;
    }
    if (latitude !== undefined) {
      const lat = Number(latitude);
      if (!Number.isFinite(lat)) {
        res.status(400).json({ error: "Latitude không hợp lệ" });
        return;
      }
      data.latitude = lat;
    }
    if (longitude !== undefined) {
      const lng = Number(longitude);
      if (!Number.isFinite(lng)) {
        res.status(400).json({ error: "Longitude không hợp lệ" });
        return;
      }
      data.longitude = lng;
    }
    if (image !== undefined) data.image = image;
    const updated = await prisma.location.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi cập nhật location" });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.location.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi xoá location" });
  }
};

// Admin Tours
export const getTours = async (req: Request, res: Response) => {
  try {
    const tours = await prisma.tour.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        locationId: true,
      },
    });
    res.json(tours);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy tours" });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      transport,
      images,
      locationId,
    } = req.body as {
      name: string;
      description: string;
      price: number | string;
      duration: string;
      transport?: string | null;
      images?: string[];
      locationId: number | string;
    };
    if (!name || !description || !price || !duration || !locationId) {
      res.status(400).json({ error: "Thiếu trường bắt buộc" });
      return;
    }
    const p = Number(price);
    const locId = Number(locationId);
    if (!Number.isFinite(p) || p < 0) {
      res.status(400).json({ error: "Giá không hợp lệ" });
      return;
    }
    const loc = await prisma.location.findUnique({ where: { id: locId } });
    if (!loc) {
      res.status(400).json({ error: "locationId không tồn tại" });
      return;
    }
    const created = await prisma.tour.create({
      data: {
        name,
        description,
        price: p,
        duration,
        transport: transport ?? null,
        images: images ?? [],
        locationId: locId,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi tạo tour" });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      description,
      price,
      duration,
      transport,
      images,
      locationId,
    } = req.body as {
      name?: string;
      description?: string;
      price?: number | string;
      duration?: string;
      transport?: string | null;
      images?: string[];
      locationId?: number | string;
    };
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) {
      const p = Number(price);
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ error: "Giá không hợp lệ" });
        return;
      }
      data.price = p;
    }
    if (duration !== undefined) data.duration = duration;
    if (transport !== undefined) data.transport = transport;
    if (images !== undefined) data.images = images;
    if (locationId !== undefined) {
      const locId = Number(locationId);
      const loc = await prisma.location.findUnique({ where: { id: locId } });
      if (!loc) {
        res.status(400).json({ error: "locationId không tồn tại" });
        return;
      }
      data.locationId = locId;
    }
    const updated = await prisma.tour.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi cập nhật tour" });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.tour.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi xoá tour" });
  }
};

// Admin Vouchers
export const getVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await (prisma as any).voucher.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(vouchers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy vouchers" });
  }
};

export const createVoucher = async (req: Request, res: Response) => {
  const {
    code,
    discountType,
    value,
    maxDiscount,
    expiresAt,
    usageLimit,
    isActive,
  } = req.body;
  if (!code || !discountType || !value) {
    res
      .status(400)
      .json({ error: "Thiếu thông tin bắt buộc (code, discountType, value)" });
    return;
  }
  try {
    const voucher = await (prisma as any).voucher.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        value: parseFloat(value),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    res.json(voucher);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi tạo voucher" });
  }
};

export const updateVoucher = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const {
    code,
    discountType,
    value,
    maxDiscount,
    expiresAt,
    usageLimit,
    isActive,
  } = req.body;
  try {
    const voucher = await (prisma as any).voucher.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountType: discountType || undefined,
        value: value ? parseFloat(value) : undefined,
        maxDiscount:
          maxDiscount !== undefined
            ? maxDiscount
              ? parseFloat(maxDiscount)
              : null
            : undefined,
        expiresAt:
          expiresAt !== undefined
            ? expiresAt
              ? new Date(expiresAt)
              : null
            : undefined,
        usageLimit:
          usageLimit !== undefined
            ? usageLimit
              ? parseInt(usageLimit, 10)
              : null
            : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });
    res.json(voucher);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi cập nhật voucher" });
  }
};

export const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await (prisma as any).voucher.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi xóa voucher" });
  }
};
