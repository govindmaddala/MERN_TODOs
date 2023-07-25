require('dotenv').config('./.env');
const errorHandler = require('./middleware/ErrorHandler')
const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
const morgan = require('morgan')
const connectDatabase = require('./Database/connectDatabase')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'))

app.use("/users", require('./routes/user.routes'));
app.use("/tasks", require('./routes/tasks.routes'));

app.use(errorHandler);

const port = process.env.PORT || 5000
connectDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
})
