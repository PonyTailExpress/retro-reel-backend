import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing application/json
app.use("/api/movies", movieRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
