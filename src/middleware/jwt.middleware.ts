import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the payload property
declare global {
  namespace Express {
    interface Request {
      payload?: { id: number; username: string; email: string };
    }
  }
}
import jwt from "jsonwebtoken";

// JWT token validation middleware
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json("Token not provided");
      return;
    }

    // Decodes and validates the token
    const payload = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: number;
      email: string;
      username: string;
    };

    // Pass the decoded payload to the next route
    req.payload = payload;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json("Token not valid");
  }
};
