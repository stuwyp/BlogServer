const express = require('express');
const router = express.Router();
const jwtAuth = require('../config/jwt')
// const {security} = require('../config/config')

router.use(jwtAuth);

// 路由中间件
module.exports = router;
