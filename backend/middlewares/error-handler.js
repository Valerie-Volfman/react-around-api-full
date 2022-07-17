const ErrorHandler = (err, res) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Invalid data' });
  }
  if (err.name === 'Unauthorized') {
    res.status(401).send({ message: 'Authorization Required' });
  }
  if (err.name === 'MongoServerError') {
    res
      .status(409)
      .send({
        message: 'Request is conflicting with an already existing registration',
      });
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
};
module.exports = ErrorHandler;
