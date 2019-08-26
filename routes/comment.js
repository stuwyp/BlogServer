const express = require('express');
const router = express.Router();
const comment_dao = require('../dao/comment_dao');

router.post('/', (req, res, next) => {
    comment_dao.add_comment(req, res, next);
});

router.put('/:id', (req, res, next) => {
    comment_dao.update_comment(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    comment_dao.delete_comment(req, res, next);
});


router.get('/', (req, res, next) => {
    comment_dao.get_all_comment(req, res, next);
});

router.get('/:id', (req, res, next) => {
    comment_dao.get_comment_by_id(req, res, next);
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
