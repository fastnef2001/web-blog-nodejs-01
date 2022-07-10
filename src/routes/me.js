const user = require('../app/models/User');
const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/MeController');
const {verifyToken, checkRoleAdmin, checkRoleNormal, checkLogin} = require('../middlewares/authJWT');



router.get('/stored/courses', meController.storedCourses);

module.exports = router;
