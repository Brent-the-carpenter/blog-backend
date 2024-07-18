import express from "express";

import {
  signUp,
  login,
  logout,
  checkTokenExpiration,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.post("/logout", logout);
router.get("/token", checkTokenExpiration);

export default router;
