const express = require('express');
const { createNewTask,getTodayAllTasks,getAllTasksByDate,updateTaskStatus } = require('../Controllers/TasksController');
const isLogged = require('../middleware/IsLogged');
const router = express.Router();

router.route('/new').post(createNewTask);
// router.post('/new',,createNewTask);
router.route('/today').post(getTodayAllTasks);
router.route('/').get(getAllTasksByDate);
router.route('/update/:id').post(updateTaskStatus);

module.exports = router;