import { Router } from "express";
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
} from "../controllers/session.controller";
import { authMiddleware, requireRole } from "../middleware/auth";
const router = Router();

router.get("/", getAllSessions);
router.get("/:id", getSessionById);

router.post("/", authMiddleware, requireRole("trainer"), createSession);
router.put("/:id", authMiddleware, requireRole("trainer"), updateSession);
router.delete("/:id", authMiddleware, requireRole("trainer"), deleteSession);

export default router;