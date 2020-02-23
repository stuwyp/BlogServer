const expressJwt = require("express-jwt");
const {security} = require('../config/config');

// express-jwt中间件帮我们自动做了token的验证以及错误处理，所以一般情况下我们按照格式书写就没问题，其中unless放的就是你想要不检验token的api。
const jwtAuth = expressJwt({secret: security.secretKey}).unless({
    path: [
        {url: '/auth/login', methods: ['POST']},
        {url: '/auth/register', methods: ['POST']},
        {url: '/blog', methods: ['GET']},
        {url: /^\/blog\/.*/, methods: ['GET']},
        {url: '/tag', methods: ['GET']},
        {url: '/blog', methods: ['POST']},
        {url: /^\/blog\/.*/, methods: ['PUT']},
    ]
});

module.exports = jwtAuth;
