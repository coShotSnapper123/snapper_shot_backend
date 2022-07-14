const express = require('express')
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const port = 3000
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand(myEnv)

app.get("/api",(req,res)=>{
    res.json({"users":["userOne","userTwo","userThree"]})
})



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