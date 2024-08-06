require("dotenv").config();
const env = process.env;
const express = require("express");
const app = express();
const port = env.PORT;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
