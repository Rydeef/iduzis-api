const bcrypt = require("bcryptjs");
const {
  validationResult
} = require("express-validator");
const User = require("../models/User");
const service = require("../services/auth");
const jwt = require("jsonwebtoken");


require("dotenv").config();

module.exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid registation fields",
      });
    }

    const {
      username,
      email,
      password,
      confirmPassword
    } = req.body;

    const candidateEmail = await User.findOne({
      email: email
    });
    const candidateUsername = await User.findOne({
      email: email
    });

    if (candidateEmail) {
      return res
        .status(209)
        .json({
          message: "User with this email already exists"
        });
    }
    if (candidateUsername) {
      return res
        .status(209)
        .json({
          message: "User with this name already exists"
        });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({
        message: "Password mismatch"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      username: username,
      email,
      password: hashedPassword,
    };
    const user = new User(userObj);

    await user.save();

    res.status(201).json({
      message: "User created",
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;
    const user = await User.findOne({
      username: username
    });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist"
      });
    }

    const passIsMatch = await bcrypt.compare(password, user.password);

    if (!passIsMatch) {
      return res.status(400).json({
        message: "Invalid password, try again"
      });
    }

    const token = service.generateAccessToken({
      username
    });

    res.status(200).json({
      token: "Bearer " + token,
      username
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};