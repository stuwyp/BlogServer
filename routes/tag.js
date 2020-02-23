const express = require('express');
const router = express.Router();
const tag_dao = require('../dao/tag_dao');
const blog_tao = require('../dao/blog_dao')

router.post('/', (req, res, next) => {
    tag_dao.add_tag(req, res, next);
});

router.put('/:id', (req, res, next) => {
    tag_dao.update_tag(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    tag_dao.delete_tag(req, res, next);
});


router.get('/', (req, res, next) => {
    tag_dao.get_all_tag(req, res, next);
});

router.get('/:id', (req, res, next) => {
    tag_dao.get_tag_by_id(req, res, next);
});

router.get('/:id/blogs', (req, res, next) => {
    blog_tao.get_blogs_by_tag_id(req, res, next);
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
