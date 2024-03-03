const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    indexFinger: {
        type: String,
        default: "",
    },
    thumbFinger: {
        type: String,
        default: "",
    },
    signature: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("File", FileSchema);