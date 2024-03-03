const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const MD5 = require("crypto-js/md5");

const JUSTStudentSchema = new mongoose.Schema({
    roll: {
        type: Number,
        required: [true, 'Please provide roll'],
        // unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    reg: {
        type: Number,
        // required: [true, 'Please provide registration number'],
        // unique: true,
    },
    fName: {
        type: String,
        // required: [true, 'Please provide father name'],
        // minlength: 3,
        maxlength: 50
    },
    mName: {
        type: String,
        // required: [true, 'Please provide mother name'],
        // minlength: 3,
        maxlength: 50
    },
    preAddress: {
        type: String,
        // required: [true, 'Please provide present address'],
        // minlength: 10,
        maxlength: 100
    },
    perAddress: {
        type: String,
        // required: [true, 'Please provide permanent address'],
        // minlength: 10,
        maxlength: 100
    },
    dob: {
        type: String,
        // required: [true, 'Please provide date of birth'],
        // minlength: 8,
    },
    mobileNo: {
        type: String,
        // required: [true, 'Please provide mobile number'],
        // minlength: 11,
    },
    email:{
        type: String,
        // required: [true, "Please provide email"],
        // minlength: 3,
        maxlength: 50,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
    },
    admissionSession: {
        type: String,
        required: [true, 'Please provide admission session'],
        minlength: 7,
    },
    dept: {
        type: String,
        required: [true, 'Please provide department'],
        minlength: 2,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 4
    },
    lastSession: {
        type: String,
        required: [true, 'Please provide last session'],
        minlength: 7,
    },
    remarks: {
        type: String,
        maxlength: 200,
    },
    status: {
        type: Number,
    },
    picture: {
        type: String,
    },
    files: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }
});


JUSTStudentSchema.methods.comparePassword = async function(candidatePassword){
    const hashPass = MD5(candidatePassword);
    const isMatch = hashPass == this.password ? true : false;
    return isMatch;
}

module.exports = mongoose.model("JUSTStudent", JUSTStudentSchema);