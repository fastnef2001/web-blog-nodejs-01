const Course = require("../models/Course");
const { mutipleMongoose } = require("../../util/mongoose");

class MeController {
  storedCourses(req, res, next) {
    const perPage = 9;
    const page = Number(req.query.page) || 1;
    // nếu page không có thì index = 1
    let index = 1;
   
    // tiếp tục tăng index khi chuyển trang
    if (page > 1) {
      index = ((page - 1) * perPage) + 1;
    }
  


    // nếu user là admin
    if (req.user.role === 'admin') {
      if (req.query.q === undefined || req.query.q === '') {
        Course
        .find({})
        .sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, courses) => {
          Course.countDocuments({}, (err, count) => {
            if (err) return next(err);
            res.render("me/courses", {
              courses: mutipleMongoose(courses),
              current: page,
              pages: Math.ceil(count / perPage),
              message: ' ',
              typeSearch: '',
              index: index,
            });
          })
        })
      }
      else {
        Course.find({ name: { $regex: req.query.q, $options: 'i' } })
        .sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, courses) => {  
          Course.countDocuments({ name: { $regex: req.query.q, $options: 'i' } }, (err, count) => {
            if (err) return next(err);
            res.render('me/courses', {
              courses: mutipleMongoose(courses),
              current: page,
              pages: Math.ceil(count / perPage),
              message: 'Tìm thấy ' + count + ' kết quả phù hợp: ' + req.query.q,
              typeSearch: req.query.q,
              index: index,
            })
          }
          )
  
        })
  
      }
    }else{
      if (req.query.q === undefined || req.query.q === '') {
        Course
        .find({user: req.user._id})
        .sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, courses) => {
          Course.countDocuments({user: req.user._id}, (err, count) => {
            if (err) return next(err);
            res.render("me/courses", {
              courses: mutipleMongoose(courses),
              current: page,
              pages: Math.ceil(count / perPage),
              message: ' ',
              typeSearch: '',
              index: index,
            });
          })
        })
      }
      else {
        Course
        .find({user: req.user._id, name: { $regex: req.query.q, $options: 'i' } })
        .sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, courses) => {  
          Course.countDocuments({user: req.user._id, name: { $regex: req.query.q, $options: 'i' } }, (err, count) => {
            if (err) return next(err);
            res.render('me/courses', {
              courses: mutipleMongoose(courses),
              current: page,
              pages: Math.ceil(count / perPage),
              message: 'Tìm thấy ' + count + ' kết quả phù hợp: ' + req.query.q,
              typeSearch: req.query.q,
              index: index,
            })
          }
          )
        })
      }
    }
  }
}
module.exports = new MeController();
