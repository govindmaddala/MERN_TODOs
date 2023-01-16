const Task = require('./TaskSchema');
const CatchAsyncErrors = require('../utils/CatchAsyncErrors');

const createNewTask = CatchAsyncErrors(async (req, res, next) => {
    const createdTask = await Task.create(req.body);
    const allTasks = await Task.find({userID:req.body.userID});
    return res.status(200).json({
        success:true,
        message: allTasks
    })
})

const getTodayAllTasks = CatchAsyncErrors(async(req, res, next) => {
    const allTasks = await Task.find({...req.body,taskDate: new Date().toLocaleDateString().toString() });
    res.status(200).json({
        success:true,
        message: allTasks
    })
})

const getAllTasksByDate = CatchAsyncErrors( async (req, res, next) => {
    const datedTasks = await Task.find(req.query);
    res.status(200).json({
        msg: datedTasks
    })
})

const updateTaskStatus =  CatchAsyncErrors(async (req, res, next) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        msg: updatedTask
    });
})

module.exports = {createNewTask,getTodayAllTasks,getAllTasksByDate,updateTaskStatus}