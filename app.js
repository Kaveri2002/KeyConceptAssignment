const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
var DbConnection = require('./dbconn/DbConnection');
const LoginRegisterModel = require('./model/LoginRegisterModel');
const TaskModel = require('./model/TaskModel');
const app = express()
const port = 3000
const path = require('path');
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


DbConnection.StartConnection();

app.get('/', (req, res, next) => {
    res.render("register");
})

app.get('/login', (req, res, next) => {
    res.render("login");
})

// API for register user
app.post("/registerUser", (req, res, next) => {
    var password = bcrypt.hashSync(req.body.password, 10);
    var details = {
        company_name: req.body.company_name,
        username: req.body.username,
        password: password,
        email: req.body.email,
        mobile: req.body.mobile
    }
    var User = new LoginRegisterModel(details);
    User.save()
    .then(data => {
        res.send({ data: data, status: 200, success: "User registered successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while registering user."
        });
    });
})

// API for login user
app.post("/loginUser", (req, res, next) => {
    var details = {
        username: req.body.username,
        password:  req.body.password,
    }
    LoginRegisterModel.findOne({username: details.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({ message: "Username not found"});
        }
        var pass = bcrypt.compareSync(details.password, user.password);
        if(!pass) {
            return res.status(404).send({ message: "Password is incorrect!!!"});
        }
        res.send({data: user, status: 200, message: "User logged in successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "user not found!!"
        });
    });

})

//API for creating task 
app.post("/createTaskData", (req, res, next) => {
    var details = {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
        startTimestamp: req.body.startTimestamp, 
        endTimestamp: req.body.endTimestamp
    }
    var Task = new TaskModel(details);
    Task.save()
    .then(data => {
        res.send({ data: data, status: 200, success: "Task created successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating task."
        });
    });
})

// API for getting list of task 
app.get("/getTasklist", (req, res, next) => {
    TaskModel.find()
    .then(taskData => {
        res.send({data: taskData, status: 200 });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving task data."
        });
    });
})

//API for updating task by Id 
app.put("/updateTaskData/:Id", (req, res, next) => {
    TaskModel.findByIdAndUpdate(req.params.Id, {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
        startTimestamp: req.body.startTimestamp, 
        endTimestamp: req.body.endTimestamp
    })
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Error updating data with id " + req.params.Id
        });
    });
});

//API for deleting task by Id 
app.delete("/deleteTaskData/:Id", (req, res, next) => {
    TaskModel.findByIdAndRemove(req.params.Id)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });
        }
        res.send({message: "Data deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Could not delete data with id " + req.params.Id
        });
    });
});

// API for sorting task list by taskName
app.get("/sortTasklist", (req, res, next) => {
    TaskModel.find().sort({ taskName: 1 })
    .then(taskData => {
        res.send({data: taskData, status: 200 });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while sorting task data."
        });
    });
})

// API for searching task by taskName
app.post("/searchTaskByName", (req, res, next) => {
    var task = req.body.taskName;
    TaskModel.findOne({ taskName: task})
    .then(taskData => {
        res.send({data: taskData, status: 200 });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Task not found."
        });
    });
})

// API for filter by date and time range
app.post("/taskFilterbyDateRange", (req, res, next) => {
    var start = req.body.startDate;
    var end = req.body.endDate;
    TaskModel.find({startTimestamp: {"$gte": start, "$lt": end}})
    .then(taskData => {
        res.send({data: taskData, status: 200 });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while filter task data."
        });
    });
})


