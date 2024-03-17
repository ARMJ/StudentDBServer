const JUSTStudent = require('../models/JUSTStudent');
const bucket = 'student-pictures';
const minioClient = require('../helper/minio');

const profile = async (req, res) => {
  const student = await JUSTStudent.findOne({ _id: req.user.id }, { password: 0});
  if (student.picture) {
    let pictureUrl = await await minioClient.presignedGetObject(bucket, student.picture, 60 * 60);
    student.picture = pictureUrl;
  }

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    student: student,
  });
};

const studentDetails = async (req, res) => {
  const student = await JUSTStudent.findOne({ _id: req.user.id }, { password: 0}).populate('files');

  if (student.picture) {
    let pictureUrl = await await minioClient.presignedGetObject(bucket, student.picture, 60 * 60);
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
