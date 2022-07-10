const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/create', courseController.create);
router.post('/store',upload.single('anh') , courseController.store);
router.get('/:id/edit', courseController.edit);
router.put('/:id',upload.single('anh'), courseController.update);
router.delete('/:id', courseController.delete);
router.get('/:slug', courseController.index);

module.exports = router;
