const multer = require('multer');
const path = require('path');

const signatureStorage = multer.diskStorage({
    destination: (req, signature, cb) => {
        cb(null, 'uploadedFiles/Signatures/')
    },
    filename: (req, signature, cb) => {
        cb(null, req.headers.stdid + '_' + signature.originalname)
    }
});

const pictureStorage = multer.diskStorage({
    destination: (req, picture, cb) => {
        cb(null, 'E:/MERN/just-student-database/src/assets/img/profile/')
    },
    filename: (req, picture, cb) => {
        cb(null, req.headers.stdid + '_' + picture.originalname)
    }
});

const fingerprintsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadedFiles/Fingerprints/')
    },
    filename: (req, file, cb) => {
        cb(null, req.headers.stdid + '_' + file.originalname)
    }
});


const signatureUploader = multer({ storage: signatureStorage });
const pictureUploader = multer({ storage: pictureStorage });
const fingerprintsUploader = multer({ storage: fingerprintsStorage});
const uploaderFS = multer();

module.exports = {
    signatureUploader,
    pictureUploader,
    fingerprintsUploader,
    uploaderFS
};