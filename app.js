require("dotenv").config();

const env = process.env;
const express = require("express");
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const morgan = require('morgan');
const app = express();
const port = env.PORT;
const API_PREFIX = process.env.API_PREFIX
const router = require("./routes");
const AppError = require("./helpers/appError");

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.enable('trust proxy');
app.use(compression());
app.use(xss());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use(API_PREFIX, router)

// 404 Handler
app.all('*', (req, res, next) => {
  return next(
      new AppError(`${req.originalUrl} not found`, 404)
  )
})

// Error Handler
app.use((err, req, res, next) => {
  env.NODE_ENV === "development" ? console.error(err) : ""

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error"
  
  res.status(statusCode).json({
    statusCode,
    message,
    ...(env.NODE_ENV === "development" ? { ...err } : {})
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
