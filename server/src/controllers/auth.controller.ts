// server/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signToken, verifyToken } from "../middleware/auth";

const prisma = new PrismaClient();

function validateEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

function validatePhoneVN(phone?: string) {
  if (!phone) return true;
  return /^0[35789]\d{8}$/.test(phone);
}

function validatePassword(pw: string) {
  return pw.length >= 6 && /[^A-Za-z0-9]/.test(pw);
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, phone, password } = req.body as {
      name: string;
      email: string;
      phone?: string;
      password: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ error: "Thiếu name/email/password" });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).json({ error: "Email không hợp lệ" });
      return;
    }
    if (!validatePhoneVN(phone)) {
      res.status(400).json({ error: "Số điện thoại không hợp lệ" });
      return;
    }
    if (!validatePassword(password)) {
      res
        .status(400)
        .json({ error: "Mật khẩu tối thiểu 6 ký tự và có ký tự đặc biệt" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await (prisma as any).user.create({
      data: { name, email, phone, passwordHash, role: "USER" },
    });

    const token = signToken({ userId: user.id, role: user.role as any });
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (err: any) {
    if (err?.code === "P2002") {
      res.status(409).json({ error: "Email đã tồn tại" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Lỗi server đăng ký" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: "Thiếu email/password" });
    return;
  }
  try {
    const user = await (prisma as any).user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Sai email hoặc mật khẩu" });
      return;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Sai email hoặc mật khẩu" });
      return;
    }
    const token = signToken({ userId: user.id, role: user.role as any });
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server đăng nhập" });
  }
}

export async function me(req: Request, res: Response) {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    res.status(200).json(null);
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(200).json(null);
    return;
  }
  const user = await (prisma as any).user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(user);
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
}
