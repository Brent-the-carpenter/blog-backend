import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import debug from "debug";
import passport from "passport";

const debugAuth = debug("Auth:");

const signUp = [
  body("first_name", "first name is required")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long."),
  body("last_name", "last name is required")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  body("user_name", "User name is required")
    .trim()
    .escape()
    .isLength({ min: 4 })
    .withMessage("User name must be at least 4 characters long"),
  body("password", "Password is a required field.")
    .trim()

    .isLength({ min: 12 })
    .withMessage("Password must be 12 characters long")
    .isStrongPassword()
    .withMessage(
      "Password must be 12 characters long and must contain at least 1 uppercase letter, one symbol,1 number  "
    ),
  body("confirm_password").custom(isSamePass),
  asyncHandler(async (req, res, next) => {
    debugAuth(req.body);
    const { first_name, last_name, user_name, password } = req.body;
    const errors = validationResult(req);
    // check for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        first_name: first_name,
        last_name: last_name,
        user_name: user_name,
        password: hashPassword,
        auth_token: null,
        comments: [],
        role: "user",
      });
      const newUser = await user.save();
      const payload = {
        _id: newUser._id,
        user_name: newUser.user_name,
        role: newUser.role,
      };
      const newToken = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "2 days",
      });
      newUser.auth_token = newToken;
      await newUser.save();
      return res
        .status(200)
        .json({ token: newToken, message: "User created successfully!" });
    } catch (error) {
      debugAuth("Error creating user", error);
      return next(error);
    }
  }),
];

const login = [
  body("user_name", "User name is required.").trim().escape(),
  body("password", "Password is required").trim(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ user_name: req.body.user_name }).exec();
      if (!user) {
        return res.status(404).json({
          errors: [
            {
              message: "User not found.",
            },
          ],
        });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ message: "Invalid password." }],
        });
      }
      const payload = {
        _id: user._id,
        user_name: user.user_name,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "2 days",
      });
      user.auth_token = token;
      await user.save();
      res.status(200).json({
        message: " Login successful.",
        token: token,
      });
    } catch (error) {
      debugAuth("Error with user login", error);
      next(err);
    }
  }),
];

const logout = asyncHandler(async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const deserializedToken = jwt.verify(bearerToken, process.env.SECRET_KEY);
    await User.findByIdAndUpdate(deserializedToken._id, { auth_token: null });
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    debugAuth("Error in logout method", error);
    next(error);
  }
});

function isSamePass(value, { req }) {
  if (value === req.body.password) return true;
  else {
    throw new Error("Passwords do not match.");
  }
}
export { signUp, login, logout };
