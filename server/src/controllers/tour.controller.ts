// server/src/controllers/tour.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getLocations(req: Request, res: Response) {
  try {
    const locations = await prisma.location.findMany({
      include: {
        tours: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách địa điểm" });
  }
}

export async function getPopularTours(req: Request, res: Response) {
  try {
    const tours = await prisma.tour.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        images: true,
        locationId: true,
      },
    });
    res.json(tours);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy tours phổ biến" });
  }
}

export async function getToursByRegion(req: Request, res: Response) {
  const { region } = req.query as { region?: string };
  try {
    if (region && !["NORTH", "CENTRAL", "SOUTH"].includes(region)) {
      res.status(400).json({ error: "Region không hợp lệ" });
      return;
    }
    const tours = await prisma.tour.findMany({
      where: region
        ? { location: { region: region as "NORTH" | "CENTRAL" | "SOUTH" } }
        : undefined,
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        images: true,
        locationId: true,
      },
    });
    res.json(tours);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy tours theo vùng" });
  }
}

export async function searchTours(req: Request, res: Response) {
  const { q, minPrice, maxPrice, region, sort } = req.query as {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    region?: "NORTH" | "CENTRAL" | "SOUTH";
    sort?: "price-asc" | "price-desc" | "newest";
  };
  try {
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (region && ["NORTH", "CENTRAL", "SOUTH"].includes(region)) {
      where.location = { region };
    }
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const tours = await prisma.tour.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        images: true,
        locationId: true,
      },
    });
    res.json(tours);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi tìm kiếm tours" });
  }
}

export async function getTourById(req: Request, res: Response) {
  const { id } = req.params;
  const tourId = parseInt(id, 10);

  if (isNaN(tourId)) {
    res.status(400).json({ error: "ID tour không hợp lệ" });
    return;
  }

  try {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        location: true,
      },
    });

    if (!tour) {
      res.status(404).json({ error: "Không tìm thấy tour" });
      return;
    }

    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết tour" });
  }
}

export async function getTourReviews(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const reviews = await (prisma as any).review.findMany({
      where: { tourId: parseInt(id, 10) },
      select: {
        id: true,
        rating: true,
        comment: true,
        images: true,
        createdAt: true,
        user: {
          select: { id: true, name: true },
        },
        bookingId: true, // Check if verified
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi lấy đánh giá" });
  }
}
