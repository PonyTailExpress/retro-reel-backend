import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

// Create Prisma Client instance
const prisma = new PrismaClient();

// Define the structure of the data from OMDb API response
interface OMDbMovieData {
  Title: string;
  Plot: string;
  Year: string;
  Genre: string;
  Director: string;
  Poster: string;
  imdbRating: string;
  Response: string;
}

// Type guard to check if data is of type OMDbMovieData
function isOMDbMovieData(data: any): data is OMDbMovieData {
  return (
    data &&
    typeof data.Title === "string" &&
    typeof data.Plot === "string" &&
    typeof data.Year === "string" &&
    typeof data.Genre === "string" &&
    typeof data.Director === "string" &&
    typeof data.Poster === "string" &&
    typeof data.imdbRating === "string" &&
    typeof data.Response === "string"
  );
}

const imdbIds: string[] = [
  "tt0105236",
  "tt0103064",
  "tt0099685",
  "tt0120815",
  "tt0110912",
  "tt0100150",
  "tt0129167",
  "tt0100758",
  "tt0118655",
  "tt0117951",
  "tt0118749",
  "tt0109506",
  "tt0108399",
  "tt0114369",
  "tt0100935",
  "tt0106856",
  "tt0101272",
  "tt0119177",
  "tt0118929",
  "tt0120611",
  "tt0137523",
  "tt0119116",
  "tt0113277",
  "tt0110413",
  "tt0106677",
  "tt0120382",
  "tt0112641",
  "tt0118715",
  "tt0116282",
  "tt0120586",
  "tt0103874",
  "tt0120735",
  "tt0114746",
  "tt0109686",
  "tt0110632",
  "tt0105793",
  "tt0111257",
  "tt0175880",
  "tt0118789",
  "tt0120669",
  "tt0113568",
  "tt0099487",
  "tt0133093",
];

const OMDB_API_KEY = "7ffceb24";

// Helper function to fetch movie data and ensure it's typed correctly
async function fetchMovieData(imdbId: string): Promise<OMDbMovieData | null> {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
  );
  const data = await response.json();

  // Use the type guard to validate if data is of the correct shape
  if (isOMDbMovieData(data) && data.Response === "True") {
    return data; // TypeScript knows it's OMDbMovieData here
  } else {
    console.error(`❌ Failed to fetch movie: ${imdbId}`);
    return null;
  }
}

async function seedMovies() {
  console.log("🌱 Seeding movies...");

  for (const imdbId of imdbIds) {
    try {
      // Check if movie already exists
      const existingMovie = await prisma.movie.findUnique({
        where: { imdbId },
      });

      if (existingMovie) {
        console.log(`✅ Movie already exists: ${existingMovie.title}`);
        continue;
      }

      // Fetch movie data from OMDb API
      const movieData = await fetchMovieData(imdbId);

      if (movieData) {
        // Insert into the database
        await prisma.movie.create({
          data: {
            imdbId: imdbId,
            title: movieData.Title,
            description: movieData.Plot,
            releaseYear: parseInt(movieData.Year),
            genre: movieData.Genre.split(", ").map((g: string) => g.trim()),
            director: movieData.Director,
            poster: movieData.Poster,
            rating: parseFloat(movieData.imdbRating) || null,
          },
        });

        console.log(`🎬 Added movie: ${movieData.Title}`);
      }
    } catch (error) {
      console.error(`❌ Error seeding movie ${imdbId}:`, error);
    }
  }

  console.log("✅ Seeding completed!");
  await prisma.$disconnect();
}

seedMovies();
