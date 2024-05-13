const AppError = require("../utils/apperror");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      errorStack: err.stack,
    });
  };

  const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };

  if (process.env.NODE_ENV == "development") {
    if (err.name === "MongoServerError") {
      err = new AppError(
        `${err.name}, ${err.message}. Please try again later`,
        400
      );
    }
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
      err = new AppError(
        `${err.message.toUpperCase()}. Please login again`,
        401
      );
    }
    if (err.name == "MongoServerError") {
      err = new AppError(
        `Duplicate field value: ${err.keyValue.name}. Please use another value!`,
        400
      );
    }
    if (err.name == "ValidationError") {
      err = new AppError(`Validtion Error, Please use another value!`, 400);
    }
    sendErrorProd(err, res);
  }
};
