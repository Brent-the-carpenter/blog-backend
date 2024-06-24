import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import debug from "debug";
import createError from "http-errors";
import helmet from "helmet";
import cors from "cors";
import { post, auth, user } from "./routes/index.js";
import passport from "./config/PassportConfig.js";

const debugApp = debug("App:");
debugApp.color = debug.colors[3];
const Secret = process.env.SECRET;
const MONGO_URI = process.env.MONGO_URI;

const limit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many request from this IP Address please try again in an hour.",
});
//connect to db
async function main() {
  debugApp("Connecting to MongoDB");
  await mongoose.connect(MONGO_URI);
}
main().catch((err) => console.log(`Could not connect to mongodb ${err}`));

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(limit);
//Initialize passport config and use it in app

app.use(passport.initialize());

app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", post);
app.use("/api/v1/users", user);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    },
  });
});
export default app;
