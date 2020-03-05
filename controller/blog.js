const express = require('express');
const router = express.Router();
const blog = require('../service/blog');
const comment = require('../service/comment')
const search = require('../service/search')

router.get('/', (req, res, next) => {
    blog.get_all_blog(req, res, next);
});

router.get('/search', (req, res, next) => {
    search.global_search_blogs(req, res, next);
});

router.post('/', (req, res, next) => {
    blog.add_blog(req, res, next);
});

router.put('/:uuid', (req, res, next) => {
    blog.update_blog_attr(req, res, next);
});

router.delete('/:uuid', (req, res, next) => {
    blog.delete_blog(req, res, next);
});

router.get('/:id', (req, res, next) => {
    blog.get_blog_by_id(req, res, next);
});

router.get('/:id/comments', (req, res, next) => {
    comment.get_comments_by_blog_id(req, res, next);
});


//设置跨域访问
// router.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:8000');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

module.exports = router;
