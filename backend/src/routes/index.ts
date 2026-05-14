import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { AuthController } from "../controllers/AuthController";
import checkoutRoutes from "./checkout.routes";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();

router.get("/health", healthController.check);

// Public route — no JWT middleware
router.post("/register", authController.register);

router.use('/checkout', checkoutRoutes);

export default router;
