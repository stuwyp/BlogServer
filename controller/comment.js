const express = require('express');
const router = express.Router();
const comment = require('../service/comment');

router.post('/', (req, res, next) => {
    comment.add_comment(req, res, next);
});

router.put('/:id', (req, res, next) => {
    comment.update_comment(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    comment.delete_comment(req, res, next);
});


router.get('/', (req, res, next) => {
    comment.get_all_comment(req, res, next);
});

router.get('/:id', (req, res, next) => {
    comment.get_comment_by_id(req, res, next);
});

// //设置跨域访问
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
