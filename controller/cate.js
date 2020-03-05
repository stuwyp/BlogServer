const express = require('express');
const router = express.Router();
const cate = require('../service/cate');
const blog = require('../service/blog')

router.post('/', (req, res, next) => {
    cate.add_cate(req, res, next);
});

router.put('/:id', (req, res, next) => {
    cate.update_cate(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    cate.delete_cate(req, res, next);
});


router.get('/', (req, res, next) => {
    cate.get_all_cate(req, res, next);
});

router.get('/:id', (req, res, next) => {
    cate.get_cate_by_id(req, res, next);
});

router.get('/:id/blogs', (req, res, next) => {
    blog.get_blogs_by_cate_id(req, res, next);
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
