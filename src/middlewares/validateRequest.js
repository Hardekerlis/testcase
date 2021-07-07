// const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  // const { errors } = validationResult(req);

  // console.log(errors);

  next();

  if(!errors.isEmpty()) {
    // res.status(400).json(errors);
    // throw new Error("asdsa");
  }

  next();
}

exports.module = {validateRequest};
