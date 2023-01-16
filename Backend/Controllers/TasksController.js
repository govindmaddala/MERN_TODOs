const Task = require('../Database/TasksSchema');
const CatchAsyncErrors = require('../utils/CatchAsyncErrors');
const ErrorHandle = require('../utils/ErrorHandle');

const createNewTask = CatchAsyncErrors(async (req, res, next) => {
    const { userID, usersAllTasks } = req.body;
    const [{ taskDate: payloadTaskDate, tasks: payloadTask }] = usersAllTasks;
    var userTasksPresent = await Task.find({ userID: userID });
    if (userTasksPresent.length === 0) {
        var createdTask = await Task.create(req.body)
        return res.status(200).json({
            success: true,
            message: createdTask
        })
    }else if (userTasksPresent.length !== 0) {
        const { _id, usersAllTasks } = userTasksPresent[0];
        var tasksToBeModified = usersAllTasks.filter((eachDatedTasks) => {
            const { taskDate, tasks } = eachDatedTasks;
            if (taskDate === payloadTaskDate) {
                return tasks;
            }
        });
        if (tasksToBeModified.length !== 0) {
            const [{ tasks }] = tasksToBeModified;
            tasks.unshift(payloadTask[0]);
        } else {
            const newDatedTask = {
                taskDate: payloadTaskDate,
                tasks: [
                    payloadTask[0]
                ]
            };
            usersAllTasks.push(newDatedTask);
        }
        await Task.findByIdAndUpdate(_id, { usersAllTasks }, { new: true, runValidators: true, useFindAndModify: false })
        var updatedUSER = await Task.findById(_id);
        return res.json({
            message: updatedUSER
        });
    }
});

const getTodayAllTasks = CatchAsyncErrors(async(req, res, next) => {
    const { userID } = req.body;
    var userTasksPresent = await Task.find({ userID: userID });
    if(userTasksPresent.length !== 0){
        let {usersAllTasks} = userTasksPresent[0];
        var todayTasks = usersAllTasks.filter((eachDateTasks)=>{
            let {taskDate,tasks} = eachDateTasks;
            if(taskDate === new Date().toLocaleDateString().toString()){
                return tasks;
            }
        })
        return res.status(200).json({
            success:true,
            message:todayTasks
        })
    }else{
        return next(new ErrorHandle("User not found",404));
    }
})

const getAllTasksByDate = CatchAsyncErrors( async (req, res, next) => {
    const { userID } = req.body;
    var userTasksPresent = await Task.find({ userID: userID });
    if(userTasksPresent.length !== 0){
        let {usersAllTasks} = userTasksPresent[0];
        var datedTasks = usersAllTasks.filter((eachDateTasks)=>{
            let {taskDate,tasks} = eachDateTasks;
            if(taskDate === req.query.date){
                return tasks;
            }
        })
        return res.status(200).json({
            success:true,
            message:datedTasks
        })
    }else{
        return next(new ErrorHandle("User not found",404));
    }
})

const updateTaskStatusByID =  CatchAsyncErrors(async (req, res, next) => {

    const { userID,taskID } = req.body;
    var userTasksPresent = await Task.find({ userID: userID });
    if(userTasksPresent.length !== 0){
        let {usersAllTasks} = userTasksPresent[0];
        var datedTasks = usersAllTasks.map((eachDateTasks)=>{
            let {taskDate,tasks} = eachDateTasks;
            let [{_id,status,taskDetails,taskHeading}] = tasks;
            if(taskDate === req.query.date){
                return tasks;
            }else{
                return eachDateTasks;
            }
        })
        return res.status(200).json({
            success:true,
            message:datedTasks
        })
    }else{
        return next(new ErrorHandle("User not found",404));
    }

    // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false
    // });
    // res.status(200).json({
    //     msg: updatedTask
    // });
})

module.exports = { createNewTask,getTodayAllTasks,getAllTasksByDate,updateTaskStatusByID}