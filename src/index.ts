import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movie.Routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOptions));
// app.use(morgan("dev"));

app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
