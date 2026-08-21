import { Request, Response } from "express";
import { ClassSession } from "../models/ClassSession";

export const createSession = async (req: Request, res: Response) => {
  try {
    const { title, startTime, endTime, capacity } = req.body;

    if (!title || !startTime || !endTime || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (capacity <= 0 || !Number.isInteger(capacity)) {
      return res.status(400).json({ message: "Capacity must be a positive integer" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({ message: "Session must be in the future" });
    }

    if (end <= start) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const session = await ClassSession.create({
      title,
      trainer: (req as any).user.id,
      startTime: start,
      endTime: end,
      capacity,
      bookedSeats: 0
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const { title, trainer, day, available } = req.query;
    let query: any = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (trainer) {
      query.trainer = trainer;
    }

    if (day) {
      const targetDay = new Date(day as string);
      const nextDay = new Date(targetDay);
      nextDay.setDate(nextDay.getDate() + 1);

      query.startTime = {
        $gte: targetDay,
        $lt: nextDay
      };
    }

    if (available === "true") {
      query.$expr = { $lt: ["$bookedSeats", "$capacity"] };
    }

    const sessions = await ClassSession.find(query).populate(
      "trainer",
      "name email"
    );

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id).populate(
      "trainer",
      "name email"
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.trainer.toString() !== (req as any).user.id) {
      return res.status(403).json({
        message: "Forbidden: You are not the trainer of this session"
      });
    }

    const { title, startTime, endTime, capacity } = req.body;

    if (
      capacity !== undefined &&
      (capacity <= 0 || !Number.isInteger(capacity))
    ) {
      return res.status(400).json({
        message: "Capacity must be a positive integer"
      });
    }

    if (startTime || endTime) {
      const start = startTime ? new Date(startTime) : session.startTime;
      const end = endTime ? new Date(endTime) : session.endTime;

      if (start <= new Date()) {
        return res.status(400).json({
          message: "Session must be in the future"
        });
      }

      if (end <= start) {
        return res.status(400).json({
          message: "End time must be after start time"
        });
      }
    }

    const updatedSession = await ClassSession.findByIdAndUpdate(
      req.params.id,
      { title, startTime, endTime, capacity },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedSession);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.trainer.toString() !== (req as any).user.id) {
      return res.status(403).json({
        message: "Forbidden: You are not the trainer of this session"
      });
    }

    await ClassSession.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Session deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};