const JUSTStudent = require("../models/JUSTStudent");
const User = require("../models/User");
const File = require('../models/File');
const logger = require('../helper/logger');
const path = require('path');
const minioClient = require('../helper/minio');

const dashboard = async (req, res) => {
  let dashboardData = [];
  let Totalstudents = await JUSTStudent.countDocuments({});
  let BMEStudents = await JUSTStudent.countDocuments({ dept: "BME" });
  let ChEStudents = await JUSTStudent.countDocuments({ dept: "ChE" });
  let CSEStudents = await JUSTStudent.countDocuments({ dept: "CSE" });
  let EEEStudents = await JUSTStudent.countDocuments({ dept: "EEE" });
  let IPEStudents = await JUSTStudent.countDocuments({ dept: "IPE" });
  let PMEStudents = await JUSTStudent.countDocuments({ dept: "PME" });
  let TEStudents = await JUSTStudent.countDocuments({ dept: "TE" });
  let APPTStudents = await JUSTStudent.countDocuments({ dept: "APPT" });
  let CDMStudents = await JUSTStudent.countDocuments({ dept: "CDM" });
  let ESTStudents = await JUSTStudent.countDocuments({ dept: "EST" });
  let NFTStudents = await JUSTStudent.countDocuments({ dept: "NFT" });
  let FMBStudents = await JUSTStudent.countDocuments({ dept: "FMB" });
  let GEBTStudents = await JUSTStudent.countDocuments({ dept: "GEBT" });
  let MBStudents = await JUSTStudent.countDocuments({ dept: "MB" });
  let PHARStudents = await JUSTStudent.countDocuments({ dept: "PHAR" });
  let CHEMStudents = await JUSTStudent.countDocuments({ dept: "CHEM" });
  let MATHStudents = await JUSTStudent.countDocuments({ dept: "MATH" });
  let PHYStudents = await JUSTStudent.countDocuments({ dept: "PHY" });
  let NHSStudents = await JUSTStudent.countDocuments({ dept: "NHS" });
  let PESSStudents = await JUSTStudent.countDocuments({ dept: "PESS" });
  let PTRStudents = await JUSTStudent.countDocuments({ dept: "PTR" });
  let ENGLStudents = await JUSTStudent.countDocuments({ dept: "ENGL" });
  let AISStudents = await JUSTStudent.countDocuments({ dept: "AIS" });
  let MGTStudents = await JUSTStudent.countDocuments({ dept: "MGT" });
  let MKTStudents = await JUSTStudent.countDocuments({ dept: "MKT" });
  let FBStudents = await JUSTStudent.countDocuments({ dept: "FB" });
  let DVMStudents = await JUSTStudent.countDocuments({ dept: "DVM" });

  dashboardData.push({ dept: "Biomedical Engineering", count: BMEStudents });
  dashboardData.push({ dept: "Chemical Engineering", count: ChEStudents });
  dashboardData.push({ dept: "Computer Science and Engineering", count: CSEStudents });
  dashboardData.push({ dept: "Electrical and Electronic Engineering", count: EEEStudents });
  dashboardData.push({ dept: "Industrial and Production Engineering", count: IPEStudents });
  dashboardData.push({ dept: "Petroleum and Mining Engineering", count: PMEStudents });
  dashboardData.push({ dept: "Textile Engineering", count: TEStudents });
  dashboardData.push({ dept: "Agro Product Processing Technology", count: APPTStudents });
  dashboardData.push({ dept: "Climate and Disaster Management", count: CDMStudents });
  dashboardData.push({ dept: "Environmental Science and Technology", count: ESTStudents });
  dashboardData.push({ dept: "Nutrition and Food Technology", count: NFTStudents });
  dashboardData.push({ dept: "Fisheries and Marine Bioscience", count: FMBStudents });
  dashboardData.push({ dept: "Genetic Engineering and Biotechnology", count: GEBTStudents });
  dashboardData.push({ dept: "Microbiology", count: MBStudents });
  dashboardData.push({ dept: "Pharmacy", count: PHARStudents });
  dashboardData.push({ dept: "Chemistry", count: CHEMStudents });
  dashboardData.push({ dept: "Mathematics", count: MATHStudents });
  dashboardData.push({ dept: "Physics", count: PHYStudents });
  dashboardData.push({ dept: "Nursing and Health Science", count: NHSStudents });
  dashboardData.push({ dept: "Physical Education and Sports Science", count: PESSStudents });
  dashboardData.push({ dept: "Physiotherapy and Rehabilitation", count: PTRStudents });
  dashboardData.push({ dept: "English", count: ENGLStudents });
  dashboardData.push({ dept: "Accounting and Information Systems", count: AISStudents });
  dashboardData.push({ dept: "Finance and Banking", count: FBStudents });
  dashboardData.push({ dept: "Management", count: MGTStudents });
  dashboardData.push({ dept: "Marketing", count: MKTStudents });
  dashboardData.push({ dept: "Veterinary Medicine", count: DVMStudents });

  res.status(200).json({
    msg: "Dashboard information",
    dashboardData,
    Totalstudents
  });
};

