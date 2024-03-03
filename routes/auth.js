const express = require("express");
const authRouter = express.Router();

const { login, adminLogin, register } = require("../controllers/auth");

authRouter.route("/login").post(login);
authRouter.route("/adminLogin").post(adminLogin);
// authRouter.route("/register").post(register);


module.exports = authRouter;