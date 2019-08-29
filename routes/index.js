const express = require('express');
const router = express.Router();
const jwtAuth = require('../config/jwt')
// const {security} = require('../config/config')

router.use(jwtAuth);
// let token = req.body['token']
// jwt.verify(token, security.secretKey, function (err, decoded) {
//     if (err) {
//         console.log(err)
//         return res.status(403).send({
//             code: 40003,
//             errMsg: 'No token provided or token expired'
//         });
//     }
//     else {
//         req.body['username'] = decoded.username
//         // 把它交给下一个中间件，注意中间件的注册顺序是按序执行
//         next();
//     }
// })
// 路由中间件
module.exports = router;
