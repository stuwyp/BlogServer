
// constant.js
// 设置了密码盐值以及token的secretKey
const crypto = require('crypto');

module.exports = {
    environment: 'dev',
    mysql: {
        password: "123456",
        database: "test_blog",
        host: 'localhost',
        username: 'root'
    },
    security: {
        MD5_SUFFIX: 'no#thing$一个固定长度的盐值',
        md5: (pwd) => {
            let md5 = crypto.createHash('md5');
            return md5.update(pwd).digest('hex');
        },
        secretKey: "no#thing$",
        // // 过期时间 1小时
        // expiresIn: 60 * 60
    },
    wx: {
        appId: '',
        appSecret: '',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}
