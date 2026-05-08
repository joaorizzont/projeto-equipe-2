import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();

router.get("/health", healthController.check);

import adminRoutes from "./admin.routes";

// Public route — no JWT middleware
router.post("/register", authController.register);

router.use("/admin", adminRoutes);

export default router;
