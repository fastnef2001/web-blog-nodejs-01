const Course = require("../models/Course");
const { mongooseToObject } = require("../../util/mongoose");
const Resize = require('../../Resize');
const path = require('path');
const fs = require('fs');

class CourseController {
  index(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render("courses/detail", { course: mongooseToObject(course)});
      })
      .catch(next);
  }

  create(req, res, next) {
    res.render("courses/create", {
      error: "",
    });
  }

  async store(req, res, next) {
    const formData = req.body;
    const imagePath = path.join(__dirname, '../../public/img');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.render("courses/create", {
        error: "Please choose an image",
      });
      return;
    }
    const filename = await fileUpload.save(req.file.buffer);
    formData.image = filename;
    // john _id của user đang đăng nhập
    formData.user = req.user._id;
    const course = new Course(formData);
    course.save();
    res.redirect(`/site/home`);
  }

  edit(req, res, next) {
    Course.findOne({ _id: req.params.id })
      .then((course) => {
        res.render("courses/edit", { course: mongooseToObject(course) });
      })
      .catch(next);
  }

  async update(req, res, next) {
    // lấy tên ảnh cũ từ database
    const oldImage = await Course.findOne({ _id: req.params.id });
    const formData = req.body;
    const imagePath = path.join(__dirname, '../../public/img');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      formData.image = oldImage.image;
    }
    else {
    const oldImagePath = path.join(__dirname, '../../public/img', oldImage.image);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    } 
    const filename = await fileUpload.save(req.file.buffer);
    formData.image = filename;
    }
    Course.updateOne({ _id: req.params.id }, formData)
      .then(() => {
          res.redirect(`/me/stored/courses`);
      })
      .catch(next);
  }

  delete(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
      .then(() => res.redirect(`back`))
      .catch(next);
  }
}
module.exports = new CourseController();