const addFingerprints = async (req, res) => {
  let student = await JUSTStudent.findOne({ _id: req.headers.stdid }).populate('files');

  if (student.files) {
    if (req.files[0].originalname.includes('index')) {
      student.files.indexFinger = req.files[0].path;
      student.files.thumbFinger = req.files[1].path;
    } else {
      student.files.thumbFinger = req.files[0].path;
      student.files.indexFinger = req.files[1].path;
    }
    student.files.updatedAt = Date.now();
    await student.files.save();
    logger.info(`${req.user.name} added fingerprints for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
    return res.status(200).json({ msg: "Fingerprints Uploaded Successfully.", student });
  } else {
    const new_file = new File({});
    req.files.forEach((fingerprint) => {
      if (fingerprint.originalname.includes('index')) {
        new_file.indexFinger = fingerprint.path;
      } else {
        new_file.thumbFinger = fingerprint.path;
      }
    });
    new_file.updatedAt = Date.now();
    await new_file.save();
    student.files = new_file.id;
    await student.save();
    logger.info(`${req.user.name} added fingerprints for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);

    return res.status(201).json({ msg: "Fingerprints Uploaded Successfully.", student });
  }
}

const uploadFingerprintsFS = async (req, res) => {
  const bucket = 'student-fingerprints';
  let student;
  req.files.forEach(file => {
    let fileName = req.headers.stdid + '_' + file.originalname;
    minioClient.putObject(bucket, fileName, file.buffer, async (err, etag) => {
      if (err) {
        logger.error(`Error: ${err.message} Error in fingerprint upload by ${req.user.name} for user ${req.headers.stdid}.`);
        return res.status(500).json({ msg: "Error in fingerprint upload" });
      } else {
        student = await JUSTStudent.findOne({ _id: req.headers.stdid }).populate('files');
        if (student.files) {
          try {
            if (fileName.includes('index')) {
              student.files.indexFinger = fileName;
            } else {
              student.files.thumbFinger = fileName;
            }
            student.files.updatedAt = Date.now();
            await student.files.save();
            logger.info(`${req.user.name} added fingerprints for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);

          } catch (err) {
            logger.error(`Error: ${err.message} Error in fingerprint upload by ${req.user.name} for user ${req.headers.stdid}.`);
            return res.status(500).json({ msg: "Error in fingerprint upload" });
          }
        } else {
          try {
            const new_file = new File({});
            if (fileName.includes('index')) {
              student.files.indexFinger = fileName;
            } else {
              student.files.thumbFinger = fileName;
            }
            new_file.updatedAt = Date.now();
            await new_file.save();
            student.files = new_file.id;
            await student.save();
            logger.info(`${req.user.name} added fingerprints for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
          } catch (err) {
            logger.error(`Error: ${err.message} Error in fingerprint upload by ${req.user.name} for user ${req.headers.stdid}.`);
            return res.status(500).json({ msg: "Error in fingerprint upload" });
          }
        }
      }
    });
  });
  return res.status(201).json({ msg: "Fingerprints Uploaded Successfully.", student });
}

const addSignature = async (req, res) => {
  let student = await JUSTStudent.findOne({ _id: req.headers.stdid }).populate('files');
  if (student.files) {
    student.files.signature = req.file.path;
    student.files.updatedAt = Date.now();
    await student.files.save();
    logger.info(`${req.user.name} added signature for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
    return res.status(200).json({ msg: "Signature Uploaded Successfully.", student });
  } else {
    let new_file = new File({
      signature: req.file.path
    });
    new_file.updatedAt = Date.now();
    await new_file.save();
    student.files = new_file._id;
    await student.save();
    logger.info(`${req.user.name} added signature for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
    return res.status(201).json({ msg: "Signature Uploaded Successfully.", student });
  }
}

const uploadSignatureFS = async (req, res) => {

  const fileName = req.headers.stdid + path.extname(req.file.originalname);
  const file = req.file.buffer;
  const bucket = 'student-signatures';
  let student = await JUSTStudent.findOne({ _id: req.headers.stdid });
  minioClient.putObject(bucket, fileName, file, { 'Content-Type': req.file.mimetype }, async (err, etag) => {
    if (err) {
      logger.error(`Error: ${err.message} Error in signature upload by ${req.user.name} for user ${req.headers.stdid}.`);
      return res.status(500).json({ msg: "Error in signature upload" });
    } else {
      if (student.files) {
        try {
          student.files.signature = fileName;
          student.files.updatedAt = Date.now();
          await student.files.save();
          logger.info(`${req.user.name} added signature for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
          return res.status(200).json({ msg: "Signature Uploaded Successfully.", student });
        } catch (err) {
          logger.error(`Error: ${err.message} Error in signature upload by ${req.user.name} for user ${req.headers.stdid}.`);
          return res.status(500).json({ msg: "Error in signature upload." });
        }
      } else {
        try {
          let new_file = new File({
            signature: fileName
          });
          new_file.updatedAt = Date.now();
          await new_file.save();
          student.files = new_file._id;
          await student.save();
          logger.info(`${req.user.name} added signature for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
          return res.status(201).json({ msg: "Signature Uploaded Successfully.", student });
        } catch (err) {
          logger.error(`Error: ${err.message} Error in signature upload by ${req.user.name} for user ${req.headers.stdid}.`);
          return res.status(500).json({ msg: "Error in signature upload." });
        }
      }
    }
  });


}

const addPicture = async (req, res) => {

  let student = await JUSTStudent.findOne({ _id: req.headers.stdid });
  if (student) {
    student.picture = "assests/img/profile/" + req.file.filename;
    student.save();
    logger.info(`${req.user.name} added picture for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
    return res.status(200).json({ msg: "Picture Uploaded Successfully.", student });
  } else {
    return res.status(400).json({ msg: "No Student Found." });
  }
}

const uploadPictureFS = async (req, res) => {

  const fileName = req.headers.stdid + path.extname(req.file.originalname);
  const file = req.file.buffer;
  const bucket = 'student-pictures';
  minioClient.putObject(bucket, fileName, file, { 'Content-Type': req.file.mimetype }, async (err, etag) => {
    if (err) {
      logger.error(`Error: ${err.message} Error in picture upload by ${req.user.name} for user ${req.headers.stdid}.`);
      return res.status(500).json({ msg: "Error in picture upload" });
    } else {
      let student = await JUSTStudent.findOne({ _id: req.headers.stdid });
      if (student) {
        student.picture = fileName;
        student.save();
        logger.info(`${req.user.name} added picture for user ${student.name}, roll: ${student.roll}, dept: ${student.dept}, session: ${student.admissionSession}.`);
        return res.status(200).json({ msg: "Picture Uploaded Successfully.", student });
      } else {
        return res.status(400).json({ msg: "No Student Found." });
      }
    }
  });


}

const studentById = async (req, res) => {
  let student = await JUSTStudent.findOne({ _id: req.query.id }, { password: 0}).populate('files');
  const bucket = 'student-pictures';
  if (student.picture) {
    let pictureUrl = await minioClient.presignedGetObject(bucket, student.picture, 60 * 60);
    student.picture = pictureUrl;
  }
  return res.status(200).json({ msg: "The student information is loaded", student });
}

const searchStudents = async (req, res) => {
  let students = await JUSTStudent.find({ dept: req.query.dept, admissionSession: req.query.session }, { password: 0});
  return res.status(200).json({ msg: "All students of " + req.query.dept + " from session " + req.query.session, students });
}

const getAllStudents = async (req, res) => {
  let students = await JUSTStudent.find({});
  return res.status(200).json({ msg: "All students", students });
};

const getAdmins = async (req, res) => {
  let admins = await User.find({ role: 'admin', isDeleted: false }, { password: 0});
  return res.status(200).json({ msg: "All Admins", admins });
}

const addAdmin = async (req, res) => {
  let foundAdmin = await User.findOne({ email: req.body.email });
  if (foundAdmin === null) {
    let { username, email, password } = req.body;
    if (username.length && email.length && password.length) {
      const admin = new User({
        name: username,
        email: email,
        password: password,
      });
      await admin.save();
      return res.status(201).json({ msg: "Admin Created Successfully.", admin });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
}

const deleteAdmin = async (req, res) => {
  try {
    let admin = await User.findOne({ _id: req.body.id });
    admin.isDeleted = true;
    admin.save();
    logger.info("Super Admin deleted the admin named " + admin.name);
    return res.status(200).json({ msg: "Admin deleted" });
  } catch (error) {
    return res.status(500).json(error);
  }
}


module.exports = {
  dashboard,
  getAllStudents,
  searchStudents,
  studentById,
  addFingerprints,
  uploadFingerprintsFS,
  addPicture,
  uploadPictureFS,
  addSignature,
  uploadSignatureFS,
  getAdmins,
  addAdmin,
  deleteAdmin
};
