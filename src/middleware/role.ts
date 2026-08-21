import { Request, Response, NextFunction } from "express";

const role = (allowedRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    if (user.role !== allowedRole) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};

export default role;