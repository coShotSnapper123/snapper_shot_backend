const jwt = require('jsonwebtoken');
const { unauthorizedRequest, badRequest,handleSuccessResponse } = require('../utils/response-helper');
//const logsModel = require('../models/logs');
const User = require('../models/userModel');
//const {CandidateResumes} = require('../models/candidate_resumes');

var
    address
    ,os = require('os')
    ,ifaces = os.networkInterfaces();

for (var dev in ifaces) {
    var iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false;
    });
    if(iface.length > 0) address = iface[0].address;
}

module.exports = async (req, res, next) =>{
  let ip_address = address;
    let resumeIdArr = req.originalUrl.split("/");
      res.on('finish', async () => {
          let uId = req.userId;
         if(!uId){
             if(req.body.loginFor =="candidate" ){
                let {email} = req.body;
                // let candidate = await CandidateResumes.findOne({ email: email, is_deleted:"0" });
                // uId = candidate._id;
             }else{
                let  user = await User.findOne({ email: req.body.email, is_deleted:"0" });
                uId = user._id;
             }  
         }
         
        // var log = new logsModel({
        //     user_id :uId,
        //     req_method: req.method,
        //     req_page:resumeIdArr[2],
        //     res_code: res.statusCode,
        //     current_time: new Date(),
        //     req_body:req.body,
        //     req_ip:ip_address,
        // });       
        
        const result2 = await log.save();        
    })
    next();
}; 