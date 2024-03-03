const JUSTStudent = require('../models/JUSTStudent');
const minio = require('minio');

const bucket = 'student-pictures';
const minioClient = new minio.Client({
  endPoint: '10.23.222.194',
  port: 9000,
  useSSL: false,
  accessKey: 'lv6JwyEShBwYs8IHyQuU',
  secretKey: 'MIdqCsVX9GEpUBN1RUpqCQ6jwE5itwoMazxK9HvR'
});

const profile = async (req, res) => {
  const student = await JUSTStudent.findOne({ _id: req.user.id });
  if (student.picture) {
    let pictureUrl = await await minioClient.presignedGetObject(bucket, student.picture, 24 * 60 * 60);
    student.picture = pictureUrl;
  }

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    student: student,
  });
};

const studentDetails = async (req, res) => {
  const student = await JUSTStudent.findOne({ _id: req.user.id }).populate('files');

  if (student.picture) {
    let pictureUrl = await await minioClient.presignedGetObject(bucket, student.picture, 24 * 60 * 60);
    student.picture = pictureUrl;
  }

  res.status(200).json({
    msg: 'Student Details',
    student: student,
  });
}




module.exports = {
  profile,
  studentDetails
};
