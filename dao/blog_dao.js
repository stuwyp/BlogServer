const {Blog} = require('./model')
const QueryString = require("querystring");
const {response} = require('../config/response')


async function add_blog(req, res) {
    let post_data = '';
    let ret_data = {};

    req.on('data', (chunk) => {
        post_data += chunk;
    });
    req.on('end', async () => {
        try {
            post_data = QueryString.parse(post_data);
            console.log(JSON.stringify(post_data));
            let title = post_data['title'];
            let content = post_data['content'];
            let description = post_data['description'];
            // let category_id = 1;
            let created_at = post_data['created_at'];
            let updated_at = post_data['created_at'];
            let state = 1
            let user_id = post_data['user_id'];
            let blog = await Blog.create({
                title: title,
                content: content,
                description: description,
                created_at: created_at,
                updated_at: updated_at,
                state: state,
                user_id: user_id,
            })
            console.log(JSON.stringify(blog))
            ret_data['id'] = blog.id;
            response(res, ret_data, 201);
        }
        catch (err) {
            console.log(err.message);
            response(res, ret_data, 400);
        }
    })
};

async function delete_blog(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let blog = await Blog.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(blog))
            if (blog > 0) {
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

async function update_blog(req, res) {
    let put_data = '';
    let ret_data = {};
    let id = req.params.id;
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
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
            let title = put_data['title'];
            let content = put_data['content'];
            let description = put_data['description'];
            // let category_id = 1;
            let created_at = put_data['created_at'];
            let updated_at = put_data['created_at'];
            let state = 1
            let user_id = put_data['user_id'];
            let blog = await Blog.update(
                {
                    title: title,
                    content: content,
                    description: description,
                    created_at: created_at,
                    updated_at: updated_at,
                    state: state,
                    user_id: user_id,
                },
                {
                    where: {
                        id: id
                    }
                })
            console.log(JSON.stringify(blog[0]))
            if (blog[0] > 0) {
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

async function get_blog_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            response(res, ret_data, 404);
        }
        else {
            console.log(JSON.stringify(blog))
            ret_data['data'] = blog;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_all_blog(req, res) {
    let ret_data = {};

    try {
        let blog = await Blog.findAll()
        // console.log(JSON.stringify(blog))
        ret_data['data'] = blog;
        ret_data['total'] = blog.length
        ret_data['page'] = 1
        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_blog_comments_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            response(res, ret_data, 404);
        }
        else {
            let comments = await blog.getComments()
            console.log(JSON.stringify(comments))
            ret_data['data'] = comments;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

module.exports = {
    add_blog,
    update_blog,
    delete_blog,
    get_blog_by_id,
    get_all_blog,
    get_blog_comments_by_id
};
