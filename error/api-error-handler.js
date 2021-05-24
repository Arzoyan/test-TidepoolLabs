const ApiError = require("./ApiError");

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    next();
    res.status(err.code).json(err.message);
    return;
  }

  res.status(500).json("server has failed ");
}

module.exports = apiErrorHandler;
