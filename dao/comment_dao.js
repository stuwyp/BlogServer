const {Comment} = require('./model')
const QueryString = require("querystring");
const {response} = require('../config/response')


async function add_comment(req, res) {
    let post_data = '';
    let ret_data = {};

    req.on('data', (chunk) => {
        post_data += chunk;
    });
    req.on('end', async () => {
        try {
            post_data = QueryString.parse(post_data);
            console.log(JSON.stringify(post_data));
            let content = post_data['content'];
            let created_at = post_data['created_at'];
            let updated_at = post_data['created_at'];
            let state = 1
            let blog_id = post_data['blog_id'];
            let comment = await Comment.create({
                content: content,
                created_at: created_at,
                updated_at: updated_at,
                state: state,
                blog_id: blog_id,
            })
            console.log(JSON.stringify(comment))
            ret_data['id'] = comment.id;
            response(res, ret_data, 201);
        }
        catch (err) {
            console.log(err.message);
            response(res, ret_data, 400);
        }
    })
};

async function delete_comment(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let comment = await Comment.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(comment))
            if (comment > 0) {
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

async function update_comment(req, res) {
    let put_data = '';
    let ret_data = {};
    let id = req.params.id;
    try {
        let comment = await Comment.findByPk(id)
        if (comment === null) {
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
            let content = put_data['content'];
            let created_at = put_data['created_at'];
            let updated_at = put_data['created_at'];
            let state = 1
            let blog_id = put_data['blog_id'];
            let comment = await Comment.update(
                {
                    content: content,
                    created_at: created_at,
                    updated_at: updated_at,
                    state: state,
                    blog_id: blog_id,
                },
                {
                    where: {
                        id: id
                    }
                })
            console.log(JSON.stringify(comment[0]))
            if (comment[0] > 0) {
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

async function get_comment_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let comment = await Comment.findByPk(id)
        if (comment === null) {
            response(res, ret_data, 404);
        }
        else {
            console.log(JSON.stringify(comment))
            ret_data['data'] = comment;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_all_comment(req, res) {
    let ret_data = {};

    try {
        let comment = await Comment.findAll()
        // console.log(JSON.stringify(comment))
        ret_data['data'] = comment;
        ret_data['total'] = comment.length
        ret_data['page'] = 1
        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}


module.exports = {
    add_comment,
    update_comment,
    delete_comment,
    get_comment_by_id,
    get_all_comment
};
