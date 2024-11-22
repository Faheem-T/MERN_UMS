import Express, { Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRouter";
import * as dotenv from "dotenv";
import { verifyAccessTokenMiddleware } from "./middlewares/verifyAccessTokenMiddleware";
import { pfpRouter } from "./routes/pfpRouter";
dotenv.config();

const app = Express();
const PORT = 3000;

app.use(Express.json());
app.use(logger("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://localhost/UMS")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log("Couldn't connect to MongoDB", err);
  });

app.use("/api/auth", authRouter);
app.use("/api/pfp", pfpRouter);

const handle_protected_get = (req: Request, res: Response) => {
  console.log("hi");
  res.json({ message: "you are verified!!" });
};
app.use("/protected", verifyAccessTokenMiddleware, handle_protected_get);

// app.use((req, res, next, err,) => {})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
