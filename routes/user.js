const express = require('express');
const router = express.Router();
const user_dao = require('../dao/user_dao');

router.post('/', (req, res, next) => {
    user_dao.add_user(req, res, next);
});

router.put('/:id', (req, res, next) => {
    user_dao.update_user(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    user_dao.delete_user(req, res, next);
});


router.get('/', (req, res, next) => {
    user_dao.get_all_user(req, res, next);
});

router.get('/:id', (req, res, next) => {
    user_dao.get_user_by_id(req, res, next);
});

//设置跨域访问
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

module.exports = router;
