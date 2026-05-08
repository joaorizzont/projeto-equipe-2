import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();

router.get("/health", healthController.check);

// Public route — no JWT middleware
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

export default router;
