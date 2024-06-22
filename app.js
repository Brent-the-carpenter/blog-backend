import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import debug from "debug";
import createError from "http-errors";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";

const Secret = import.meta.env.SECRET;
const MONGO_URI = import.meta.env.MONGO_URI;

const limit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many request from this IP Address please try again in an hour.",
});
//connect to db
async function main() {
  await mongoose.connect(MONGO_URI);
}
main().catch((err) => console.log(`Could not connect to mongodb ${err}`));

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(limit);
app.use(function (req, res, next) {
  next(createError(404));
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
export default app;
