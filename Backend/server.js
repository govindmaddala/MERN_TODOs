require('dotenv').config('./.env');

// const bodyParser = require("body-parser");
const errorHandler = require('./middleware/ErrorHandler')

// // const taskAPI = require('./APIs/TaskAPI');
// const userAPI = require('./APIs/UsersAPI');
// const updatedTasksAPI = require('./APIs/TasksAPI');
// const { connectDatabase } = require('./Database/connectDatabase');
// global.myDB = connectDatabase();

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());
// app.use(morgan('dev'))
// // databaseConnect();

// // app.use('/tasks',taskAPI);
// app.use('/user',userAPI);
// app.use('/tasks',updatedTasksAPI);

// app.use(errorHandler);


// const port = process.env.port || 5000

// app.listen(port, () => {
//     console.log(`Server is listening on ${port}`);
// })

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

app.listen(port, async () => {
    global.myDB = await connectDatabase();
    console.log(`Server listening on port ${port}`);
});