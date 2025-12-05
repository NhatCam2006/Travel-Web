import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGalleryImages = async (req: Request, res: Response) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải thư viện ảnh" });
  }
};

export const createGalleryImage = async (req: Request, res: Response) => {
  try {
    const { src, title, location, category } = req.body;
    const image = await prisma.galleryImage.create({
      data: {
        src,
        title,
        location,
        category,
      },
    });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm ảnh" });
  }
};

export const deleteGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.galleryImage.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Đã xoá ảnh" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá ảnh" });
  }
};
