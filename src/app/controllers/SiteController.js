const Course = require('../models/Course');
const { mutipleMongoose } = require('../../util/mongoose');

class SiteController {
   
    home(req, res, next) {
        const perPage = 9; 
        const page = Number(req.query.page) || 1;
        if (req.query.q === undefined || req.query.q === '') {
            Course
            .find({})
            .sort({ createdAt: -1 })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, courses) => {
                Course.countDocuments({}, (err, count) => {
                    if (err) return next(err);
                    res.render('home', {
                        courses: mutipleMongoose(courses),
                        current: page,
                        pages: Math.ceil(count / perPage),
                        message:"",
                        typeSearch: '',
                    })
                })
            });
        }
        else {
            Course.find({ name: { $regex: req.query.q, $options: 'i' } })
            .skip((perPage * page) - perPage)
            .skip((perPage * page) - perPage)            
            .exec((err, courses) => {  
                Course.countDocuments({ name: { $regex: req.query.q, $options: 'i' } }, (err, count) => {
                    if (err) return next(err);
                    res.render('home', {
                        courses: mutipleMongoose(courses),
                        current: page,
                        pages: Math.ceil(count / perPage),
                        message: 'Tìm thấy ' + count + ' kết quả phù hợp: ' + req.query.q,
                        typeSearch: req.query.q,
                    })
                }
                )
            })
        }
    } 
}
module.exports = new SiteController();
