const jwt = require("jsonwebtoken");
const User = require("../app/models/User");


const verifyToken = (req, res, next) => {

  const token = req.cookies.access_token;
    if (!token) {
       {
        req.user = undefined;
        next();
      }
    }else {
      jwt.verify(token, process.env.MONGODB_URI, function (err, decode) {
      if (err) req.user = undefined; 
      User.findOne({_id: decode.id})   
        .exec((err, user) => {
          if (err) {
            res.status(500)
              .send({
                message: err
              });
          } else {
            req.user = user;
            next();
          }
        })
    });
    }   
  };

  const checkRoleAdmin = (req, res, next) => {
    if (!req.user) {
      res.redirect("/");
    }
    else if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).send({
        message: "Unauthorised access",
      });
    }
  };

  const checkRoleNormal = (req, res, next) => {
    if (!req.user) {
      res.redirect("/");
    }
    else if (req.user.role === "normal") {
      next();
    } else {
      res.status(403).send({
        message: "Unauthorised access",
      });
    }
  };

  const checkLogin = (req, res, next) => {
    if (!req.user) {
     res.redirect("/");
    }else{
      next();
    }
  }


module.exports = { verifyToken, checkRoleAdmin, checkRoleNormal, checkLogin};
