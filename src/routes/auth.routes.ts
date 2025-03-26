import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { isAuthenticated } from "../middleware/jwt.middleware";

const router = Router();
const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password }: Prisma.UserCreateInput =
        req.body as Prisma.UserCreateInput;

      if (!username || !email || !password) {
        res
          .status(400)
          .json({ message: "Provide email, password, and username." });
        return;
      }

      // Check if user already exists
      const foundUser = await prisma.user.findUnique({ where: { email } });
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // Hash password securely
      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      // Create user
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /auth/login - Verifies email and password and returns a JWT
router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    // Check if email or password are provided as empty string
    if (!email || !password) {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }

    try {
      // Check if the user exists in the database
      const foundUser = await prisma.user.findUnique({ where: { email } });
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the password
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      console.log(`passwordCorrect`, passwordCorrect);

      if (passwordCorrect) {
        // If password is correct, create the JWT payload
        const { id, username, email: userEmail } = foundUser;
        const payload = { id, username, email: userEmail };

        // Create and sign the JWT token
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET || "default_secret",
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );

        // Send the token as the response
        res.status(200).json({ authToken });
        return;
      }

      res.status(401).json({ message: "Unable to authenticate the user" });
    } catch (error) {
      next(error);
    }
  }
);

// GET /auth/verify - Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req: Request, res: Response) => {
  // If JWT token is valid, the payload gets decoded by the isAuthenticated middleware and made available on req.payload
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
  return;
});

// DELETE /auth/delete - Deletes the authenticated user
router.delete(
  "/delete",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.payload?.id; // Get user ID from the decoded JWT payload

      if (!userId) {
        res.status(400).json({ message: "User ID not found." });
        return;
      }

      // Delete the user from the database
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "Error deleting user",
        error: (error as Error).message,
      });
    }
  }
);

export default router;
