const mysql = require('mysql');
const conf = require('../config/config');
const {user} = require('./sql_mapping');
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

add_user = (req, res) => {
    let post_data = '';
    let ret_data = {};
    pool.getConnection((err, con) => {
        req.on('data', (chunk) => {
            post_data += chunk;
        });
        req.on('end', () => {
            post_data = QueryString.parse(post_data);
            console.log(JSON.stringify(post_data));

            let username = post_data['username'];
            let password = post_data['password'];
            let email = post_data['email'];
            let created_at = post_data['created_at'];
            let updated_at = created_at
            let is_admin = 1
            let is_active = 1
            if (username && password && email && created_at && updated_at && is_admin && is_active) {
                con.query(user.insert, [username, password, email, created_at, updated_at, is_admin, is_active], (err, result) => {
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

delete_user = (req, res) => {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        pool.getConnection((err, con) => {
            con.query(user.delete, [id], (err, result) => {
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

update_user = (req, res) => {
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
            let username = put_data['username'];
            let password = put_data['password'];
            let email = put_data['email'];
            let created_at = put_data['created_at'];
            let updated_at = created_at
            let is_admin = 1
            let is_active = 1
            if (username && password && email && created_at && updated_at && is_admin && is_active) {
                con.query(user.update, [username, password, email, created_at, updated_at, is_admin, is_active, id], (err, result) => {
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

get_user_by_id = (req, res) => {
    let id = req.params.id;
    pool.getConnection((err, con) => {
        con.query(user.query_by_id, id, (err, result) => {
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

get_all_user = (req, res) => {
    pool.getConnection((err, con) => {
        con.query(user.query_all, (err, result) => {
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
    add_user,
    update_user,
    delete_user,
    get_user_by_id,
    get_all_user
};
