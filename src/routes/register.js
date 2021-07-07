const { Router } = require("express");
const registerRouter = Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const {validateRequest} = require("../middlewares/validateRequest");

registerRouter.post("/register",
[
  body("email")
    .isEmail()
    .withMessage("Must supply a valid email"),
  body("password")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be between 5 and 20 characters")
],
validateRequest,
async (req, res) => {
  // This should be a middleware
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).json(errors.errors);
    return;
  }

  const { email, password } = req.body;

  // Check if a user with the same email already exists
  const existingUser = await User.findOne({ email });
  if(existingUser) {
    res.status(400).json({
      msg: "A user with that email already exists"
    })

    return;
  }

  console.log(password);

  const user = User.build({ email, password });
  user.save();

  res.status(201).json(user);

});

module.exports = registerRouter;
