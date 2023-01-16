const express = require('express');
const { createNewTask, getTodayAllTasks, getAllTasksByDate, updateTaskStatusByID } = require('../Controllers/TasksController');
const router = express.Router();
router.route('/new').post(createNewTask);
router.route('/today').get(getTodayAllTasks);
router.route('/').post(getAllTasksByDate);
router.route('/update').put(updateTaskStatusByID);
// 
module.exports = router;