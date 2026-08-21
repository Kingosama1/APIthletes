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

router.post("/", auth, requireRole("trainer"), createSession);

router.put("/:id", auth, requireRole("trainer"), updateSession);

router.delete("/:id", auth, requireRole("trainer"), deleteSession);

export default router;