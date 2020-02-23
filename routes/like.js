const express = require('express');
const router = express.Router();
const like_dao = require('../dao/like_dao');

router.post('/', (req, res, next) => {
    like_dao.add_like(req, res, next);
});


router.delete('/:id', (req, res, next) => {
    like_dao.delete_like(req, res, next);
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
