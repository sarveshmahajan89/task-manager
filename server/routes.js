const express = require("express");
const taskModel = require("./models");
const app = express();
app.post("/add_task", async (request, response) => {
    // add new task to db by admin
    let newUser = request.body, responseObj = {};
    newUser.password = newUser.status;
    const task = new taskModel(newUser);
    try {
        await task.save();
        const tasks = await taskModel.find({}, {title: true, description: true, dewDate: true, status: true});
        responseObj.status = 'success';
        responseObj.message = null;
        responseObj.tasks = tasks;
        response.send(responseObj);
    }
    catch (error) {
        response.status(500).send(error);
    }
});

app.get("/tasks", async (request, response) => {
    // fetching list of tasks from mongodb
    const tasks = await taskModel.find({}, {title: true, description: true, dewDate: true, status: true});
    try {
        response.send(tasks);
    }
    catch (error) {
        response.status(500).send(error);
    }
});

app.post("/update_task", async (request, response) => {
    // query to update task in db
    const task = request.body, result = await taskModel.updateOne({title: task.title}, {$set: {title: task.title, description: task.description, dewDate: task.dewDate, status: task.status}});
    let responseObj = {};
    try {
        if (result && result.modifiedCount && Number(result.modifiedCount) >= 0) {
            const tasks = await taskModel.find({}, {title: true, description: true, dewDate: true, status: true});
            responseObj.status = "success";
            responseObj.rowModified = result.nModified;
            responseObj.tasks = tasks;
        }
        else {
            responseObj.status = "fail";
            responseObj.rowModified = result.nModified
        }
        response.send(responseObj);
    }
    catch (error) {
        response.status(500).send(error);
    }
});

app.post("/delete_task", async (request, response) => {
    // api to delete task from mongodb
    let responseObj = {};
    const task = request.body,
        records_title = task.title,
        result = await taskModel.deleteMany({title: { $in: records_title }});

    try {
        console.log(result);
        if (result && result.deletedCount && Number(result.deletedCount) >= 0) {
            const tasks = await taskModel.find({}, {title: true, description: true, dewDate: true, status: true});
            responseObj.status = "success";
            responseObj.rowModified = result.nModified;
            responseObj.tasks = tasks;
        }
        else {
            responseObj.status = "fail";
            responseObj.rowModified = result.nModified
        }
        response.send(responseObj);
    }
    catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;