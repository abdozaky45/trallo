export const asynchandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next (new Error(error))
    });
  };
};
export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 400).json({ message: "failure error",  error: error.message, error, stack: error.stack });
};
