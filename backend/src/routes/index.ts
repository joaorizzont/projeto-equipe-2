import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { AuthController } from "../controllers/AuthController";
import { verifyToken, verifyRole } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();

router.get("/health", healthController.check);

import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";

// Public route — no JWT middleware
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Private test route
router.get("/private-admin", verifyToken, verifyRole([UserRole.ADMIN]), (req, res) => {
  res.json({ message: "Acesso autorizado", userId: req.user?.id });
});

router.use("/admin", adminRoutes);
router.use("/me", userRoutes);

export default router;
