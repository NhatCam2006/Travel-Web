// server/src/middleware/rateLimit.ts
import { Request, Response, NextFunction } from "express";

type RateKey = string;
const buckets = new Map<RateKey, { count: number; resetAt: number }>();

export function rateLimit({
  windowMs,
  max,
}: {
  windowMs: number;
  max: number;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "";
    const key = `${ip}:${req.method}:${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (bucket.count >= max) {
      const retry = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));
      res.status(429).json({
        error: "Quá nhiều yêu cầu, thử lại sau",
        retryAfterSeconds: retry,
      });
      return;
    }
    bucket.count += 1;
    next();
  };
}
