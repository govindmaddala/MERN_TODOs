const express = require('express')
const { createUser, loginUser, getUserByID } = require('../Controllers/UserController')
const router = express.Router()
router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/:id').get(getUserByID);
module.exports = router;