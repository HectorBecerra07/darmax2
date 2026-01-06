import { Router } from "express";
import { listUsers, createMeeting, getMeetingsByDate } from "../controllers/zoomController.js";

const router = Router();

router.get("/users", listUsers);
router.post("/meetings", createMeeting);
router.get("/meetings", getMeetingsByDate); // New route to get meetings by date

export default router;
