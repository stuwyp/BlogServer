const mysql = require('mysql');
const conf = require('../config/config');
const {blog}= require('./sql_mapping');
const QueryString = require("querystring");

// 使用连接池
let pool = mysql.createPool(conf.mysql);

response = (res, ret_data, code, kind) => {
    switch (code) {
        case 404:
            ret_data['errMsg'] = 'Not found';
            break;
        case 400:
            ret_data['errMsg'] = 'Request error';
            break;
        case 201:
            ret_data['status'] = 'created';
            break;
        case 200:
            if (kind === 1)
                ret_data['status'] = 'updated';
            else if (kind === -1)
                ret_data ['status'] = 'deleted';
            break;
    }
    res.writeHead(code, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(ret_data));
};

add_blog = (req, res) => {
    let post_data = '';
    let ret_data = {};
    pool.getConnection((err, con) => {
        req.on('data', (chunk) => {
            post_data += chunk;
        });
        req.on('end', () => {
            post_data = QueryString.parse(post_data);
            console.log(JSON.stringify(post_data));
            let title = post_data['title'];
            let author = 'WYP'
            let content = post_data['content'];
            let description = post_data['description'];
            let category_id = 1;
            let created_at = post_data['created_at'];
            let updated_at = created_at
            let state = 1
            if (title && author && content && description && category_id && created_at && updated_at && state) {
                con.query(blog.insert, [title, author, content, description, category_id, created_at, updated_at, state], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        response(res, 400);
                        con.release();
                    }
                    else {
                        ret_data['id'] = result['insertId'];
                        response(res, ret_data, 201);
                        con.release();
                    }
                });

            }
            else {
                response(res, ret_data, 400);
                con.release();
            }
        });
    })
};

delete_blog = (req, res) => {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        pool.getConnection((err, con) => {
            con.query(blog.delete, [id], (err, result) => {
                if (err) {
                    console.log(err.message);
                    response(res, ret_data, 400);
                    con.release();
                }
                else if (result.affectedRows > 0) {
                    response(res, ret_data, 200, -1);
                    con.release();
                }
                else {
                    response(res, ret_data, 404);
                    con.release();
                }
            });
        });
    }
    else {
        response(res, ret_data, 400);
    }
};

update_blog = (req, res) => {
    let put_data = '';
    let ret_data = {};
    let id = req.params.id;
    pool.getConnection((err, con) => {
        req.on('data', (chunk) => {
            put_data += chunk;
        });
        req.on('end', () => {
            put_data = QueryString.parse(put_data);
            console.log(JSON.stringify(put_data));
            let title = put_data['title'];
            let author = 'WYP'
            let content = put_data['content'];
            let description = put_data['description'];
            let category_id = 1;
            let created_at = put_data['created_at'];
            let updated_at = created_at
            let blog_state = 1
            if (title && author && content && description && category_id && created_at && updated_at && blog_state) {
                con.query(blog.update, [title, author, content, description, category_id, created_at, updated_at, blog_state, id], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        response(res, ret_data, 400);
                        con.release();
                    }
                    else if (result.affectedRows > 0) {
                        response(res, ret_data, 200, 1);
                        con.release();
                    }
                    else {
                        response(res, ret_data, 404);
                        con.release();
                    }
                });
            }
            else {
                response(res, ret_data, 400);
                con.release();
            }
        });
    })
};

get_blog_by_id = (req, res) => {
    let id = req.params.id;
    pool.getConnection((err, con) => {
        con.query(blog.query_by_id, id, (err, result) => {
            let ret_data = {};
            if (err) {
                console.log(err.message);
                response(res, ret_data, 400);
                con.release();
            }
            else if (result.length > 0) {
                console.log(result);
                ret_data['data'] = result[0];
                response(res, ret_data, 200, 0);
                con.release();
            }
            else {
                response(res, ret_data, 404);
                con.release();
            }

        });
    });
};

get_all_blog = (req, res) => {
    pool.getConnection((err, con) => {
        con.query(blog.query_all, (err, result) => {
            let ret_data = {};
            if (err) {
                console.log(err.message);
                response(res, ret_data, 400);
                con.release();
            }
            else if (result.length >= 0) {
                // console.log(result);
                ret_data['data'] = result;
                ret_data['total'] = result.length
                ret_data['page'] = 1
                response(res, ret_data, 200, 0);
                con.release();
            }
            else {
                response(res, ret_data, 404);
                con.release();
            }
        });
    });
};

module.exports = {
    add_blog,
    update_blog,
    delete_blog,
    get_blog_by_id,
    get_all_blog
};
