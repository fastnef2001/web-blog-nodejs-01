const siteRouter = require('./site');
const coursesRouter = require('./courses');
const meRouter = require('./me');
const authRouter = require('./auth');
const {verifyToken, checkRoleAdmin, checkRoleNormal, checkLogin} = require('../middlewares/authJWT');


function route(app) {
    

    app.use('/courses', verifyToken, checkLogin, coursesRouter);
    app.use('/me', verifyToken, checkLogin, meRouter);
    app.use('/site', verifyToken, checkLogin, siteRouter);
    app.use('/', authRouter);
}
module.exports = route;
