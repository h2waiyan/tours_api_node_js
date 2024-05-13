const myLogger = (req, res, next) => {
  console.log("Hello From Server 👋");
  next();
};

module.exports = myLogger;
