import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movie.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Ensure cookies and auth headers are allowed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
