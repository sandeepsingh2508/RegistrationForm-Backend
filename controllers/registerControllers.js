const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const User = require("../models/userSchema");

//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  const user = await User.create({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
  });

  sendToken(user, 201, res);
});

