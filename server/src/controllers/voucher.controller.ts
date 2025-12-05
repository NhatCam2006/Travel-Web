// server/src/controllers/voucher.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function validateVoucher(req: Request, res: Response) {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: "Thiếu mã voucher" });
    return;
  }
  try {
    const voucher = await (prisma as any).voucher.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!voucher) {
      res.status(404).json({ error: "Mã voucher không tồn tại" });
      return;
    }
    if (!voucher.isActive) {
      res.status(400).json({ error: "Mã voucher đã bị vô hiệu hóa" });
      return;
    }
    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      res.status(400).json({ error: "Mã voucher đã hết hạn" });
      return;
    }
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      res.status(400).json({ error: "Mã voucher đã hết lượt sử dụng" });
      return;
    }
    res.json({
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        discountType: voucher.discountType,
        value: voucher.value,
        maxDiscount: voucher.maxDiscount,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi kiểm tra voucher" });
  }
}
