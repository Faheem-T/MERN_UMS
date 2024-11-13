import Express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";

const app = Express();
const PORT = 3000;

app.use(Express.json());
app.use(logger("dev"));
app.use(cors());

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://localhost/UMS")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log("Couldn't connect to MongoDB", err);
  });

// app.use();
app.get("/api/users", (req, res, next) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

const users = [
  { id: 1, name: "rifan" },
  { id: 2, name: "thahir" },
];
