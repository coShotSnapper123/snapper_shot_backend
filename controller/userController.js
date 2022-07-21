const bcrypt = require('bcryptjs');
const  User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const { notFound, handleSuccessResponse, badRequest, validationError,  recordExists } = require('../utils/response-helper');
//const {  isObjectIdValid } = require('../utils/helper');
const mongoose = require('mongoose');

exports.saveUser = async (req, res, next) => {
    try {
        // console.log("req ",req.body);
        // return ;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw validationError(errors.errors)
        }

        const { email,  password} = req.body;
        const is_deleted =0;
       
        //Check email is unique for new user
        const userExists = await User.findOne({ email: email });
        if (userExists)
            throw recordExists('A user with this email already exists.');

        //Check username is unique for new user
        //const usernameExists = await User.findOne({ username: username });
        // if (usernameExists)
        //     throw recordExists('A user with this username already exists.');

        const hashedPw = await bcrypt.hash(password, 12);
        
        var user = new User({
            // first_name,
            // last_name,
            email,
            password : hashedPw,
           // created_date:new Date(),
            is_deleted
        });
        
        const result = await user.save();
        if(result){
            //sendEmail(); //send email

            return handleSuccessResponse(res, { data : 'User Created Successfully' });
        }
        
        throw badRequest('Some Error Occured');

    } catch(err){
        if (!err.status)
            err.status = 500;
            
        next(err);
    }
}

/**method to check whether login user is valid or not */
exports.login = async (req, res, next) => {
    try {
        let loadedUser;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw validationError(errors.errors[0].msg)
        }

        let user;
        let isCandidateLogin = false
        const {email, password, loginFor, mobile } = req.body;
        
        if(loginFor === 'candidate'){
            
            user = await CandidateResumes.findOne(mobile === undefined ? { email: email, is_deleted:"0" } : { mobile, is_deleted:"0" });
            isCandidateLogin = true;
        }else{
            user = await User.findOne({ email: email, is_deleted:"0" });
        }
        
        if (!user) {
            throw notFound('Invalid Credentials, check email & password');
        }else{
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw notFound('Invalid Credentials, check email & password');
            }
        }
        
        loadedUser = user;

        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
                //user_role   : loginFor !== 'candidate' ? await getCurrentUserRId(loadedUser.user_role) : 'candidate'
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );
        /*
        var message = [];
        if (!isCandidateLogin){
            const objectId =  mongoose.Types.ObjectId(loadedUser._id)
            var message = await messageModel.aggregate([
                                                {
                                                    $match:{ message_to: objectId }
                                                },
                                                {
                                                    $lookup:
                                                    {
                                                        from: 'users',
                                                        localField: "message_from", 
                                                        foreignField: "_id", 
                                                        as: "users",
                                                        
                                                    }
                                                },
                                                {$unwind: '$users'}
                                            ]).sort({_id: -1}).limit(4);
        }

        var notice = [];
        if (!isCandidateLogin){
            const objectId =  mongoose.Types.ObjectId(loadedUser._id)
            var notice = await noticeModel.aggregate([
                                                {
                                                    $match:{ $and: [ { $or: [ { is_all: true },{ notice_to: objectId, } ] } ] }
                                                },
                                                {
                                                    $lookup:
                                                    {
                                                        from: 'users',
                                                        localField: "notice_from", 
                                                        foreignField: "_id", 
                                                        as: "users",
                                                        
                                                    }
                                                },
                                                {$unwind: '$users'}
                                            ]).sort({_id: -1}).limit(4);
        }
        */
        //console.log("loadedUser ",loadedUser)
        var pmage = '';
        if(loginFor !== 'candidate'){
            if(loadedUser.profile_image !== '')
                pmage= `${process.env.URL}/${loadedUser.profile_image}`
        }else{
            if(loadedUser.candidate_profile_image !== '')
                pmage= `${process.env.URL}/${loadedUser.candidate_profile_image}`
        }
        const data = {
            user : {
                id          : loadedUser._id.toString(),
                // username    : loginFor !== 'candidate' ? loadedUser.username : '',
                email       : loadedUser.email,
                // full_name   : loginFor !== 'candidate' ? loadedUser.first_name + ' ' + loadedUser.last_name : loadedUser.name,
                // last_name  : loginFor !== 'candidate' ? loadedUser.last_name : '',
                // first_name  : loginFor !== 'candidate' ? loadedUser.first_name : '',
                // user_role   : loginFor !== 'candidate' ? loadedUser.user_role : '',
                // user_role_name:  loginFor !== 'candidate' ? await userRoleById(loadedUser.user_role) : 'Candidate',
                // profile_image:  pmage ,
                // role_id     : loginFor !== 'candidate' ? await userRoleId(loadedUser.user_role) : '',
                isCandidateLogin : isCandidateLogin,
                // message : message,
                // notice : notice
            },
            accessToken : token,
            
        }

        return handleSuccessResponse(res, data);
        

    } catch(err){
        
        if (!err.status)
            err.status = 500;
            
        next(err);
    }
}
