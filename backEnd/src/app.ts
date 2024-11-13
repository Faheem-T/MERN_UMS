import Express from "express";

const app = Express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
