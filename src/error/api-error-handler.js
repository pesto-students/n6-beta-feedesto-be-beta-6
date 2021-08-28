
function apiErrorHandler(err, req, res, next) {
  // in prod, don't use console.error
  // because it is not async
  console.error(err);

  if (err instanceof Error && err.status) {
    return res.status(err.status).json(err.message);
  }
  return res.status(500).json(new Error("Something Went Wrong"));
}

module.exports = apiErrorHandler;
