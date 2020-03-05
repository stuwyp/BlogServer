const jwtController = require('../controller/jwt')
const userController = require('../controller/user');
const authController = require('../controller/auth')
const blogController = require('../controller/blog');
const draftController = require('../controller/draft')
const commentController = require('../controller/comment');
const tagController = require('../controller/tag')
const cateController = require('../controller/cate')
const likeController = require('../controller/like')

module.exports = app => {
    app.use(jwtController)
    app.use('/api/blog', blogController);
    app.use('/api/draft', draftController)
    app.use('/api/user', userController);
    app.use('/api/auth', authController);
    app.use('/api/comment', commentController);
    app.use('/api/tag', tagController)
    app.use('/api/cate', cateController)
    app.use('/api/like', likeController)
}
