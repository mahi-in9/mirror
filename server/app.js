const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const questionRoutes = require("./routes/questions");
const responseRoutes = require("./routes/responses");
const reportRoutes = require("./routes/reports");
const shareRoutes = require("./routes/share");

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/share-card", shareRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", app: "Mirror" }));

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

module.exports = app;
