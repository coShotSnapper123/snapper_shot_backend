const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    // first_name : {
    //     type: String,
    //     required : true
    // },
    // last_name : {
    //     type: String,
    //     required : true
    // },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password : {
        type: String,
        required : true
    },
    // created_date : {
    //     type: String,
    //     default:''
    // },
    // created_by : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : 'User'
    // },
    // user_role: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : 'user_roles'
    // },
    // assigned_to: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : 'assigned_to'
    // },
    is_deleted: {
        type: String,
        ref : 'is_deleted'
    },
    // profile_image: {
    //     type: String,
    //     default:''
    // },
}, {timestamps : true});

module.exports = mongoose.model('Users', userSchema);