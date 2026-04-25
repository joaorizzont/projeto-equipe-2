import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { userController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const healthController = new HealthController();
const authController = new AuthController();

router.get("/health", healthController.check);

// Auth routes
router.post("/auth/login", authController.login);

// Users routes
router.post("/users/register", userController.register);

export default router;
