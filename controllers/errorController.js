// const handleCastErrorDB = (err) => {
//     const msg = `I`
//     return new AppError(msg, 400)
// }

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   const msg = `duplicate field value: ${value}. Please use another value.`;
//   return new AppError(msg, 400)
// };

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const msg = `invalid input data: ${errors.join('. ')}`;
  return new Error(msg, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err.name);
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //   let error = {...err}
    // if (err.name === "CastError") {
    //     error = handleCastErrorDB(error)
    // }
    // if (error.code === 11000) {
    //     error = handleDuplicateFieldsDB(error)
    // }
    if (err.name === 'ValidatorError') {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(err, res);
  }
};
