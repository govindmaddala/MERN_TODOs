const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    taskDate:{
        type:String,
        default: new Date().toLocaleDateString().toString()
    },
    taskHeading:{
        type:String,
        required: true
    },
    taskDetails:{
        type:String
    },
    status:{
        type:String,
        default:"in-progress"
    },
    userID:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    }
});

module.exports = mongoose.model("todotask",taskSchema);