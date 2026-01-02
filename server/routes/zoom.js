import { Router } from "express";
import { listUsers, createMeeting } from "../controllers/zoomController.js";

const router = Router();

router.get("/users", listUsers);
router.post("/meetings", createMeeting);

export default router;
