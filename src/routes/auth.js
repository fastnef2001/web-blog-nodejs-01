const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const { replaceOne } = require('../app/models/Course');

router.get('/logout', authController.logout);
router.get('/register', authController.register);
router.post('/register', authController.signup );
router.post('/login', authController.signin);
router.get('/', authController.login);


module.exports = router;
