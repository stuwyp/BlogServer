const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth')
const blogRouter = require('./routes/blog');
const commentRouter = require('./routes/comment');


const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({credentials: true, origin: 'http://localhost:8000'}));
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(indexRouter)
app.use('/blog', blogRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/comment', commentRouter);

app.use(function (err, req, res, next) {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({
            code: 40001,
            errMsg: 'No token provided or token expired'
        });
    }
});

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });
//
// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;
