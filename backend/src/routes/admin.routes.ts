import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/role.middleware";
import { UserRole } from "../models/User";

const router = Router();
const eventController = new EventController();

router.use(verifyToken);
router.use(verifyRole([UserRole.ADMIN]));

router.get("/events", eventController.findAll);
router.post("/events", eventController.create);
router.put("/events/:id", eventController.update);

export default router;
