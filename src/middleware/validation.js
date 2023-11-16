
const dataMethods = ["body", "params", "headers", "query", "file"];
export const validation = (joiSchema) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (joiSchema[key]) {
        //validator body and  validate Schema body
        //const validationResult= joiSchema.validate(req.body,{abortEarly:false})
        const validationResult = joiSchema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error.details);
        }
        if (validationResult.length > 0) {
          return res.json({ Message: "validation Error", validationErr });
        }
      }
    });
    return next();
  };
};


