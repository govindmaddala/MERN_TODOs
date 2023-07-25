const express = require("express");
const router = express.Router();
const { decryptData } = require("../utils/decryptData");
const Tasks = require('../Controllers/task.controller')

router.post("/:base64URL", (req, res, next) => {
    let decryptedEndpoint = decryptData(req.params.base64URL);
    if(decryptedEndpoint === "/newTask"){
        Tasks.newTask(req, res, next);
    }

    if(decryptedEndpoint === "/getUserTasks"){
        Tasks.getUserTasks(req, res, next);
    }

    if(decryptedEndpoint === "/deleteTask"){
        Tasks.deleteTask(req, res, next);
    }

    
})



module.exports = router;
