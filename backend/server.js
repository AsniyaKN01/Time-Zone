const express = require("express");
const cors = require("cors");
const timezoneRoutes = require("./routes/timezoneRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Allow configured frontend origins (comma-separated), useful for public deploys.
const frontendOrigins = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients/tools and same-origin requests.
      if (!origin) return callback(null, true);
      if (frontendOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked for this origin"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/timezones", timezoneRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
  console.log(`CORS allowed origins: ${frontendOrigins.join(", ")}`);
});
