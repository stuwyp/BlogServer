const express = require('express');
const router = express.Router();
const user = require('../service/user');
const blog = require('../service/blog');
const comment = require('../service/comment');

router.get('/', (req, res, next) => {
    user.get_all_user(req, res, next);
});

router.get('/:id', (req, res, next) => {
    user.get_user_by_id(req, res, next);
});

router.get('/:id/blogs', (req, res, next) => {
    blog.get_blogs_by_user_id(req, res, next);
});

router.get('/:id/drafts', (req, res, next) => {
    blog.get_blogs_by_user_id(req, res, next, 0);
});

router.get('/:id/recycle_blogs', (req, res, next) => {
    blog.get_blogs_by_user_id(req, res, next, -1);
});

router.get('/:id/comments', (req, res, next) => {
    comment.get_comments_by_user_id(req, res, next);
});

//设置跨域访问
// router.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

module.exports = router;
