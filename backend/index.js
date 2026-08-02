import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://aurix-uage.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS"));
      }
    },
    credentials: true,
  })
);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const server = app.listen(port, () => {
  connectDb();
  console.log(`Server started successfully on port ${port}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});