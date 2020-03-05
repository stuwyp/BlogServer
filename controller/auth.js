const express = require('express');
const router = express.Router();
const user = require('../service/user');

router.post('/info', (req, res, next) => {
    user.get_info(req, res, next);
});

router.post('/login', (req, res, next) => {
    user.user_login(req, res, next);
});

router.post('/register', (req, res, next) => {
    user.add_user(req, res, next);
});

router.put('/:id', (req, res, next) => {
    user.update_user(req, res, next);
});

// router.post('/:id', (req, res, next) => {
//     user.delete_user(req, res, next);
// });


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
