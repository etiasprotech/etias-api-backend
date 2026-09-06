require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// ===============================
// SECURITY
// ===============================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false // turn off CSP so your html/css/js can load
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"]
  })
);

// ===============================
// BODY PARSER
// ===============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
// RATE LIMIT
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: "Too many requests" }
});
app.use(limiter);

// ===============================
// SERVE FRONTEND STATIC FILES
// ===============================
// This will serve everything in /frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

// Serve payment proof files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// DATABASE
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
  });

// ===============================
// API ROUTES
// ===============================
app.use("/users", require("./routes/users"));
app.use("/payments", require("./routes/payments"));
app.use("/admin", require("./routes/admin"));
app.use("/movies", require("./routes/movies"));
app.use("/ai", require("./routes/ai"));
app.use("/subscription", require("./routes/subscription"));

// ===============================
// HEALTH CHECK
// ===============================
app.get("/api", (req, res) => {
  res.json({
    name: "ETIAS API HUB",
    status: "online",
    version: "1.0.0",
    time: new Date()
  });
});

// ===============================
// SERVE INDEX.HTML FOR ALL OTHER ROUTES
// SPA fallback - so /dashboard /upgrade still load
// ===============================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ===============================
// START
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ETIAS API HUB running on port ${PORT}`);
});
