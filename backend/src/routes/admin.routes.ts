import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { UserController } from "../controllers/UserController";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/role.middleware";
import { UserRole } from "../models/User";

const router = Router();
const eventController = new EventController();
const userController = new UserController();

router.use(verifyToken);
router.use(verifyRole([UserRole.ADMIN]));

router.get("/events", eventController.findAll);
router.post("/events", eventController.create);
router.put("/events/:id", eventController.update);

router.get("/users", userController.findAll);
router.put("/users/:id", userController.updateRole);

export default router;
