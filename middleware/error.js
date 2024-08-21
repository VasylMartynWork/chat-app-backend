/**
 * @type {import('express').ErrorRequestHandler}
 */
const errorHandler = async (error, req, res, _) => {
  console.error(error);
  return res.sendStatus(500);
};

module.exports.errorHandler = errorHandler;
