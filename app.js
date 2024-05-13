const express = require("express");
const tourRouter = require("./routers/tourRoute");
const userRouter = require("./routers/userRoute");
const logger = require("./middlewares/logger");
const reqtime = require("./middlewares/reqTime");

const AppError = require("./utils/apperror");
const GlobalErrorHandler = require("./controllers/errorCtrl");

const app = express();

// console.log(app.get("env")); // express env
// node env
console.log(process.env.NODE_ENV);

app.use(express.json()); // write head POST > ContentType: application/json
app.use(logger);
app.use(reqtime);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from server",
  });
});
// Mounting the Router
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// HANDLE unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server.`,
  // });
});

app.use(GlobalErrorHandler);

module.exports = app;
