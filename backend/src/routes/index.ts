import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { userController } from "../controllers/UserController";

const router = Router();
const healthController = new HealthController();

router.get("/health", healthController.check);

// Users routes
router.post("/users/register", userController.register);

export default router;
