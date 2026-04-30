import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();

router.get("/health", healthController.check);

// Public route — no JWT middleware
router.post("/register", authController.register);

export default router;
