import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { userController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import checkoutRoutes from "./checkout.routes";
import { EventController } from "../controllers/EventController";
import { verifyToken, verifyRole } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();
const eventController = new EventController();

router.get("/health", healthController.check);
router.get("/public/events", eventController.listPublic);

import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";

// Auth routes
router.post("/auth/login", authController.login);

// Users routes
router.post("/users/register", userController.register);

// Public route — no JWT middleware
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Private test route
router.get("/private-admin", verifyToken, verifyRole([UserRole.ADMIN]), (req, res) => {
  res.json({ message: "Acesso autorizado", userId: req.user?.id });
});

router.use("/admin", adminRoutes);
router.use("/", userRoutes);

router.use('/checkout', checkoutRoutes);

export default router;
