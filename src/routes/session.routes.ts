import { Router } from "express";

import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
} from "../controllers/session.controller";

import auth from "../middleware/auth";
import requireRole from "../middleware/role";

const router = Router();

router.get("/", getAllSessions);

router.get("/:id", getSessionById);

router.post("/", auth, requireRole("Trainer"), createSession);

router.put("/:id", auth, requireRole("Trainer"), updateSession);

router.delete("/:id", auth, requireRole("Trainer"), deleteSession);
export default router;