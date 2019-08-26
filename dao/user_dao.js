const {User} = require('./model')
const QueryString = require("querystring");
const {response} = require('../config/response')


async function add_user(req, res) {
    let post_data = '';
    let ret_data = {};

    req.on('data', (chunk) => {
        post_data += chunk;
    });
    req.on('end', async () => {
        try {
            post_data = QueryString.parse(post_data);
            console.log(JSON.stringify(post_data));
            let username = post_data['username'];
            let password = post_data['password'];
            let email = post_data['email'];
            let created_at = post_data['created_at'];
            let updated_at = post_data['created_at'];
            let is_admin = 1
            let is_active = 1
            let user = await User.create({
                username, password, email, created_at, updated_at, is_admin, is_active
            })
            console.log(JSON.stringify(user))
            ret_data['id'] = user.id;
            response(res, ret_data, 201);
        }
        catch (err) {
            console.log(err.message);
            response(res, ret_data, 400);
        }
    })
};

async function delete_user(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let user = await User.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(user))
            if (user > 0) {
                response(res, ret_data, 200, -1);
            }
            else {
                response(res, ret_data, 404);
            }
        }
        catch (err) {
            console.log(err.message);
            response(res, ret_data, 400);
        }
    }
    else {
        response(res, ret_data, 400);
    }
};

async function update_user(req, res) {
    let put_data = '';
    let ret_data = {};
    let user_id = req.params.id;
    try {
        let user = await User.findByPk(user_id)
        if (user === null) {
            response(res, ret_data, 404);
            return
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
        return
    }
    req.on('data', (chunk) => {
        put_data += chunk;
    });
    req.on('end', async () => {
        try {
            put_data = QueryString.parse(put_data);
            console.log(JSON.stringify(put_data));
            let username = put_data['username'];
            let password = put_data['password'];
            let email = put_data['email'];
            let created_at = put_data['created_at'];
            let updated_at = put_data['created_at'];
            let is_admin = 1
            let is_active = 1
            let user = await User.update(
                {
                    username, password, email, created_at, updated_at, is_admin, is_active, user_id,
                },
                {
                    where: {
                        id: user_id
                    }
                })
            console.log(JSON.stringify(user[0]))
            if (user[0] > 0) {
                response(res, ret_data, 200, 1);
            }
            else {
                response(res, ret_data, 400);
            }
        }
        catch (err) {
            console.log(err.message);
            response(res, ret_data, 400);
        }

    });

};

async function get_user_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let user = await User.findByPk(id)
        if (user === null) {
            response(res, ret_data, 404);
        }
        else {
            console.log(JSON.stringify(user))
            ret_data['data'] = user;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_all_user(req, res) {
    let ret_data = {};

    try {
        let user = await User.findAll()
        // console.log(JSON.stringify(user))
        ret_data['data'] = user;
        ret_data['total'] = user.length
        ret_data['page'] = 1
        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_user_blogs_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let user = await User.findByPk(id)
        if (user === null) {
            response(res, ret_data, 404);
        }
        else {
            let blogs = await user.getBlogs()
            console.log(JSON.stringify(blogs))
            ret_data['data'] = blogs;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

module.exports = {
    add_user,
    update_user,
    delete_user,
    get_user_by_id,
    get_all_user,
    get_user_blogs_by_id
};
