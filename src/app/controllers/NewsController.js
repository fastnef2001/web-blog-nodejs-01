class NewsController {
    index(req, res) {
        res.render('news');
    }
    show(req, res) {
        res.render('news1');
    }
}
module.exports = new NewsController();
