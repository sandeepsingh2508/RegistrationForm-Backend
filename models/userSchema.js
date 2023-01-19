const mongoose = require("mongoose");
const validator = require("validator");
const Joi = require('joi');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your name"],
    validate: {
      validator: (val) => validator.isAlpha(val, ["en-US"]),
      message: "Please use only characters from a-z",
    },
  },
  lastName: {
    type: String,
    required: [true, "Please enter your name"],
    validate: {
      validator: (val) => validator.isAlpha(val, ["en-US"]),
      message: "Please use only characters from a-z",
    },
  },
  phoneNumber: {
    type: Number,
    required: [true, "please enter phone number"],
    validate: {
      validator: function (num) {
        return num.toString().length == 10;
      },
      message: "mobile number must be 10 digit",
    },
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minLength: [8, "Must be atleast 8 characters"],
    validate: {
        validator: function(str) {
          const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
          return regex.test(str);
          },
          message:"At least have a special, numeric ,Uppercase, lowercase character",
    },
    select: false,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECREAT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);
