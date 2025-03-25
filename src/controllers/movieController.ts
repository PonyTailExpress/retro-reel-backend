import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get a single movie by ID
export const getMovieById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  // Check if the ID is a valid number
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.json(movie);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching movie:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch movie", error: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({
        message: "Failed to fetch movie",
        error: "Unknown error occurred",
      });
    }
  }
};

// Get all movies
export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies", error });
  }
};

// Create a new movie
export const createMovie = async (req: Request, res: Response) => {
  const { title, description, releaseYear, genre, poster, trailerUrl } =
    req.body;

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        description,
        releaseYear,
        genre,
        poster,
        trailerUrl,
        imdbId: req.body.imdbId, // Ensure this field is provided in the request body
        director: req.body.director, // Ensure this field is provided in the request body
      },
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: "Failed to create movie", error });
  }
};

// Update a movie by ID
export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, releaseYear, genre, poster, trailerUrl } =
    req.body;

  try {
    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        releaseYear,
        genre,
        poster,
        trailerUrl,
      },
    });

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: "Failed to update movie", error });
  }
};

// Delete a movie by ID
export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete movie", error });
  }
};
