import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";

const router = express.Router();

// Movie CRUD Routes
router.get("/", getMovies); // Get all movies
//router.get("/:id", getMovieById); // Get a single movie by ID
router.post("/", createMovie); // Add a new movie
router.put("/:id", updateMovie); // Update a movie
router.delete("/:id", deleteMovie); // Delete a movie

export default router;
