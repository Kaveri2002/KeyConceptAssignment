var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    company_name: {
        type: String,
        minlength: 5,
        maxlength: 255
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    mobile: {
        type: String,
        minlength: 5,
        maxlength: 255
    },
});
module.exports = mongoose.model('user', UserSchema);