module.exports = (req, res, next) => {
  // req => req.header, params, body
  req.requestTime = new Date().toISOString();
  next();
};
