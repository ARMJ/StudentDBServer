const JUSTStudent = require('../models/JUSTStudent');
const minioClient = require('../helper/minio');

const profile = async (req, res) => {
  const student = await JUSTStudent.findOne({ _id: req.user.id }, { password: 0}).populate('files');
  if (student.picture) {
    let pictureUrl = await minioClient.presignedGetObject('student-pictures', student.picture, 60 * 60);
    student.picture = pictureUrl;
  }
  if(student.files){
    if(student.files.signature !== ""){
      let signatureUrl = await minioClient.presignedGetObject('student-signatures', student.files.signature, 60 * 60);
      student.files.signature = signatureUrl;
    }
  }
  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    student: student,
  });
};

const studentDetails = async (req, res) => {
  const student = await JUSTStudent.findOne({ _id: req.user.id }, { password: 0}).populate('files');

  if (student.picture) {
    let pictureUrl = await minioClient.presignedGetObject('student-pictures', student.picture, 60 * 60);
    student.picture = pictureUrl;
  }
  if(student.files){
    if(student.files.signature !== ""){
      let signatureUrl = await minioClient.presignedGetObject('student-signatures', student.files.signature, 60 * 60);
      student.files.signature = signatureUrl;
    }
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
