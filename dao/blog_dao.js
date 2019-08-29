const {Blog,User} = require('./model')
const {response} = require('./response')


async function add_blog(req, res) {
    let ret_data = {};
    let post_data = req.body;
    console.log(JSON.stringify(post_data));
    let title = post_data['title'];
    let content = post_data['content'];
    let description = post_data['description'];
    // let category_id = 1;
    let created_at = post_data['created_at'];
    let updated_at = post_data['created_at'];
    let state = 1
    let user_id = post_data['user_id'];
    try {
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

}

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
}

async function update_blog(req, res) {
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


    let put_data = req.body
    console.log(JSON.stringify(put_data));
    let title = put_data['title'];
    let content = put_data['content'];
    let description = put_data['description'];
    // let category_id = 1;
    let created_at = put_data['created_at'];
    let updated_at = put_data['created_at'];
    let state = 1
    let user_id = put_data['user_id'];
    try {
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

}

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
    let currentPage = parseInt(req.query.page) || 1
    try {
        let countPerPage = 10
        if (currentPage <= 0)
            currentPage = 1
        let queryResult = await Blog.findAndCountAll({
            limit: countPerPage, // 每页多少条
            offset: countPerPage * (currentPage - 1), // 跳过多少条
            order: [
                ['updated_at', 'DESC']
            ]
        })

        let pageCount = Math.ceil(queryResult.count / countPerPage)

        ret_data['data'] = queryResult.rows
        ret_data['total'] = queryResult.count
        ret_data['page'] = currentPage
        ret_data['pageCount'] = pageCount
        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_blogs_by_user_id(req, res) {
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
    add_blog,
    update_blog,
    delete_blog,
    get_blog_by_id,
    get_all_blog,
    get_blogs_by_user_id
};
