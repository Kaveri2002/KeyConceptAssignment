var mongoose = require('mongoose');
var TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 255
    },
    status: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    startTimestamp: {
        type: Date,
        required: true
    }, 
    endTimestamp: {
        type: Date,
        required: true
    }
});
module.exports = mongoose.model('task', TaskSchema);