const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const port = 3000
var dotenv = require('dotenv')
var myEnv = dotenv.config()
var dotenvExpand = require('dotenv-expand')
const { handleErrorResponse } = require('./utils/response-helper');

app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true }));


dotenvExpand(myEnv)


const signUp = require('./routes/user');
app.use('/api',signUp);

app.use((error, req, res, next) => {
  handleErrorResponse(res, error);
})
app.use(express.json())
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

mongoose.connect(process.env.DB_URL,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex : true
})
.then(() => {
  console.log(" connection success")
  app.listen(process.env.PORT || 8000);
}).catch(err => console.log('err',err));