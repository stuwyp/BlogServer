const jwtRouter = require('./jwt')
const userRouter = require('./user');
const authRouter = require('./auth')
const blogRouter = require('./blog');
const commentRouter = require('./comment');
const tagRouter = require('./tag')
const likeRouter = require('./like')

module.exports = app => {
    app.use(jwtRouter)
    app.use('/blog', blogRouter);
    app.use('/user', userRouter);
    app.use('/auth', authRouter);
    app.use('/comment', commentRouter);
    app.use('/tag', tagRouter)
    app.use('./like', likeRouter)
}
