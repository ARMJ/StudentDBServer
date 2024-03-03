const express = require("express");
const adminRouter = express.Router();
const {signatureUploader, pictureUploader, fingerprintsUploader, uploaderFS} = require('../helper/fileUploader');

const { dashboard, getAllStudents, searchStudents, studentById, addFingerprints, addPicture, addSignature, getAdmins, addAdmin, deleteAdmin, uploadPictureFS, uploadSignatureFS, uploadFingerprintsFS } = require("../controllers/admin");
const checkIsAuthenticated = require('../middleware/auth');
const checkRoles = require('../middleware/role');


adminRouter.route("/dashboard").get([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], dashboard);
adminRouter.route("/students").get([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], getAllStudents);
adminRouter.route("/searchStudents").get([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], searchStudents);
adminRouter.route("/studentById").get([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], studentById);
adminRouter.route("/upload-picture-fs").post([checkIsAuthenticated, checkRoles(['superAdmin', 'admin', 'student'])], uploaderFS.single('picture'), uploadPictureFS);
adminRouter.route("/upload-signature-fs").post([checkIsAuthenticated, checkRoles(['superAdmin', 'admin', 'student'])], uploaderFS.single('signature'), uploadSignatureFS);
adminRouter.route("/upload-fingerprints-fs").post([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], uploaderFS.array('fingerprints', 2), uploadFingerprintsFS);
adminRouter.route("/upload-picture").post([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], pictureUploader.single('picture'), addPicture);
adminRouter.route("/upload-signature").post([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], signatureUploader.single('signature'), addSignature);
adminRouter.route("/upload-fingerprints").post([checkIsAuthenticated, checkRoles(['superAdmin', 'admin'])], fingerprintsUploader.array('fingerprints', 2), addFingerprints);

adminRouter.route("/getAdmins").get([checkIsAuthenticated, checkRoles(['superAdmin'])], getAdmins);
adminRouter.route("/addAdmin").post([checkIsAuthenticated, checkRoles(['superAdmin'])], addAdmin);
adminRouter.route("/deleteAdmin").post([checkIsAuthenticated, checkRoles(['superAdmin'])], deleteAdmin);


module.exports = adminRouter;