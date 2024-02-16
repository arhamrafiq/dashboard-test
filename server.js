import express from "express";
import authRoute from "./routes/authRoute.js";
import AgentRoute from "./routes/agentsRoutes.js";
import { connectDB } from "./config/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

dotenv.config();
connectDB();

// ES module fixing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./clients/build")));

app.use("/api/auth", authRoute);
app.use("/api/agent", AgentRoute);

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./clients/build/index.html"));
});

app.listen(8080, () => {
  console.log("server is running");
});
