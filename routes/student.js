const express = require("express");
const studentRouter = express.Router();

const { profile, studentDetails } = require("../controllers/student");
const authMiddleware = require('../middleware/auth');
const checkRoles = require('../middleware/role');


studentRouter.route("/profile").get([authMiddleware, checkRoles(['student'])], profile);
studentRouter.route("/studentDetails").get([authMiddleware, checkRoles(['student'])], studentDetails);


module.exports = studentRouter;