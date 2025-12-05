// server/src/routes/voucher.routes.ts
import { Router } from "express";
import * as voucherController from "../controllers/voucher.controller";

const router = Router();

router.post("/validate", voucherController.validateVoucher);

export default router;
