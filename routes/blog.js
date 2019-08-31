const express = require('express');
const router = express.Router();
const blog_dao = require('../dao/blog_dao');
const comment_dao = require('../dao/comment_dao');
const search_dao = require('../dao/search')
router.get('/', (req, res, next) => {
    blog_dao.get_all_blog(req, res, next);
});

router.get('/search', (req, res, next) => {
    search_dao.globalSearchBlogs(req, res, next);
});

router.post('/', (req, res, next) => {
    blog_dao.add_blog(req, res, next);
});

router.put('/:id', (req, res, next) => {
    blog_dao.update_blog(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    blog_dao.delete_blog(req, res, next);
});

router.get('/:id', (req, res, next) => {
    blog_dao.get_blog_by_id(req, res, next);
});

router.get('/:id/comments', (req, res, next) => {
    comment_dao.get_comments_by_blog_id(req, res, next);
});


//设置跨域访问
router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

module.exports = router;
