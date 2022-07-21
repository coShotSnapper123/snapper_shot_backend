const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/userModel');
const UserRole = require('../models/UserRole');
const baseUrl = process.env.BASE_URL;
const recordsPerPage = process.env.RECORDS_PER_PAGE;
var mongoose = require('mongoose');
const _ = require('lodash')
const nodemailer = require('nodemailer');
const SkillsTempMaster = require("../models/skills_temp_master");
const { SkillsMaster } = require("../models/skills_master");
const messageModel = require('../models/message')
const { mailConfiguration } = require('../utils/mailConfig');
var config = mailConfiguration();
var SibApiV3Sdk = require('sib-api-v3-sdk');
exports.pagination = (currentPage, totalItems, moduleName) => {
    
    let prevPage = (currentPage !== 1 ? (currentPage - 1) : '');
    let nextPage = currentPage + 1;
    let lastPage = Math.ceil(totalItems / recordsPerPage);
    return paginationData = {
        "current_page"  : currentPage,
        "last_page"     : lastPage,
        "last_page_url" : baseUrl + moduleName + '?page=' + lastPage,
        "next_page_url" : ((lastPage >= nextPage) ? baseUrl + moduleName + '?page=' + nextPage : ''),
        "per_page"      : recordsPerPage,
        "prev_page_url" : prevPage ? baseUrl + moduleName + '?page=' + prevPage : '',
        "total"         : totalItems
    }
}
exports.getCurrentUserRId=async(id)=>{
    const userData =await UserRole.findById(id);
    if(userData){
         return userData.rid
      }
}

exports.userNameById=async(id)=>{
    const userData =await User.findById(id);
    if(userData){
         return userData.username
      }
}

exports.userRoleById=async(id)=>{

    const userData =await UserRole.findById(id);
    if(userData){
        return userData.name  
    }
}

exports.getCurrentUserRoleId=async(rid,userId)=>{
    var UserObjectId = mongoose.Types.ObjectId(userId);
    const resume_status = await UserRole.aggregate([
            {
            $lookup:
              {
                from: 'users',
                as: "users",
                localField:'_id',
                foreignField:'user_role'
              }} ,
              {
                $unwind: '$users'
              },     
              {
                $match: {
                        $expr: {  
                            $gt: [
                            '$rid', rid
                            ]
                         },
                         "is_deleted":"0"
                }
             },
             {
                $addFields: {
                "_id":"$users._id",
                }
            },
             {
                "$project": {
                    "users_data": 1
                }
             }
    ])
    let completeStatus=_.map(resume_status, '_id');
    completeStatus.push(UserObjectId);
 return completeStatus;
}

exports.getCurrentUserAssignedUser=async(userId)=>{

    var UserObjectId = mongoose.Types.ObjectId(userId); 
    const total_user = await User.find({}).countDocuments();
    const resume_status = await User.aggregate([       
        { $match: { "assigned_to" : UserObjectId, "is_deleted":"0" }},
        {
            "$project": {
                "_id": 1
            }
        }
    ])

    let completeStatus=_.map(resume_status, '_id'); 
    let userArray = []; 
    let tempUserArray = []; 
   
    if(completeStatus.length > 0){
        tempUserArray.push(...completeStatus);
        
        for(let i =0 ; i<=total_user-1; i++){

            const assigned_user = await User.aggregate([       
                { $match: { "assigned_to" : { $in: tempUserArray }, "is_deleted":"0" }},
                {
                    "$project": {
                        "_id": 1
                    }
                }
            ])
            
            if(assigned_user.length === 0){
                break;
            }
            let tempdata = _.map(assigned_user, '_id');
            userArray.push(...tempdata)
            tempUserArray = []
            tempUserArray.push(...tempdata)

        }    
    }
    completeStatus.push(...userArray);
    // completeStatus.push(UserObjectId);   
 return completeStatus;
}

exports.isObjectIdValid = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;

//send email to candidate when they are created either manual or multiple
exports.sendMail = (reqBody) => {
    const {email: candidateEmail, mailSubject, mailBody } = reqBody;

    const host = config.mailHost;
    const port = config.mailPort;
    const hostEmail = config.hostEmail;
    const hostPassword = config.hostPassword;
    
    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        auth: {
            user: hostEmail,
            pass: hostPassword
        }
    });
    let mailOptions = {
        from: hostEmail,
        to: candidateEmail,
        subject: mailSubject,
        html: mailBody
    };
    
    // send email
    transporter.sendMail(mailOptions, function(error, info){
        try {            
            if (error) {
                return false
            } else {
                return true
            }
        }catch (error) {
            return false
        }
    });
}
exports.checkSkillsData= async(skillsString)=>{

    var string = skillsString.split(/[\s,]+/);
    const result =  string.filter(e =>  e);
    const worderror = ['in','the','and','of','by','it','for','is','a',':'];
    let arr = result.filter(function(e){ if(!worderror.includes(e)){return e; } });
    const newarray = [];
    for (let i = 0; i <= arr.length; i++) {
        
        if(i <= arr.length-2){
            newarray.push(arr[i]);
            newarray.push(arr[i]+' '+arr[i+1]);
            newarray.push(arr[i]+' '+arr[i+1]+' '+arr[i+2]);
        }
    }
    // console.log('isExists',newarray);
    _.forEach(newarray, async function(data){
        const re = new RegExp(data.trim(), 'i');
        let isExists = await SkillsMaster.find({value : re }).countDocuments();
        // console.log('isExists',re);
        if(isExists===0){
            // console.log('f');
            const skillTemp = new SkillsTempMaster();
            skillTemp.value = data;
            await skillTemp.save();
        }
        
    });

}

exports.userRoleId=async(id)=>{

    const userData =await UserRole.findById(id);
    if(userData){
        return userData.rid  
    }
}

exports.getCurrentReply=async(messageId)=>{

    var MessageObjectId = mongoose.Types.ObjectId(messageId); 
    const msgcount = await messageModel.find({}).countDocuments();
    const msg_reply = await messageModel.aggregate([       
        { $match: { "_id" : MessageObjectId, is_deleted: '0' }},
        {
            "$project": {
                "_id" : 0,
                "reply": 1
            }
        }
    ])
    
    let completeMsg =_.map(msg_reply, 'reply'); 
    
    let msgArray = []; 
    let tempMsgArray = []; 
   
    if(completeMsg.length > 0){
        tempMsgArray.push(...completeMsg);
        
        for(let i =0 ; i<=msgcount-1; i++){

            const replyed_msg = await messageModel.aggregate([       
                { $match: { "_id" : { $in: tempMsgArray }, is_deleted: '0' }},
                {
                    "$project": {
                        "_id" : 0,
                         "reply": 1
                    }
                }
            ])
            
            if(replyed_msg.length === 1){
                
                if(typeof replyed_msg[0] === undefined){
                
                    break;
                }
                
            }
            let tempdata = _.map(replyed_msg, 'reply'); 
            msgArray.push(...tempdata)
            tempMsgArray = []
            tempMsgArray.push(...tempdata)
          
        } 
         
    }
     
    completeMsg.push(...msgArray);
 return completeMsg;
}

exports.sendMailBySib = (body) => {

    const { email, mailSubject, mailBody } = body;
    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
        to: [{
            email: email
        }],
        subject : mailSubject,
        sender: {"name": "Virtual Employee", "email":"it@virtualemployee.com"},
        htmlContent : mailBody
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        
        // console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return true;
    }, function(error) {
        console.error(error);
        return false;
    });

}

exports.isObjectIdValid = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;
