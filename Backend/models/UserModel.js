const CatchAsyncErrors = require("../utils/CatchAsyncErrors")
const bcrypt = require('bcrypt');

exports.createUser = CatchAsyncErrors(async (query) => {
    let query = {
        username: query.username,
        password: bcrypt(query.password, 10),
        password_text: query.password
    }

    let response = await myDB.collection("users").insertOne(query);
    return response;
})