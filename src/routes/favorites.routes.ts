import { Router, Request, Response } from "express";
import { isAuthenticated } from "../middleware/jwt.middleware";
import prisma from "../prisma";

const router = Router();

// Type definition for request body
interface FavoriteRequestBody {
  userId: number;
  movieId: number;
}

// ✅ Route to add a movie to favorites
router.post(
  "/add",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const { userId, movieId } = req.body as FavoriteRequestBody;

    try {
      // Check if the favorite already exists
      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          userId_movieId: { userId, movieId },
        },
      });

      if (existingFavorite) {
        res.status(400).json({ message: "Movie is already in favorites." });
        return; // ✅ Fix: Ensure no further execution happens
      }

      // Add movie to favorites
      await prisma.favorite.create({
        data: {
          userId,
          movieId,
        },
      });

      res.status(201).json({ message: "Movie added to favorites." });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Error adding favorite", error });
    }
  }
);

// ✅ Route to get all favorite movies for a user
router.get(
  "/:userId",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: Number(userId) },
        include: { movie: true }, // Fetch movie details
      });

      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Error fetching favorites", error });
    }
  }
);

// ✅ Route to remove a movie from favorites
router.delete(
  "/remove",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const { userId, movieId } = req.body as FavoriteRequestBody;

    try {
      // Check if the favorite exists
      const existingFavorite = await prisma.favorite.findUnique({
        where: { userId_movieId: { userId, movieId } },
      });

      if (!existingFavorite) {
        res.status(404).json({ message: "Movie not found in favorites." });
        return;
      }

      // Remove the favorite
      await prisma.favorite.delete({
        where: { userId_movieId: { userId, movieId } },
      });

      res.status(200).json({ message: "Movie removed from favorites." });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Error removing favorite", error });
    }
  }
);

export default router;
