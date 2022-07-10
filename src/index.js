const path = require('path');
const express = require('express');
const { engine } = require('ejs'); 
const { Console } = require('console');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')
const dateFormat = require('handlebars-dateformat');
const expressLayouts = require('express-ejs-layouts')

require('dotenv').config();
const route = require('./routes');
const db = require('./config/db'); // db connection

db.connect(); // connect to db
const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(methodOverride('_method'));

// template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(expressLayouts)                                              
app.use(function(req, res, next) {
    res.locals ={
        token: req.cookies.access_token,
        fullName: req.cookies.fullName,
        role: req.cookies.role,
        path: req.path,
    }
    next();
});
route(app);
app.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
});
