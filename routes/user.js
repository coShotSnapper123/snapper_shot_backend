const express = require('express');
const { body} = require('express-validator');

const router = express.Router();

const userController = require('../controller/userController');
const isAuth = require('../middleware/auth');
const logger = require("../middleware/logger")

//const trackActivity = require('../middleware/trackActivity');
//const logger = require("../middleware/logger")
//router.post('/signUp',  logger, userController.signUp); 
//router.post('/user', isAuth ,logger, [
router.post('/user',  [
    body('password').trim().exists().withMessage('Please enter password'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter valid email.'),
], userController.saveUser); //create a single user

router.post('/login', [
    body('email').isEmail()
            .normalizeEmail({gmail_remove_dots: false})
            .withMessage('Please enter a valid email.'),
    body('password').trim().isLength({ min: 6 }).withMessage('Please enter password minimum length.'),
], userController.login); //login user

/*
router.post('/login', [
    body('email').isEmail()
            .normalizeEmail({gmail_remove_dots: false})
            .withMessage('Please enter a valid email.'),
    body('password').trim().isLength({ min: 6 }).withMessage('Please enter password minimum length.'),
], logger, userController.login); //login user
 
router.get('/user', isAuth , userController.getUsers); //fetch all user



router.get('/user/:userId', isAuth , userController.getUser); //fetch single user

router.put('/user/:userId', isAuth , logger , [
    body('username').trim().exists().withMessage('Please enter username'),
    body('first_name').trim().exists().withMessage('Please enter first name'),
    body('last_name').trim().exists().withMessage('Please enter first name'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter valid email.'),
], userController.updateUser); //fetch single user

router.delete('/user/:userId', isAuth ,logger , userController.deleteUser); //delete user

router.get('/skills', isAuth , userController.getSkills); //fetch all skills

router.post('/skills',  isAuth ,logger, [
    body('skills_name').trim().exists().withMessage('Please enter skills'),
    
], userController.saveSkills); //create a single user

router.get('/skills/:skillId', isAuth , userController.getSkill); //fetch single user

router.put('/skills/:skillId',  isAuth ,logger, [
    body('skills_name').trim().exists().withMessage('Please enter Skill Name'),
], userController.updateSkill); //fetch single user

router.delete('/skills/:skillId', isAuth , logger,userController.deleteSkill); //delete user

router.get('/getUserRoles', isAuth, userController.getUserRoles)
router.get('/getUserByRole/:userId' , userController.getUserByRole); //fetch single user

router.get('/skillsTemp', isAuth , userController.getTempSkills); //fetch all temp skills

router.put('/skillsTempStatus/:skillId', isAuth ,logger, [
    body('skills_status').trim().exists().withMessage('Please enter status'),
    
], userController.updateTempSkills);


router.get('/activityLog/:userId', isAuth , userController.getActivityLog); //fetch activity logs
*/
module.exports = router;