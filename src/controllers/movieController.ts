import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all movies
export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies", error });
  }
};

// Get a single movie by ID
export const getMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id) },
    });

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie", error });
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
