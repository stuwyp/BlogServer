const express = require('express');
const router = express.Router();
const user_dao = require('../dao/user_dao');
const blog_dao = require('../dao/blog_dao');
const comment_dao = require('../dao/comment_dao');
const recycle_dao = require('../dao/recycle_blog_dao');

router.get('/', (req, res, next) => {
    user_dao.get_all_user(req, res, next);
});

router.get('/:id', (req, res, next) => {
    user_dao.get_user_by_id(req, res, next);
});

router.get('/:id/blogs', (req, res, next) => {
    blog_dao.get_blogs_by_user_id(req, res, next);
});

router.get('/:id/recycle_blogs', (req, res, next) => {
    recycle_dao.get_blogs_by_user_id(req, res, next);
});

router.get('/:id/comments', (req, res, next) => {
    comment_dao.get_comments_by_user_id(req, res, next);
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
