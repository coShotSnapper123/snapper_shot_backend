/*const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
//require("dotenv").config();
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand(myEnv)

const dependantData = require('./routes/dependant');
const userRoutes = require('./routes/user');
const resumeRoutes = require('./routes/resume');
const path = require('path');
const emailData = require('./routes/email');
const dashboardData = require('./routes/dashboard');
const profileData = require('./routes/profile');
const messageData = require('./routes/message');
const noticeData = require('./routes/notice');
const postJob = require("./routes/job");
const employee = require('./routes/employee');
const { handleErrorResponse } = require('./utils/response-helper');

app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use('/api',dependantData);
app.use('/api',userRoutes);
app.use('/api/resume',resumeRoutes);
app.use('/api/mail', emailData);
app.use('/api/profile', profileData);
app.use('/api/dashboard', dashboardData);
app.use('/api/message', messageData);
app.use('/api/notice', noticeData);
app.use('/api/job',postJob)
app.use('/api/employee',employee)

app.use((error, req, res, next) => {
    handleErrorResponse(res, error);
})
app.use(express.static(path.join(__dirname, 'profile_images')));
app.use(express.static(path.join(__dirname, 'uploads/profile')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'employee')));
mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex : true
    })
    .then(() => {
        app.listen(process.env.PORT || 8000);
    }).catch(err => console.log('err',err));*/