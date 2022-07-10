const User = require("../models/User");
const Course = require("../models/User");
const { mongooseToObject } = require("../../util/mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

class AuthController {
  register = (req, res) => {
    res.render("auth/register",
    {
      message: "",
    }
    );
  };

  signup = (req, res) => {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role,
    });
    const passwordtest = req.body.password;

    // kiểm tra xem tất cả các trường đều được điền hay chưa
    if ( !user.fullName || !user.email || !passwordtest || !user.role) {
      return res.render("auth/register", {
        message: "Vui lòng điền đầy đủ thông tin",
      });
    } else {
      // kiểm tra xem email đã tồn tại chưa
      User.findOne({ email: user.email })
        .then((user) => {
          if (user) {
            return res.render("auth/register", {
              message: "Email đã tồn tại",
            });
          } else {
            const user = new User({
              fullName: req.body.fullName,
              email: req.body.email,
              role: req.body.role,
              password: bcrypt.hashSync(req.body.password, 8),
            });
            user.save()
              .then((user) => {
                res.render("auth/register", {
                  message: "Đăng ký thành công",
                });
              })
            }

        })
      }
  };

  login(req, res, next) {
    res.render("auth/login", 
    {
      error: "Please enter your login and password!",
    });
  }

  signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      }

      if (!user) {
        
        res.render("auth/login", {
          error: "Email or password is incorrect",
        });
        return;
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        res.render("auth/login", {
          error: "Email or password is incorrect",
        });
        return;
      }
      var token = jwt.sign(
        {
          id: user.id,
        },
        process.env.MONGODB_URI,
        {
          expiresIn: 86400,
        }
      );
      res.cookie("access_token", token, {
        maxAge: 86400 * 1000,
        httpOnly: true,
        sameSite: "strict"
      });
      res.cookie('fullName', user.fullName);
      res.cookie('role', user.role);
       res.redirect("/site/home");

    });
  };

  logout = (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("fullName");
    res.clearCookie("role");
    res.redirect("/");
  };
}



module.exports = new AuthController();
