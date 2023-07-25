const CatchAsyncErrors = require("../utils/CatchAsyncErrors");
const ErrorHandle = require("../utils/ErrorHandle");
const { decryptData } = require("../utils/decryptData");
const { encryptData } = require("../utils/encryptData");
const moment = require('moment')

const ObjectId = require('mongodb').ObjectId


exports.newTask = CatchAsyncErrors(async (req, res, next) => {
    let { email, task_heading, task_status, task_details, start_date, end_date } = req.body;
    email = decryptData(email);
    task_heading = decryptData(task_heading);
    task_status = decryptData(task_status);
    task_details = decryptData(task_details);

    start_date = moment(start_date).format("MMM D YYYY HH:mm:ss")
    console.log("start_date", start_date);
    end_date = moment(end_date).format("MMM D YYYY HH:mm:ss")
    let taskData = {
        email,
        task_heading,
        task_status,
        task_details,
        start_date,
        end_date
    }

    let insertedResponse = await myDB.collection("tasks").insertOne(taskData);
    if (insertedResponse) {
        return res.status(200).send({
            success: true,
            insertedResponse
        })
    } else {
        return next(new ErrorHandle("Internal error", 500));
    }

})

exports.getUserTasks = CatchAsyncErrors(async (req, res, next) => {
    let { email } = req.body;
    email = decryptData(email);

    let query = {
        email
    }

    let allTasks = await myDB.collection("tasks").find(query).toArray();
    return res.status(200).send({
        success: true,
        allTasks
    })
})

exports.deleteTask = CatchAsyncErrors(async (req, res, next) => {
    let { _id } = req.body;

    let query = {
        _id: new ObjectId(_id)
    }

    await myDB.collection("tasks").deleteOne(query)
    return res.status(200).send({
        success: true
    })
})


// deleteTask