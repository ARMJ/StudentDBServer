const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require('../models/JUSTStudent');
const minio = require('minio');

const bucket = 'student-pictures';
const minioClient = new minio.Client({
  endPoint: '10.23.222.194',
  port: 9000,
  useSSL: false,
  accessKey: 'lv6JwyEShBwYs8IHyQuU',
  secretKey: 'MIdqCsVX9GEpUBN1RUpqCQ6jwE5itwoMazxK9HvR'
});


const login = async (req, res) => {
  const { roll, password, remember } = req.body;

  if (!roll || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add roll and password in the request body",
    });
  }

  let foundStudent = await Student.findOne({ roll: req.body.roll });
  if (foundStudent) {
    let pictureUrl = "../../assets/img/theme/images.png";
    const isMatch = await foundStudent.comparePassword(password);
    if(foundStudent.picture){
      pictureUrl = await minioClient.presignedGetObject(bucket, foundStudent.picture, 24 * 60 * 60);
    }
    let validity = "1d";
    let redirectPath = "/student";
    if (remember) validity = "1y";
    if (isMatch) {
      const token = jwt.sign(
        { id: foundStudent._id, name: foundStudent.name, role: 'student' },
        process.env.JWT_SECRET,
        {
          expiresIn: validity,
        }
      );
      return res.status(200).json({ msg: "student logged in", token, navigate: redirectPath, name: foundStudent.name, role: 'student', pictureUrl });
    } else {
      return res.status(400).json({ msg: "Bad credentails" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);
    let validity = "1d";
    let redirectPath = "/user";
    if (remember) validity = "1y";
    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name, role: foundUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: validity,
        }
      );
      if (foundUser.role === "superAdmin") {
        redirectPath = "/superAdmin";
      } else if (foundUser.role === "admin") {
        redirectPath = "/admin";
      }
      return res.status(200).json({ msg: "user logged in", token, navigate: redirectPath, name: foundUser.name, role: foundUser.role });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const register = async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser === null) {
    let { username, email, password } = req.body;
    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
      });
      await person.save();
      return res.status(201).json({ msg: "User Created Successfully.", person });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};

module.exports = {
  login,
  adminLogin,
  register,
};